import Button from "@components/button";
import styles from "./comment.module.css";
import { commentsCacheKey, removeComment } from "../../../../../api-routes/comments";
import useSWRMutation from "swr/mutation"
import { addReply, getReplies, removeReply, replyCacheKey } from "../../../../../api-routes/replies";
import useSWR from "swr";
import Input from "@components/input";
import Label from "@components/label";
import { useRef } from "react";


export default function Comment({ comment, createdAt, author, id: commentId }) {

  const formRef = useRef();

  const { data: { data = [] } = {}, error } = useSWR(
    commentId ? `${replyCacheKey}/${commentId}` : null,
    () => getReplies(commentId)
  );

  const { trigger: removeCommentTrigger } = useSWRMutation(
    commentsCacheKey,
    removeComment, {
    onError: (error) => {
      console.log(error)
    }
  })

  const { trigger: addReplyTrigger } = useSWRMutation(
    `${replyCacheKey}/${commentId}`,
    addReply, {
    onError: (error) => {
      console.log(error)
    }
  })

  const { trigger: removeReplyTrigger } = useSWRMutation(
    `${replyCacheKey}/${commentId}`,
    removeReply, {
    onError: (error) => {
      console.log(error)
    }
  })

  const handleDeleteComment = async () => {
    const { data, error } = await removeCommentTrigger(commentId)
  };

  const handleAddReply = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { replyText } = Object.fromEntries(formData);

    const newReply = {
      body: replyText,
      comment_id: commentId,
    }
    const { status, data, error } = await addReplyTrigger(newReply)
    formRef.current.reset();

    console.log(error)
  };

  const handleRemoveReply = async (replyId) => {
    const { data, error } = await removeReplyTrigger(replyId)
  }

  return (
    <div className={styles.container}>
      <p>{comment}</p>
      <p className={styles.author}>{author}</p>
      <time className={styles.date}>{createdAt}</time>

      {data.map((reply) => (
        <div key={reply.id}>
          <p className={styles.replyText}>| {reply.body}</p>
          <button className={styles.removeReplyButton} onClick={() => handleRemoveReply(reply.id)}>Remove reply</button>
        </div>
      ))}

      <Button onClick={handleDeleteComment}>Delete</Button>
      <form ref={formRef}>
        <div className={styles.buttonContainer}>
          <Label htmlFor="replyText">Reply</Label>
          <Input id="replyText" name="replyText" />
          <Button type="submit" onClick={handleAddReply}>Send</Button>
        </div>
      </form>
    </div>
  );
}
