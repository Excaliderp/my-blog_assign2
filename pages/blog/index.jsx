import Link from "next/link";
import styles from "./blog.module.css";
import Heading from "@components/heading";
import useSWR from "swr";
import { postsCacheKey, searchPost } from "../../api-routes/posts";
import { useEffect, useRef, useState } from "react";
import useSWRMutation from "swr/mutation"
import Input from "@components/input";
import Label from "@components/label";

export default function Blog() {
  const [searchText, setSearchText] = useState("")

  const { trigger: searchTrigger, data: { data = [] } = {} } = useSWRMutation(
    `${postsCacheKey}/${searchText}`,
    searchPost, {
    onError: (error) => {
      console.log(error)
    }
  })

  useEffect (() => {
    const fetchData = async () => {
      await searchTrigger(searchText);
    }
    fetchData();
  }, []);

  const formRef = useRef();

  const handleOnChange = async (event) => {
    setSearchText(event.target.value)
    await searchTrigger(event.target.value)
  }

  return (
    <section>
      <Heading>Blog</Heading>

      <form ref={formRef}>
        <div className={styles.buttonContainer}>
          <Label htmlFor="replyText" />
          <Input 
          onChange={handleOnChange}
          value={searchText}
          id="searchText" 
          name="searchText"
          />
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
