// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kuksbatlyjmazdhjmdnb.supabase.co"
const supabaseKey = "sb_publishable_umdq1N-nXa9qVoICbrJYkQ_mw9sn-U4"

export const supabase = createClient(supabaseUrl, supabaseKey)