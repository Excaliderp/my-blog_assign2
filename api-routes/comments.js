import { supabase } from "../lib/supabaseClient";

export const commentsCacheKey = "api/comments"

export const getComments = async (postId) => {
  const { data, error, status } = await supabase.
    from("comments")
    .select()
    .eq("post_id", postId)

  return { data, error, status };
  
  //Handle get all comments
};

export const addComment = async (_, {arg: newComment}) => {
  const { data, error, status } = await supabase
  .from("comments")
  .insert(newComment)
  .single()
  .eq("post_id", newComment.postId)
  //Handle add comment here

  console.log(error)

  console.log(newComment)
  console.log(newComment.postId)

  return {data, error, status}
};

export const removeComment = () => {
  //Handle remove comment here
};
