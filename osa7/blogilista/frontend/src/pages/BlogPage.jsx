import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import blogService from "../services/blogs";

const BlogPage = ({ blogs }) => {
  const [comment, setComment] = useState("");
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

  const commentBlogMutation = useMutation({
    mutationFn: blogService.comment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogsAndUsers"] });
    },
  });

  const handleLike = () => {
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    updateBlogMutation.mutate(likedBlog);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    commentBlogMutation.mutate({ id, comment });
    setComment(""); // clear input field
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
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input
          id="comment"
          name="comment"
          type="text"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          required
        ></input>
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </>
  );
};

export default BlogPage;
