import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { supabase } from './lib/supabase';
import { PrismaClient } from '@prisma/client';
const token = require('jsonwebtoken').sign(

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Like an article
app.post('/api/articles/:id/like', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('likes')
      .insert({
        article_id: parseInt(id),
        user_id
      });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to like article' });
  }
});

// Unlike an article
app.delete('/api/articles/:id/like', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .match({ article_id: parseInt(id), user_id });

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to unlike article' });
  }
});

// Add a comment
app.post('/api/articles/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { user_id, content, parent_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        content,
        article_id: parseInt(id),
        user_id,
        parent_id
      })
      .select('*, user:users(*)');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add comment' });
  }
});

// Get article interactions
app.get('/api/articles/:id/interactions', async (req, res) => {
  const { id } = req.params;

  try {
    const [{ count: likes }, { data: comments }] = await Promise.all([
      supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('article_id', parseInt(id)),
      supabase
        .from('comments')
        .select('*, user:users(*), replies:comments(*)')
        .eq('article_id', parseInt(id))
        .is('parent_id', null)
    ]);

    res.json({ likes, comments });
  } catch (error) {
    res.status(400).json({ error: 'Failed to get article interactions' });
  }
});
      where: { username: userData.username },
      update: { token: tokenData.access_token },
      create: {
        username: userData.username,
        token: tokenData.access_token
      }
    });

    // Create JWT for frontend
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Redirect back to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    console.error('Auth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  }
});

// Like an article
app.post('/api/articles/:id/like', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const { data, error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        article_id: parseInt(id)
      });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to like article' });
  }
});

// Unlike an article
app.delete('/api/articles/:id/like', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .match({ 
        user_id: userId,
        article_id: parseInt(id)
      });

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to unlike article' });
  }
});

// Add a comment
app.post('/api/articles/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { userId, content, parentId } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        articleId: parseInt(id),
        parentId
      },
      include: {
        user: true,
        replies: true
      }
    });
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add comment' });
  }
});

// Bookmark an article
app.post('/api/articles/:id/bookmark', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        articleId: parseInt(id)
      }
    });
    res.json(bookmark);
  } catch (error) {
    res.status(400).json({ error: 'Failed to bookmark article' });
  }
});

// Remove bookmark
app.delete('/api/articles/:id/bookmark', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    await prisma.bookmark.delete({
      where: {
        userId_articleId: {
          userId,
          articleId: parseInt(id)
        }
      }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to remove bookmark' });
  }
});

// Get article interactions
app.get('/api/articles/:id/interactions', async (req, res) => {
  const { id } = req.params;

  try {
    const [likes, comments, bookmarks] = await Promise.all([
      prisma.like.count({ where: { articleId: parseInt(id) } }),
      prisma.comment.findMany({
        where: { articleId: parseInt(id) },
        include: {
          user: true,
          replies: {
            include: {
              user: true
            }
          }
        }
      }),
      prisma.bookmark.count({ where: { articleId: parseInt(id) } })
    ]);

    res.json({ likes, comments, bookmarks });
  } catch (error) {
    res.status(400).json({ error: 'Failed to get article interactions' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});