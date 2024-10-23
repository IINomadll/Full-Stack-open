const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "some blog",
    author: "Jarskibastian Lehtipihvinen",
    url: "someblog.blog",
    likes: 999,
  },
  {
    title: "Speedhunters",
    author: "D.K.",
    url: "https://www.speedhunters.com/",
    likes: 420,
  },
  {
    title: "test blog",
    author: "tester",
    url: "test.test",
    likes: 5,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are three blogs", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blogs have correctly named 'id' fields", async () => {
  const response = await api.get("/api/blogs");
  const firstBlog = response.body[0];

  assert("id" in firstBlog);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "test title",
    author: "test author",
    url: "someblog.blog.test",
    likes: 73,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  const addedBlog = response.body[response.body.length - 1];

  const expectedKeys = ["id", "title", "author", "url", "likes"];
  assert.deepStrictEqual(Object.keys(addedBlog).sort(), expectedKeys.sort());
});

test("omitted likes field converts to zero likes", async () => {
  const newBlog = {
    title: "test title",
    author: "test author",
    url: "someblog.blog.test",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const addedBlog = response.body[response.body.length - 1];

  assert.strictEqual(addedBlog.likes, 0);
});

test("blog without title is not added (400 Bad Request)", async () => {
  const newBlogWithoutTitle = {
    author: "test author",
    url: "someblog.blog.test",
    likes: 3,
  };

  // prettier-ignore
  await api
    .post("/api/blogs")
    .send(newBlogWithoutTitle)
    .expect(400);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blog without url is not added (400 Bad Request)", async () => {
  const newBlogWithoutUrl = {
    title: "test title",
    author: "test author",
    likes: 7,
  };

  // prettier-ignore
  await api
    .post("/api/blogs")
    .send(newBlogWithoutUrl)
    .expect(400);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blog deletion succeeds (204 No Content)", async () => {
  let response = await api.get("/api/blogs");
  const blogToDelete = response.body[response.body.length - 1];

  //prettier-ignore
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length - 1);
});

test("an existing blog can be updated", async () => {
  const newBlog = {
    title: "Original Title",
    author: "Original Author",
    url: "original.url.test",
    likes: 5,
  };

  const blogToUpdate = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const updatedData = {
    title: "Updated Title",
    author: "Updated Author",
    url: "updated.url.test",
    likes: 10,
  };

  const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.body.id}`)
    .send(updatedData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(updatedBlog.body.title, updatedData.title);
  assert.strictEqual(updatedBlog.body.author, updatedData.author);
  assert.strictEqual(updatedBlog.body.url, updatedData.url);
  assert.strictEqual(updatedBlog.body.likes, updatedData.likes);

  const response = await api.get(`/api/blogs/${blogToUpdate.body.id}`);
  assert.strictEqual(response.body.title, updatedData.title);
  assert.strictEqual(response.body.author, updatedData.author);
  assert.strictEqual(response.body.url, updatedData.url);
  assert.strictEqual(response.body.likes, updatedData.likes);
});

test("an existing blog can be partially updated", async () => {
  const newBlog = {
    title: "Original Title",
    author: "Original Author",
    url: "original.url.test",
    likes: 5,
  };

  const blogToUpdate = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogId = blogToUpdate.body.id;

  const originalBlog = await api.get(`/api/blogs/${blogId}`);

  const updatedData = {
    likes: 10,
  };

  const updatedBlog = await api
    .put(`/api/blogs/${blogId}`)
    .send(updatedData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(updatedBlog.body.likes, updatedData.likes);

  assert.strictEqual(updatedBlog.body.title, originalBlog.body.title);
  assert.strictEqual(updatedBlog.body.author, originalBlog.body.author);
  assert.strictEqual(updatedBlog.body.url, originalBlog.body.url);

  const response = await api.get(`/api/blogs/${blogId}`);
  assert.strictEqual(response.body.likes, updatedData.likes);
  assert.strictEqual(response.body.title, originalBlog.body.title);
  assert.strictEqual(response.body.author, originalBlog.body.author);
  assert.strictEqual(response.body.url, originalBlog.body.url);
});

after(async () => {
  await mongoose.connection.close();
});
