const Blog = require("../models/blog");

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

const blogWithoutLikes = {
  title: "Gambling ads are out of control",
  author: "James Duthie",
  url: "https://www.tsn.ca/nhl",
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogWithoutLikes,
  blogsInDb,
};
