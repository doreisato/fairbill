import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jeollamxgbmlhvzdgoqt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2xsYW14Z2JtbGh2emRnb3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NzE5OTYsImV4cCI6MjA4ODM0Nzk5Nn0.rDUG2DPy5rB3OVJyOjzBkJAotC8OuBKbZFJFLtlxLxY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)