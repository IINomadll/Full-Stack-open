import React from "react";
import { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ createBlog }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(formData);
    setFormData({ title: "", author: "", url: "", likes: 0 });
  };

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
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
