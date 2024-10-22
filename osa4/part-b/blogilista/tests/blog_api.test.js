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

after(async () => {
  await mongoose.connection.close();
});
