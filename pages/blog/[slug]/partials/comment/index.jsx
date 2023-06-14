import Button from "@components/button";
import styles from "./comment.module.css";
import { commentsCacheKey, removeComment } from "../../../../../api-routes/comments";
import useSWRMutation from "swr/mutation"
import { addReply, getReplies, replyCacheKey } from "../../../../../api-routes/replies";
import useSWR from "swr";

export default function Comment({ comment, createdAt, author, id, commentId }) {

  const { data: { data = [] } = {}, error } = useSWR(commentId ? replyCacheKey : null, () =>
    getReplies(commentId)
  )

  const { trigger: removeTrigger, isMutating } = useSWRMutation(
    commentsCacheKey,
    removeComment, {
    onError: (error) => {
      console.log(error)
    }
  })

  const { trigger: replyTrigger, isMutating: replyMutation } = useSWRMutation(
    replyCacheKey,
    addReply, {
    onError: (error) => {
      console.log(error)
    }
  })

  const handleDelete = async () => {
    console.log({ id });

    const { data, error } = await removeTrigger(id)
  };

  const replyId = data.id

  const handleReply = async () => {
    console.log(replyId)
    console.log({ id })
    console.log(commentId)

    // const { data, error } = await replyTrigger()
  }

  return (
    <div className={styles.container}>
      <p>{comment}</p>
      <p className={styles.author}>{author}</p>
      <time className={styles.date}>{createdAt}</time>

      {/* The Delete part should only be showed if you are authenticated and you are the author */}
      <div className={styles.buttonContainer}>
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={handleReply}>Reply</Button>

      </div>
      {data.map((reply) => (
        <div>{reply.body}</div>
      ))}

    </div>
  );
}
