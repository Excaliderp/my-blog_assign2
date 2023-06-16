import Link from "next/link";
import styles from "./blog.module.css";
import Heading from "@components/heading";
import useSWR from "swr";
import { getPosts, postsCacheKey, searchPost } from "../../api-routes/posts";
import { useRef } from "react";
import useSWRMutation from "swr/mutation"
import Input from "@components/input";
import Label from "@components/label";
import Button from "@components/button";



export default function Blog() {
  const { data: { data = [] } = {} } = useSWR(postsCacheKey, getPosts)

  const { trigger: searchTrigger } = useSWRMutation(
    postsCacheKey,
    searchPost, {
    onError: (error) => {
      console.log(error)
    }
  })

  const formRef = useRef();

  const handleSearchBar = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { searchText } = Object.fromEntries(formData);

    const { status, data, error } = await searchTrigger(searchText)


    formRef.current.reset();

  }

  return (
    <section>
      <Heading>Blog</Heading>

      <form ref={formRef} onSubmit={handleSearchBar}>
        <div className={styles.buttonContainer}>
          <Label htmlFor="replyText" />
          <Input id="searchText" name="searchText" />
          <Button type="submit">Search</Button>
        </div>
      </form>


      {data?.map((post) => (
        <Link
          key={post.slug}
          className={styles.link}
          href={`/blog/${post.slug}`}
        >
          <div className="w-full flex flex-col">
            <p>{post.title}</p>
            <time className={styles.date}>{post.created_at}</time>
          </div>
        </Link>
      ))}
    </section>
  );
}
