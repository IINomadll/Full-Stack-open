import React from "react";
import { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = () => {
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

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={() => blogService.create(formData)}>
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
