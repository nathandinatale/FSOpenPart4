const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./api_test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

describe("retrieving blogs", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("correct number of blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("id property is correctly formatted", async () => {
    const response = await api.get("/api/blogs");
    for (let blog of response.body) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe("uploading blogs", () => {
  test("a new blog is correctly saved into the database", async () => {
    const { body } = await api
      .post("/api/blogs")
      .send(helper.blogToAdd)
      .expect(201);

    // using toMatchObject which only checks the subset because the body would have ID as an additional property
    // could also check this as done in the course with .toContain() on one property such as title
    expect(body).toMatchObject(helper.blogToAdd);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test("likes property defaults to 0 if not defined", async () => {
    const blog = { ...helper.blogToAdd };
    delete blog.likes;
    const { body } = await api.post("/api/blogs").send(blog);
    expect(body.likes).toBe(0);
  });

  test("can't save a blog into db without a URL", async () => {
    const blog = { ...helper.blogToAdd };
    delete blog.url;
    await api.post("/api/blogs").send(blog).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
