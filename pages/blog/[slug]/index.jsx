import { useRouter } from "next/router";
import styles from "./blog-post.module.css";
import Comments from "./partials/comments";
import AddComment from "./partials/add-comment";
import Button from "@components/button";
import Heading from "@components/heading";
import BlogImageBanner from "@components/blog-image-banner";
import useSWR from "swr";
import useSWRMutation from "swr/mutation"

import { getPost, postsCacheKey, removePost } from "../../../api-routes/posts";

export default function BlogPost() {
  const router = useRouter();

  /* Use this slug to fetch the post from the database */
  const { slug } = router.query;

  const { data : { data: post = {} } = {}, error } = useSWR(slug ? `${postsCacheKey}${slug}` : null, () => 
    getPost({ slug })
  
  );

  const {trigger: removeTrigger} = useSWRMutation(postsCacheKey, removePost)
  // const removedPost = { id: post.id }
  
  const handleDeletePost = async () => {
    const postId = post.id
    console.log({ id: post.id });
    console.log({id: postId})

    const {status, error} = await removeTrigger(postId)

    if (!error) {
      // Deletion was successful
      router.push("/blog"); // Redirect to home page
    } else {
      console.error("Error deleting post:", error);
    }
  };
  
  const handleEditPost = () => {
    router.push(`/blog/${slug}/edit`);
  };
  
  return (
    <>
      <section className={styles.container}>
        <Heading>{post.title}</Heading>
        {post?.image && <BlogImageBanner src={post.image} alt={post.title} />}
        <div className={styles.dateContainer}>
          <time className={styles.date}>{post.created_at}</time>
          <div className={styles.border} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
        <span className={styles.author}>Author: {post.author}</span>

        {/* The Delete & Edit part should only be showed if you are authenticated and you are the author */}
        <div className={styles.buttonContainer}>
          <Button onClick={handleDeletePost}>Delete</Button>
          <Button onClick={handleEditPost}>Edit</Button>
        </div>
      </section>

      <Comments postId={post.id} />

      {/* This component should only be displayed if a user is authenticated */}
      <AddComment postId={post.id} />
    </>
  );
}
