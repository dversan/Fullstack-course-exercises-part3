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

const blogsGroupedByAuthor = (blogs) => {
  const authorsWithSomeBlog = [
    ...new Map(blogs.map((b) => [b.author, b])).values()
  ]

  const groupBlogsByAuthor = (blog) =>
    blogs.filter((b) => b.author === blog.author)

  return authorsWithSomeBlog.map((blog) => groupBlogsByAuthor(blog))
}

const mostBlogs = (blogs) => {
  return blogsGroupedByAuthor(blogs)
    .map((blog) => ({
      author: blog[0].author,
      blogs: blog.length
    }))
    .reduce((max, current) => (max.blogs > current.blogs ? max : current))
}

const mostLikes = (blogs) => {
  return blogsGroupedByAuthor(blogs)
    .map((blog) => {
      const totalLikesPerAuthor = blog.reduce(
        (sum, blog) => sum + blog.likes,
        0
      )
      return {
        author: blog[0].author,
        likes: totalLikesPerAuthor
      }
    })
    .reduce((max, current) => (max.likes > current.likes ? max : current))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
