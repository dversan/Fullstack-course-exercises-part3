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
  }))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
