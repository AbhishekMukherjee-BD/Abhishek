import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://dbwekxuqagtljaidfebp.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid2VreHVxYWd0bGphaWRmZWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDMwNDEsImV4cCI6MjA5NjU3OTA0MX0.3oBdSz8u3WPGEg694ulFuLWvZHW2eV_Xv_rhlCUBf6E";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
