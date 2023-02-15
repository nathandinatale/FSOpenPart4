const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const errors = require("../utils/errors");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  if (!body.title || !body.author || !body.url)
    return response.status(400).send({ error: "Incomplete request" });

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(blog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  // findByIdAndRemove doesn't throw an error if ID is valid format and element not found
  try {
    const blog = await Blog.findById(request.params.id);

    if (!blog) throw new errors.MissingIdError("That blog does not exist!");

    const user = request.user;

    if (user._id.toString() !== blog.user._id.toString())
      return response
        .status(401)
        .send({ error: "This user is not authorized to delete this blog!" });

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  // need to put the "new: true" object in the mongoose function to get the new document
  try {
    const { title, author, body, url, likes } = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      {
        title,
        author,
        body,
        url,
        likes,
      },
      { new: true }
    );
    if (!updatedBlog)
      throw new errors.MissingIdError("That blog does not exist!");
    response.json(updatedBlog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
