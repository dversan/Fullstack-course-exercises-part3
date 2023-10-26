const sampleBlogs = require('../tests/dataSamples')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs
    .map((blog) => blog.likes)
    .reduce((acc, currentValue) => acc + currentValue, 0)
}

const favoriteBlog = (blogs) => {
  const likesList = blogs.map((blog) => blog.likes)
  const maxNumberOfLikes = Math.max(...likesList)

  const mostPopularBlogs = blogs.filter(
    (blog) => blog.likes === maxNumberOfLikes
  )

  return mostPopularBlogs.map((blog) => ({
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }))[0]
}

const mostBlogs = (blogs) => {
  const authorsWithSomeBlog = [
    ...new Map(blogs.map((b) => [b.author, b])).values()
  ]

  const groupBlogsByAuthor = (blog) =>
    blogs.filter((b) => b.author === blog.author)

  const blogsGroupedByAuthor = authorsWithSomeBlog.map((blog) =>
    groupBlogsByAuthor(blog)
  )

  return blogsGroupedByAuthor
    .map((blog) => ({
      author: blog[0].author,
      blogs: blog.length
    }))
    .reduce((max, current) => (max.blogs > current.blogs ? max : current))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
