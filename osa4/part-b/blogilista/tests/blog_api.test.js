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

after(async () => {
  await mongoose.connection.close();
});
