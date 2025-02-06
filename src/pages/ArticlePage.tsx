import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Article } from '../components/Article';
import { supabase } from '../lib/supabase';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (data) {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!article) {
    return <div className="flex justify-center p-8">Article not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Article
        id={article.id}
        title={article.title}
        content={article.content}
      />
    </div>
  );
};

export default ArticlePage;