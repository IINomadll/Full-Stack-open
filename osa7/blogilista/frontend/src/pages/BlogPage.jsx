import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import blogService from "../services/blogs";

const BlogPage = ({ blogs }) => {
  const id = useParams().id;
  const blog = blogs.find((b) => b.id === id);

  // needed for mutation
  const queryClient = useQueryClient();

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogsAndUsers"] });
    },
  });

  const handleLike = () => {
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    updateBlogMutation.mutate(likedBlog);
  };

  return (
    <>
      <h2>
        {blog.title} | {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes&ensp;<button onClick={handleLike}>like</button>
      </p>
    </>
  );
};

export default BlogPage;
