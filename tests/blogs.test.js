const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];
const manyBlogs = listWithOneBlog.concat(
  {
    _id: "63e2156560a9e2db61f14d4e",
    title: "Why the Leafs will win the cup",
    author: "Kyle Dubas",
    url: "https://www.nhl.com/mapleleafs",
    likes: 20,
    __v: 0,
  },
  {
    _id: "63e21f8e1c7740761bb059c6",
    title: "Why the Leafs will lose the stanley cup",
    author: "Mike Babcock",
    url: "https://www.nhl.com/mapleleafs",
    likes: 32,
    __v: 0,
  }
);

const authorBlogs = manyBlogs.concat(
  {
    _id: "63e2156560a9e2db61f14a4e",
    title: "Why I make the best trades",
    author: "Kyle Dubas",
    url: "https://www.nhl.com/mapleleafs",
    likes: 15,
    __v: 0,
  },
  {
    _id: "63e2156560a9e2db61e14a4e",
    title: "Nylander was a great signing",
    author: "Kyle Dubas",
    url: "https://www.nhl.com/mapleleafs",
    likes: 4,
    __v: 0,
  },
  {
    _id: "63e2156560a9s2db61e14a4e",
    title: "Never got that list",
    author: "Mike Babcock",
    url: "https://www.nhl.com/mapleleafs",
    likes: 23,
    __v: 0,
  }
);

describe("total likes", () => {
  test("of empty list is zero", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });
  test("when list has only one blog, equals the likes of that blog", () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5);
  });
  test("of a bigger list is calculated right", () => {
    expect(listHelper.totalLikes(manyBlogs)).toBe(57);
  });
});

describe("favourite blog", () => {
  test("favourite of no blugs is null", () => {
    expect(listHelper.favouriteBlog([])).toBe(null);
  });
  test("of a single blog is itself", () => {
    expect(listHelper.favouriteBlog(listWithOneBlog)).toEqual({
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });
  test("that correct blog is chosen from a larger list", () => {
    expect(listHelper.favouriteBlog(manyBlogs)).toEqual({
      title: "Why the Leafs will lose the stanley cup",
      author: "Mike Babcock",
      likes: 32,
    });
  });
});

describe("most blogs", () => {
  test("most blogs of no blogs is null", () => {
    expect(listHelper.mostBlogs([])).toBe(null);
  });
  test("that a single blog would be 1", () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });
  test("that an author will be chosen from a larger list with correct number of blogs", () => {
    expect(listHelper.mostBlogs(authorBlogs)).toEqual({
      author: "Kyle Dubas",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("most likes of no blogs is null", () => {
    expect(listHelper.mostLikes([])).toBe(null);
  });
  test("that a single blog would be the likes of that blog", () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });
  test("that an author will be chosen from a larger list with the correct accumulative likes", () => {
    expect(listHelper.mostLikes(authorBlogs)).toEqual({
      author: "Mike Babcock",
      likes: 55,
    });
  });
});
