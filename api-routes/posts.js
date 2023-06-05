import { supabase } from "../lib/supabaseClient";

export const postsCacheKey = "api/blogs"

export const getPosts = async () => {
  const { data, error, status } = await supabase.from("posts").select();
  return { data, error, status }
  //Handle get all posts
};

export const getPost = async ({ slug }) => {
  const { data, error, status } = await supabase
    .from("posts")
    .select()
    .single()
    .eq("slug", slug)

  return{ error, status, data }
  //Handle get one post
};

export const addPost = () => {
  //Handle add post here
};

export const removePost = () => {
  //Handle remove post here
};

export const editPost = () => {
  //Handle edit post here
};
