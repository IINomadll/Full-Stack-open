import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import {
  useNotifyMessage,
  useNotifyError,
} from "../contexts/NotificationContext";

const Blog = ({ blog, user }) => {
  const [viewAll, setViewAll] = useState(false);
  const notifyMessage = useNotifyMessage();
  const notifyError = useNotifyError();

  // needed for mutation
  const queryClient = useQueryClient();

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogsAndUsers"] });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.eradicate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogsAndUsers"] });
    },
  });

  const blogStyle = {
    paddingLeft: 5,
    border: "solid",
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
  };
  const deleteButtonStyle = {
    marginBottom: 5,
  };

  const handleLike = () => {
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    updateBlogMutation.mutate(likedBlog);
  };

  const handleDelete = () => {
    const choice = window.confirm(
      `Delete blog ${blog.title} by ${blog.author}?`
    );

    if (choice) {
      deleteBlogMutation.mutate(blog.id);
      notifyMessage("Blog deleted successfully");
    } else {
      console.log("Delete action cancelled");
      notifyError("Delete action cancelled");
    }
  };

  // &ensp; is two space gap in html
  return (
    <div>
      {viewAll ? (
        <div style={blogStyle}>
          <p>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
            &ensp;
            <button onClick={() => setViewAll(!viewAll)}>
              {viewAll ? "hide" : "view"}
            </button>
          </p>{" "}
          <p>{blog.url}</p>
          <p>
            likes: {blog.likes}&ensp;
            <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user.name}</p>
          {blog.user.username === user.username ? (
            <button style={deleteButtonStyle} onClick={handleDelete}>
              delete
            </button>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div style={blogStyle}>
          <p className="minimalBlog">
            {blog.title} {blog.author}&ensp;
            <button onClick={() => setViewAll(!viewAll)}>
              {viewAll ? "hide" : "view"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;
