import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// OAuth callback endpoint
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  const clientId = process.env.WIKI_CLIENT_ID;
  const clientSecret = process.env.WIKI_CLIENT_SECRET;
  const redirectUri = `${process.env.FRONTEND_URL}/auth/callback`;

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://meta.wikimedia.org/w/rest.php/oauth2/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`
    });

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();

    // Create or update user in database
    const user = await prisma.user.upsert({
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
    const like = await prisma.like.create({
      data: {
        userId,
        articleId: parseInt(id)
      }
    });
    res.json(like);
  } catch (error) {
    res.status(400).json({ error: 'Failed to like article' });
  }
});

// Unlike an article
app.delete('/api/articles/:id/like', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    await prisma.like.delete({
      where: {
        userId_articleId: {
          userId,
          articleId: parseInt(id)
        }
      }
    });
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