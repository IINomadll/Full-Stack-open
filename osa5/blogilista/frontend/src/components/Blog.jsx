import { useState } from "react";

const Blog = ({ blog }) => {
  const [viewAll, setViewAll] = useState(false);
  const blogStyle = {
    paddingLeft: 5,
    border: "solid",
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
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
            likes: {blog.likes}&ensp;<button>like</button>
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
