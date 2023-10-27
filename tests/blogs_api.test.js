const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const initialBlogs = require('../tests/dataSamples').initialBlogs

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('Cleared')

  await initialBlogs.forEach(async (blog) => {
    const noteObject = new Blog(blog)
    await noteObject.save()
    console.log('New item saved')
  })

  console.log('Initial conditions ready')
})

afterAll(async () => {
  await mongoose.connection.close()
})

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('There are 3` blogs', () => {
  setTimeout(() => {
    const response = api.get('/api/blogs')

    expect(response._body).toHaveLength(3)
  }, 1000)
})

describe('Testing a new blog creation', () => {
  const newBlog = {
    title: 'Testing blog',
    author: 'DVS',
    url: 'https://web.com',
    likes: 5
  }
  test('The first blog matches the expected schema with the content sent in the request body', async () => {
    setTimeout(() => {
      const response = api.get('/api/blogs')

      expect(response._body[0]).toEqual({
        author: 'Michael Chan',
        id: '653ba435da6bfc788820f13f',
        likes: 7,
        title: 'React patterns',
        url: 'https://reactpatterns.com/'
      })
    }, 1000)
  })

  test('Property "id" is properly named', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

  test('A blog has been created', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(
      response._body.map((blog) => ({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
      }))
    ).toContainEqual({
      title: 'Testing blog',
      author: 'DVS',
      url: 'https://web.com',
      likes: 5
    })
  })

  test('If likes prop is being stored with value 0 when the property is missing in the body request', async () => {
    delete newBlog.likes
    const response = await api.post('/api/blogs').send(newBlog)

    expect(response._body.likes).toBe(0)
  })
})
