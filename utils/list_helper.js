const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs
    .map((blog) => blog.likes)
    .reduce((acc, currentValue) => acc + currentValue, 0)
}

module.exports = {
  dummy,
  totalLikes
}
