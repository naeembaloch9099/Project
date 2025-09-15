// src/services/apiSetting.js
import supabase from "./supabaseClient";

// Fetch settings
export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();
  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

// Update settings
export async function updateSetting(id, settingData) {
  const { data, error } = await supabase
    .from("settings") // make sure table name is correct
    .update(settingData)
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data;
}
