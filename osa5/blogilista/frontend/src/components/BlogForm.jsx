import React from "react";
import { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ blogs, setBlogs, setMessage, setErrorMessage }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const newBlog = await blogService.create(formData);
      if (newBlog && newBlog.id) {
        // ensure newBlog had an id created by db
        setBlogs(blogs.concat(newBlog));
        setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setFormData({ title: "", author: "", url: "", likes: 0 });
      } else {
        console.error(
          "Error: Blog creation response missing ID or data",
          newBlog
        );
      }
    } catch (error) {
      setErrorMessage("an error occured while trying to create the blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.error("Error creating blog:", error);
    }
  };

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={submitHandler}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <br />
          <label>
            Author:
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
            <br />
            <label>
              url:
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                required
              />
              <br />
              <label>
                Likes:
                <input
                  type="number"
                  name="likes"
                  value={formData.likes}
                  onChange={handleInputChange}
                />
                <br />
                <button type="submit">create</button>
              </label>
            </label>
          </label>
        </label>
      </form>
    </>
  );
};

export default BlogForm;
