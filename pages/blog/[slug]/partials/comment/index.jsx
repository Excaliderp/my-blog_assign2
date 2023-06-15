import Button from "@components/button";
import styles from "./comment.module.css";
import { commentsCacheKey, removeComment } from "../../../../../api-routes/comments";
import useSWRMutation from "swr/mutation"
import { addReply, getReplies, replyCacheKey } from "../../../../../api-routes/replies";
import useSWR from "swr";
import Input from "../../../../../components/input";
import Label from "@components/label";
import { useRef } from "react";


export default function Comment({ comment, createdAt, author, id: commentId }) {

  const formRef = useRef();
 
  const { data: { data = [] } = {}, error } = useSWR(
    commentId ? replyCacheKey : null,
    () => getReplies(commentId)
  );

  const { trigger: removeTrigger } = useSWRMutation(
    commentsCacheKey,
    removeComment, {
    onError: (error) => {
      console.log(error)
    }
  })

  const { trigger: replyTrigger } = useSWRMutation(
    replyCacheKey,
    addReply, {
    onError: (error) => {
      console.log(error)
    }
  })

  const handleDelete = async () => {

    const { data, error } = await removeTrigger(commentId)
  };

  const handleReply = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const { replyText } = Object.fromEntries(formData);
  
    const newReply = {
      body: replyText,
      comment_id: commentId,
    }
    
    const { status, data, error } = await replyTrigger(newReply)
  
    formRef.current.reset();
  };

  return (
    <div className={styles.container}>
      <p>{comment}</p>
      <p className={styles.author}>{author}</p>
      <time className={styles.date}>{createdAt}</time>
  
      {data.map((reply) => (
        <p className={styles.replyText} key={reply.id}>| {reply.body}</p>
      ))}
  
      {/* Add the <form> element and onSubmit event handler */}
      <form ref={formRef} onSubmit={handleReply}>
        <div className={styles.buttonContainer}>
          <Button onClick={handleDelete}>Delete</Button>
          <Label htmlFor="replyText">Reply</Label>
          <Input id="replyText" name="replyText" />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
