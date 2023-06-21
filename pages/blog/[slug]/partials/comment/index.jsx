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

    const formData = new FormData(formRef.current);
    const replyText = formData.get('replyText');
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
      <p className={styles.author}>{author}</p>
      <p className={styles.comment}>{comment}</p>
      <time className={styles.date}>{createdAt}</time>

      {data.map((reply) => (
        <div key={reply.id}>
          <p className={styles.replyText}>| {reply.body}</p>
          <button className={styles.removeReplyButton} onClick={() => handleRemoveReply(reply.id)}>Remove reply</button>
        </div>
      ))}

        <form className={styles.commentButtons} ref={formRef}>
          <Button className={styles.commentButton} onClick={handleDeleteComment}>Delete</Button>
          <Label htmlFor="replyText" />
          <Input className={styles.commentButton} id="replyText" name="replyText" placeholder="Enter your reply here..." />
          <Button className={styles.commentButton} type="submit" onClick={handleAddReply}>Send</Button>
        </form>
    </div>
  );
}
