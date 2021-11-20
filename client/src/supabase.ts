import { createClient } from "@supabase/supabase-js";

const anon = import.meta.env.VITE_REACT_NATIVE_SUPABASE_ANON_KEY as string;
const url = import.meta.env.VITE_REACT_NATIVE_SUPABASE_URL as string;

console.log(anon);
export const supabase = createClient(url, anon);
