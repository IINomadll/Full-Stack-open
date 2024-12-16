import { useState } from "react";
import blogService from "../services/blogs";
import {
  useNotifyMessage,
  useNotifyError,
} from "../contexts/NotificationContext";

const Blog = ({ blog, user, blogs }) => {
  const [viewAll, setViewAll] = useState(false);
  const notifyMessage = useNotifyMessage();
  const notifyError = useNotifyError();
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
    blogService
      .update(likedBlog)
      .then((updatedBlog) => {
        setBlogs(
          blogs.map((b) =>
            b.id !== updatedBlog.id ? b : { ...b, likes: updatedBlog.likes }
          )
        );
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDelete = () => {
    const choice = window.confirm(
      `Delete blog ${blog.title} by ${blog.author}?`
    );

    if (choice) {
      blogService
        .eradicate(blog.id)
        .then((response) => {
          console.log("RESPONSE", response);
          setBlogs(blogs.filter((b) => b.id !== blog.id));
          notifyMessage("Blog deleted");
        })
        .catch((err) => {
          console.error("Error deleting the blog:", err);
          notifyError("Error deleting the blog");
        });
    } else console.log("Delete action cancelled.");
  };

  // &ensp; is two space gap in html
  return (
    <div>
      {viewAll ? (
        <div style={blogStyle}>
          <p>
            {blog.title} {blog.author}&ensp;
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
