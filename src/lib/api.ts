import { supabase } from './supabase';

export const handleApiError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'Server error');
  }
  throw new Error('Network error');
};

export const articleAPI = {
  async getLikes(articleId: number) {
    try {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('article_id', articleId);
      return count || 0;
    } catch (error) {
      handleApiError(error);
    }
  },
};

  async toggleLike(articleId: number, userId: string) {
    const { data: existingLike } = await supabase
      .from('likes')
      .select()
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      return supabase
        .from('likes')
        .delete()
        .eq('article_id', articleId)
        .eq('user_id', userId);
    }

    return supabase
      .from('likes')
      .insert({ article_id: articleId, user_id: userId });
  },

  async getComments(articleId: number) {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(username),
        replies:comments(
          *,
          user:users(username)
        )
      `)
      .eq('article_id', articleId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async addComment(articleId: number, userId: string, content: string, parentId?: string) {
    return supabase
      .from('comments')
      .insert({
        article_id: articleId,
        user_id: userId,
        content,
        parent_id: parentId
      })
      .select(`
        *,
        user:users(username)
      `)
      .single();
  },

  async toggleBookmark(articleId: number, userId: string) {
    const { data: existingBookmark } = await supabase
      .from('bookmarks')
      .select()
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .single();

    if (existingBookmark) {
      return supabase
        .from('bookmarks')
        .delete()
        .eq('article_id', articleId)
        .eq('user_id', userId);
    }

    return supabase
      .from('bookmarks')
      .insert({ article_id: articleId, user_id: userId });
  }
};