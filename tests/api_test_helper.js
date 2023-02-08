const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Why the Leafs will win the cup",
    author: "Kyle Dubas",
    url: "https://www.nhl.com/mapleleafs",
    likes: 20,
    __v: 0,
  },
  {
    title: "Why the Leafs will lose the stanley cup",
    author: "Mike Babcock",
    url: "https://www.nhl.com/mapleleafs",
    likes: 32,
    __v: 0,
  },
  {
    title: "Why I make the best trades",
    author: "Kyle Dubas",
    url: "https://www.nhl.com/mapleleafs",
    likes: 15,
    __v: 0,
  },
  {
    title: "Nylander was a great signing",
    author: "Kyle Dubas",
    url: "https://www.nhl.com/mapleleafs",
    likes: 4,
    __v: 0,
  },
  {
    title: "Never got that list",
    author: "Mike Babcock",
    url: "https://www.nhl.com/mapleleafs",
    likes: 23,
    __v: 0,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
