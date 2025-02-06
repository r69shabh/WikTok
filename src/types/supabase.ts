export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          wiki_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          wiki_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          wiki_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: number
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: number
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types similarly
    }
  }
}