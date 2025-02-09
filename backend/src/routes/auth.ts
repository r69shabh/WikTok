import express from 'express';
import fetch from 'node-fetch';
import { supabase } from '../lib/supabase';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const clientId = process.env.WIKIPEDIA_CLIENT_ID;
const clientSecret = process.env.WIKIPEDIA_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI || 'http://localhost:5173/auth/callback';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

if (!clientId || !clientSecret) {
  throw new Error('Missing required Wikipedia OAuth credentials');
}

// Helper function to exchange code for access token
async function getWikipediaAccessToken(code: string): Promise<any> {
  const tokenResponse = await fetch('https://meta.wikimedia.org/w/rest.php/oauth2/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    }).toString()
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  return tokenResponse.json();
}

// Helper function to get Wikipedia user info
async function getWikipediaUserInfo(accessToken: string): Promise<any> {
  const userResponse = await fetch('https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!userResponse.ok) {
    const error = await userResponse.text();
    throw new Error(`Failed to get user info: ${error}`);
  }

  return userResponse.json();
}

// Helper function to create or update Supabase user
async function handleSupabaseUser(userData: any, tokenData: any) {
  // First, check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', userData.username)
    .single();

  if (!existingUser) {
    // Create new user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: `${userData.username}@wikipedia.org`,
      email_confirm: true,
      user_metadata: {
        username: userData.username,
        wiki_id: userData.sub
      }
    });

    if (authError) throw authError;

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        username: userData.username,
        wiki_token: tokenData.access_token,
        updated_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    return authUser.user;
  } else {
    // Update existing user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        wiki_token: tokenData.access_token,
        updated_at: new Date().toISOString()
      })
      .eq('username', userData.username);

    if (updateError) throw updateError;

    return existingUser;
  }
}

router.get('/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    console.error('OAuth error:', error, error_description);
    return res.redirect(`${frontendUrl}?error=${encodeURIComponent(error_description as string || 'Authentication failed')}`);
  }

  if (!code) {
    return res.redirect(`${frontendUrl}?error=no_code`);
  }

  try {
    // Get access token
    const tokenData = await getWikipediaAccessToken(code as string);
    
    // Get user info
    const userData = await getWikipediaUserInfo(tokenData.access_token);
    
    // Handle Supabase user creation/update
    const user = await handleSupabaseUser(userData, tokenData);

    // Create session
    const { data: session, error: sessionError } = await supabase.auth.admin.createSession({
      user_id: user.id
    });

    if (sessionError) throw sessionError;

    // Redirect with session token
    res.redirect(`${frontendUrl}?session=${session.access_token}`);
  } catch (error) {
    console.error('Auth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.redirect(`${frontendUrl}?error=${encodeURIComponent(errorMessage)}`);
  }
});

export default router;