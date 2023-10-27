const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const initialBlogs = require('../tests/dataSamples').initialBlogs

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('Cleared')

  initialBlogs.forEach(async (note) => {
    const noteObject = new Blog(note)
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

test('There are 3 notes', async () => {
  const response = await api.get('/api/blogs')

  expect(response._body).toHaveLength(3)
})

test('The first blog matches the expected schema with the content sent in the request body', async () => {
  const response = await api.get('/api/blogs')

  expect(response._body[0]).toEqual({
    id: '653a8aa11edd4bea0372454a',
    title: 'A blog',
    author: 'David',
    url: 'https://web.com',
    likes: 5
  })
})

test('Property "id" is properly named', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('A blog has been created', async () => {
  const newBlog = {
    title: 'Testing blog',
    author: 'DVS',
    url: 'https://web.com',
    likes: 5
  }

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
