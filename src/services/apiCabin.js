import supabase, { supabaseUrl } from "./supabaseClient";

// GET all cabins
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

// CREATE a new cabin
export async function createCabin(cabin) {
  // Generate unique image name
  const imageName = `${Date.now()}-${cabin.image.name}`.replaceAll("/", "");
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // Upload image first
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, cabin.image);
  if (storageError) {
    console.error("Image upload error:", storageError);
    throw new Error("Image could not be uploaded");
  }

  // Insert cabin with image path
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...cabin, image: imagePath }])
    .select();
  if (error) {
    console.error("Cabin creation error:", error);
    throw new Error("Could not create cabin");
  }

  return data[0]; // return inserted cabin
}

// UPDATE existing cabin
export async function updateCabin(id, cabin) {
  let imagePath = cabin.image;

  // If a new image is provided, upload it
  if (cabin.image instanceof File) {
    const imageName = `${Date.now()}-${cabin.image.name}`.replaceAll("/", "");
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, cabin.image, { upsert: true });
    if (storageError) {
      console.error("Image upload error:", storageError);
      throw new Error("Image could not be uploaded");
    }
  }

  const { data, error } = await supabase
    .from("cabins")
    .update({ ...cabin, image: imagePath })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Cabin update error:", error);
    throw new Error("Could not update cabin");
  }

  return data[0]; // return updated cabin
}

// DELETE a cabin
export async function deleteCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error("Cabin deletion error:", error);
    throw new Error("Could not delete cabin");
  }

  return data[0]; // return deleted cabin
}
