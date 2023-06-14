import { supabase } from "../lib/supabaseClient";
import { uploadImage } from "../utils/uploadImage";

export const postsCacheKey = "api/blogs";

export const getPosts = async () => {
  const { data, error, status } = await supabase.from("posts").select();
  return { data, error, status };
};

export const getPost = async ({ slug }) => {
  const { data, error, status } = await supabase
    .from("posts")
    .select()
    .single()
    .eq("slug", slug);

  return { error, status, data };
};

export const addPost = async (_, { arg: newPost }) => {
  let image = ""

  if (newPost?.image) {
   const {publicUrl, error} = await uploadImage(newPost?.image);

   if (!error) {
    image = publicUrl;
   }
  }

  console.log(image)
  const { data, error, status } = await supabase
    .from("posts")
    .insert({...newPost, image})
    .select()
    .single();

  return { error, status, data };
};

export const removePost = async (_, { arg: postId }) => {
  const { data, error, status } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);

  return { error, status, data };
};

export const editPost = async (_, { arg: editedPost }) => {
  let image = editedPost?.image ?? "";

  const isNewImage = typeof image === "object" && image !== null;

  if(isNewImage) {
    const {publicUrl, error} = await uploadImage(editedPost?.image);

    if (!error) {
     image = publicUrl;
    }
  }

  const { data, error, status } = await supabase
    .from("posts")
    .update({...editedPost, image})
    .select()
    .single()
    .eq("id", editedPost.id);

  return { error, status, data };
};
