import express from 'express';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import { supabase } from '../lib/supabase';

const router = express.Router();
const prisma = new PrismaClient();

// OAuth callback endpoint
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
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

    // Get user info from Wikipedia
    const userResponse = await fetch('https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();

    // Create or update user in Supabase
    const { data: supabaseUser, error: supabaseError } = await supabase
      .from('users')
      .upsert({
        username: userData.username,
        wiki_token: tokenData.access_token,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: `${userData.username}@wikipedia.org`,
      email_confirm: true,
      user_metadata: {
        username: userData.username
      }
    });

    if (authError) throw authError;

    // Create or update user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: authUser.id,
        username: userData.username,
        wiki_token: tokenData.access_token,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Create session
    const { data: session, error: sessionError } = await supabase.auth.admin.createSession({
      user_id: authUser.id
    });

    if (sessionError) throw sessionError;

    res.redirect(`${process.env.FRONTEND_URL}?session=${session.access_token}`);
  } catch (error) {
    console.error('Auth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
});

export default router;