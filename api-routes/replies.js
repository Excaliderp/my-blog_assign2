import { supabase } from "../lib/supabaseClient";

export const replyCacheKey = "api/replies"

export const getComments = async () => {
  const { data, error, status } = await supabase.
    from("replies")
    .select()
    .eq("comment_id", )

  return { data, error, status };
  
  //Handle get all comments
};

export const addComment = async (_, {arg: newReply}) => {
  const { data, error, status } = await supabase
  .from("replies")
  .insert(newReply)
  .single()
  .eq("comment_id", newComment.postId)
  //Handle add comment here

  return {data, error, status}
};

export const removeComment = async (_, {arg: id}) => {
  const { data, error, status } = await supabase
  .from("replies")
  .delete(id)
  .single()
  .eq("id", id)

  return {data, error, status}
  //Handle remove comment here
};
