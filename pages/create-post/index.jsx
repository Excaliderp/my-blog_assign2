import BlogEditor from "@/components/blog-editor";
import { createSlug } from "@/utils/createSlug";
import { addPost, postsCacheKey } from "../../api-routes/posts";
import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation"
import { useUser } from "@supabase/auth-helpers-react";

export default function CreatePost() {
  const router = useRouter();
  const {trigger: addTrigger, isMutating} = useSWRMutation(postsCacheKey, addPost, {
    onError: (error) => {
      console.log(error)
    }
  })
  const user = useUser();

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    const slug = createSlug(titleInput);
    console.log({ editorContent, titleInput, image, slug });
    const newPost = {
      body: editorContent,
      title: titleInput,
      slug,
      user_id: user.id,
      image,
    }

    const {status, error} = await addTrigger(newPost)

    console.log(error)

    if(!error) {
      router.push(`/blog/${slug}`)
    }
  };

  return (
    <BlogEditor
      heading="Create post"
      onSubmit={handleOnSubmit}
      buttonText="Upload post"
    />
  );
}