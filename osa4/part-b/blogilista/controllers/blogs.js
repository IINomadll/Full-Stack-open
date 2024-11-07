const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const wantedBlog = await Blog.findById(request.params.id);
  response.json(wantedBlog);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  // verify validity of token and decode the object that was used to create
  // the token in the first place { 'username' and 'id' }
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id)
    return response.status(401).json({ error: "token invalid" });

  const user = await User.findById(decodedToken.id);
  logger.info("USER", user);

  // if user is not given, find the first document in the collection
  // if (user === null) user = await User.findOne();

  if (!body.title || !body.url) response.status(400).end();
  else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  // see if token exists in request
  const token = request.token;
  if (!token) return response.status(401).json({ error: "token missing" });

  // decode the token
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id)
    return response.status(401).json({ error: "token invalid" });

  // find the blog that is to be deleted
  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete)
    return response.status(404).json({ error: "blog not found" });

  // make sure blog's creator is the same as token's user
  if (blogToDelete.user.toString() !== decodedToken.id)
    // 403 forbidden
    return response.status(403).json({ error: "permission denied" });

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: "query" }
  );
  response.json(updatedBlog);
});

module.exports = blogsRouter;
