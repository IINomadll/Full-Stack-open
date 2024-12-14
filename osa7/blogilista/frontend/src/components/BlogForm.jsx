import React from "react";
import { useState } from "react";

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
    createBlog({
      ...formData,
      likes: Number(formData.likes), // ensure likes is a number
    });
    setFormData({ title: "", author: "", url: "", likes: 0 });
  };

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <br />

        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleInputChange}
          required
        />
        <br />

        <label htmlFor="url">URL:</label>
        <input
          type="text"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleInputChange}
          required
        />
        <br />

        <label htmlFor="likes">Likes:</label>
        <input
          type="number"
          id="likes"
          name="likes"
          value={formData.likes}
          onChange={handleInputChange}
        />
        <br />

        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogForm;
