const listHelper = require('../utils/list_helper')
const blogsSample = require('./dataSamples')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('Calculating the total likes', () => {
  test('Total amount of likes of all blogs should be 36', () => {
    const result = listHelper.totalLikes(blogsSample)

    expect(result).toBe(36)
  })
})

describe('Testing favoriteBlog function', () => {
  test('Should show the blog with the max number of likes', () => {
    const result = listHelper.favoriteBlog(blogsSample)

    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})
