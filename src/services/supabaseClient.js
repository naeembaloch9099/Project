import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://zavraugalujdowuodfjt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdnJhdWdhbHVqZG93dW9kZmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjY0ODYsImV4cCI6MjA3MjY0MjQ4Nn0.-Y9959amKn43Ypl3goy8nbaRTYKrbkBLj3J9ot9-2WQ";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  return data?.user ?? null;
}
export default supabase;
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
