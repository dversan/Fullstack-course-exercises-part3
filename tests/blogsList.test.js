const listHelper = require('../utils/blogs_helper')
const blogsSample = require('./dataSamples').blogs

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('Testing totalLikes function', () => {
  test('Total amount of likes of all blogs should be 36', () => {
    const result = listHelper.totalLikes(blogsSample)

    expect(result).toBe(36)
  })
})

describe('Testing favoriteBlog function', () => {
  test('Should return the blog with the max number of likes', () => {
    const result = listHelper.favoriteBlog(blogsSample)

    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('Testing mostBlogs function', () => {
  test('Should return a object with the name of the author with more blogs and the amount of blogs', () => {
    const result = listHelper.mostBlogs(blogsSample)

    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('Testing mostLikes function', () => {
  test('Should return a object with the name of the author with more likes and the amount of likes', () => {
    const result = listHelper.mostLikes(blogsSample)

    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})
