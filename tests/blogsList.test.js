const listHelper = require('../utils/list_helper')
const blogsSample = require('./dataSamples')

describe('Part4 Tests', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

  test('Total likes of all blogs should be 36', () => {
    const result = listHelper.totalLikes(blogsSample)

    expect(result).toBe(36)
  })
})
