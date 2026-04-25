import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.https://xisiuptrpbgblxinameo.supabase.co/rest/v1/!,
    process.env.NEXT_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpc2l1cHRycGJnYmx4aW5hbWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTAzODUsImV4cCI6MjA5MTA4NjM4NX0.PX1PuvzcCOqX54q99Dp23BuTjXp296wYKeKJQmg5KJY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )
}
