const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", (request, response) => {
  const body = request.body;
  if (!body.title || !body.author || !body.url)
    return response.status(400).send({ error: "Incomplete request" });

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  console.log(blog);

  blog.save().then((savedBlog) => {
    response.status(201).json(savedBlog);
  });
});

module.exports = blogsRouter;
