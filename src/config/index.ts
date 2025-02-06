interface Config {
  apiUrl: string;
  supabaseUrl: string;
  supabaseKey: string;
  wikipediaClientId: string;
  environment: 'development' | 'production' | 'test';
}

export const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  wikipediaClientId: import.meta.env.VITE_WIKIPEDIA_CLIENT_ID,
  environment: import.meta.env.MODE as 'development' | 'production' | 'test',
};