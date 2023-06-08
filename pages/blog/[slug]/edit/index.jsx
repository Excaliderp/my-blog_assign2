import { useRouter } from "next/router";
import BlogEditor from "../../../../components/blog-editor";
import useSWRMutation from "swr/mutation"
import { editPost, postsCacheKey } from "../../../../api-routes/posts";
import useSWR from "swr";
import { createSlug } from "@/utils/createSlug";

export default function EditBlogPost() {
  const router = useRouter();
  /* Use this slug to fetch the post from the database */
  const { slug } = router.query;

  const { data: { data: post = {} } = {}, error } = useSWR(slug ? `${postsCacheKey}${slug}` : null, () =>
    getPost({ slug })
  );

  const { trigger: editTrigger, isMutating } = useSWRMutation(postsCacheKey, editPost, {
    onError: (error) => {
      console.log(error)
    }
  })

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    const slug = createSlug(titleInput);
    console.log({ editorContent, titleInput, image, slug });
    const id = post.id
    const editedPost = {
      body: editorContent,
      title: titleInput,
      slug
    }
    const { status, error } = await editTrigger({ editedPost, id })

    if (!error) {
      router.push(`/blog/${slug}`)
    } else {
      console.log(error)
    }
  };

  return (
    <BlogEditor
      heading="Edit blog post"
      title={post.title}
      src={post.image}
      alt={post.title}
      content={post.body}
      buttonText="Save changes"
      onSubmit={handleOnSubmit}
    />
  );
}
