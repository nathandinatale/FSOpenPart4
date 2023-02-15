const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./api_test_helper");

const api = supertest(app);

// usage of global variable here not ideal, could change scope to each block
// but all tests and test blocks use the same token and it will not be modified
let token;

// Users will not be added or removed in this testing so sufficient to just do it once before all.
beforeAll(async () => {
  await User.deleteMany({});

  const promiseArray = helper.initialUsers.map((user) =>
    api.post("/api/users").send(user)
  );
  await Promise.all(promiseArray);

  const firstUser = helper.initialUsers[0];
  const response = await api
    .post("/api/login")
    .send({ username: firstUser.username, password: firstUser.password });

  token = response.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const firstUser = await User.findOne({
    username: helper.initialUsers[0].username,
  });

  // ensuring that the user stored in the initialUsers array is the creator of all initial blogs
  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: firstUser.id })
  );
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);
});

describe("retrieving blogs", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("correct number of blogs are returned", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("id property is correctly formatted", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);
    for (let blog of response.body) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe("uploading blogs", () => {
  test("a new blog is correctly saved into the database", async () => {
    const { body } = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
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
    const { body } = await api
      .post("/api/blogs")
      .send(blog)
      .set("Authorization", `Bearer ${token}`);
    expect(body.likes).toBe(0);
  });

  test("can't save a blog into db without a URL", async () => {
    const blog = { ...helper.blogToAdd };
    delete blog.url;
    await api
      .post("/api/blogs")
      .send(blog)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deleting a blog from the database", () => {
  test("successfully deleting a blog ", async () => {
    const blogs = await helper.blogsInDb();
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  });
  test("attempting to delete a blog that doesnt exist in the database 400", async () => {
    const newBlog = new Blog(helper.blogToAdd);
    const newId = newBlog.id.toString();
    await api
      .delete(`/api/blogs/${newId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });
  test("attempting to delete a blog using an invalid ID ", async () => {
    const fakeId = "1239asd501ddsf";
    await api
      .delete(`/api/blogs/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });
});

describe("updating a single blog post", () => {
  test("successfuly updating blog post by increasing the likes", async () => {
    const currentBlogs = await helper.blogsInDb();
    const originalBlog = currentBlogs[0];
    const updatedBlog = await api
      .put(`/api/blogs/${originalBlog.id}`)
      .send({
        ...originalBlog,
        likes: originalBlog.likes + 10,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(updatedBlog.body.likes).toBe(originalBlog.likes + 10);
  });
  test("attempting to update a blog that doesn't exist in the database", async () => {
    const newBlog = new Blog(helper.blogToAdd);
    const newId = newBlog.id.toString();
    await api
      .put(`/api/blogs/${newId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });
  test("attempting to update a blog post using an invalid ID", async () => {
    const fakeId = "1239asd501ddsf";
    await api
      .put(`/api/blogs/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });
});

describe("attempt to access blogs API without an access token", () => {
  test("trying to get all blogs without an access token", async () => {
    await api.get("/api/blogs").expect(401);
  });
  test("trying to post a new blog without an access token", async () => {
    await api.post("/api/blogs").send(helper.blogToAdd).expect(401);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length === helper.initialBlogs.length);
  });
  test("trying to delete a blog without an access token", async () => {
    const blogs = await helper.blogsInDb();
    await api.delete(`/api/blogs/${blogs[0].id}`).expect(401);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length === helper.initialBlogs.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
