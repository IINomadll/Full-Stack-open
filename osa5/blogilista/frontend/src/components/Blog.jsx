import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, blogs, setBlogs }) => {
  const [viewAll, setViewAll] = useState(false);
  const blogStyle = {
    paddingLeft: 5,
    border: "solid",
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
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
        </div>
      ) : (
        <div style={blogStyle}>
          <p>
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
