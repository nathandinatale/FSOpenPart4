const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Why the Leafs will win the cup",
    author: "Kyle Dubas",
    url: "https://www.nhl.com/mapleleafs",
    likes: 20,
  },
  {
    title: "Why the Leafs will lose the stanley cup",
    author: "Mike Babcock",
    url: "https://www.nhl.com/mapleleafs",
    likes: 32,
  },
  {
    title: "Why I make the best trades",
    author: "Kyle Dubas",
    url: "https://www.nhl.com/mapleleafs",
    likes: 15,
  },
  {
    title: "Nylander was a great signing",
    author: "Kyle Dubas",
    url: "https://www.nhl.com/mapleleafs",
    likes: 4,
  },
  {
    title: "Never got that list",
    author: "Mike Babcock",
    url: "https://www.nhl.com/mapleleafs",
    likes: 23,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

const blogToAdd = {
  title: "How does Matt Muray keep getting injured",
  author: "Sheldon Keefe",
  url: "https://www.nhl.com/mapleleafs",
  likes: 10,
};

const initialUsers = [
  {
    username: "PhilTheThrill",
    name: "Phil Kessel",
    password: "Kessel81",
  },
  {
    username: "MagicMitch",
    name: "Mitch Marner",
    password: "Marner16",
  },
  {
    username: "SlickWilly",
    name: "William Nylander",
    password: "Nylander29",
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const logIn = async (api) => {
  const response = await api.po;
};

module.exports = {
  initialBlogs,
  blogToAdd,
  blogsInDb,
  initialUsers,
  usersInDb,
};
