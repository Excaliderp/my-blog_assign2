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

export const addPost = async (_, { arg: newPost }) => {
  const { data, error, status } = await supabase
  .from("posts")
  .insert(newPost)
  .select()
  .single()

return{ error, status, data }
  //Handle add post here
};

export const removePost = async (_, { arg: postId }) => {
  const { data, error, status } = await supabase
  .from("posts")
  .delete()
  .eq("id", postId)

  return { error, status, data }
  //Handle remove post here
};

export const editPost = async (_, { arg: { editedPost, id } }) => {
  // const {id, ...postData} = editedPost
  const { data, error, status } = await supabase
  .from("posts")
  .update(editedPost)
  .select()
  .single()
  .eq("id", id)

  // console.log("edit triggades")
  // console.log({editedPost})
  console.log("posts js id " + id)
  // console.log({postData})

return{ error, status, data }
  //Handle edit post here
};
