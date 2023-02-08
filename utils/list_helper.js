const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((likesSum, blog) => (likesSum += blog.likes), 0);
};

const favouriteBlog = (blogs) => {
  if (!blogs.length >= 1) return null;
  const mostBlogLikes = Math.max(...blogs.map((blog) => blog.likes));
  const favBlog = blogs.find((blog) => blog.likes === mostBlogLikes);
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (!blogs.length >= 1) return null;
  const authorBlogCount = new Map();
  blogs.map((blog) => {
    const numBlogs = authorBlogCount.get(blog.author) || 0;
    authorBlogCount.set(blog.author, numBlogs + 1);
  });
  const mostBlogs = Math.max(...authorBlogCount.values());
  let foundAuthor;
  authorBlogCount.forEach((blogCount, author) => {
    if (blogCount === mostBlogs) {
      foundAuthor = { author: author, blogs: blogCount };
    }
  });
  return foundAuthor || null;
};

const mostLikes = (blogs) => {
  if (!blogs.length >= 1) return null;
  const authorLikesCount = new Map();
  blogs.map((blog) => {
    const numLikes = authorLikesCount.get(blog.author) || 0;
    authorLikesCount.set(blog.author, numLikes + blog.likes);
  });
  const mostLikes = Math.max(...authorLikesCount.values());
  let foundAuthor;
  authorLikesCount.forEach((likeCount, author) => {
    if (likeCount === mostLikes) {
      foundAuthor = { author: author, likes: likeCount };
    }
  });
  return foundAuthor || null;
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
