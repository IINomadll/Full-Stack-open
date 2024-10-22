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
  },
  {
    title: "Speedhunters",
    author: "D.K.",
    url: "https://www.speedhunters.com/",
  },
  {
    title: "test blog",
    author: "tester",
    url: "test.test",
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
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  const addedBlog = response.body[response.body.length - 1];

  const expectedKeys = ["id", "title", "author", "url"];
  assert.deepStrictEqual(Object.keys(addedBlog).sort(), expectedKeys.sort());
});

after(async () => {
  await mongoose.connection.close();
});
