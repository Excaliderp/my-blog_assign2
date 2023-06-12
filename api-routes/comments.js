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

  return {data, error, status}
};

export const removeComment = async (_, {arg: id}) => {
  const { data, error, status } = await supabase
  .from("comments")
  .delete(id)
  .single()
  .eq("id", id)

  return {data, error, status}
  //Handle remove comment here
};
