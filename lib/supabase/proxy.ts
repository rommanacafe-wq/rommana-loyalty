import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.https://xisiuptrpbgblxinameo.supabase.co/rest/v1/!,
    process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpc2l1cHRycGJnYmx4aW5hbWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTAzODUsImV4cCI6MjA5MTA4NjM4NX0.PX1PuvzcCOqX54q99Dp23BuTjXp296wYKeKJQmg5KJY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })

          response = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh the session if needed
  await supabase.auth.getUser()

  return response
}