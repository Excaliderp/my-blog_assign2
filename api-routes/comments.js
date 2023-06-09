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

export const addComment = () => {
  //Handle add comment here
};

export const removeComment = () => {
  //Handle remove comment here
};
