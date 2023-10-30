const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { initialBlogs, newBlog } = require('../tests/dataSamples')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('when there are some intial blogs saved', () => {
  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response._body).toHaveLength(initialBlogs.length)
  })

  test('The first blog matches the expected schema with the content sent in the request body', async () => {
    const response = await api.get('/api/blogs')

    expect(response._body[0]).toEqual({
      author: 'Michael Chan',
      id: response._body[0].id,
      likes: 7,
      title: 'React patterns',
      url: 'https://reactpatterns.com/'
    })
  })
})

describe('Viewing a specific note', () => {
  test('Property "id" is properly named', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('Testing a new blog creation', () => {
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
    ).toContainEqual(newBlog)
  })

  test('If likes prop is being stored with value 0 when the property is missing in the body request', async () => {
    delete newBlog.likes
    const response = await api.post('/api/blogs').send(newBlog)

    expect(response._body.likes).toBe(0)
  })

  test('An error "404 Bad Request" is send when the form is submitted and title or url are empty', async () => {
    const blogsInDb = await Blog.find({})

    await api
      .post('/api/blogs')
      .send({ ...newBlog, title: undefined })
      .send({ ...newBlog, url: undefined })
      .expect(400)

    expect(blogsInDb).toHaveLength(initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const initialBlogsInDb = await Blog.find({})
    const blogToDelete = initialBlogsInDb[0]._id

    await api.delete(`/api/blogs/${blogToDelete}`).expect(204)

    const blogsInDbAtEnd = await Blog.find({})

    expect(blogsInDbAtEnd).toHaveLength(initialBlogsInDb.length - 1)

    const blogsIds = blogsInDbAtEnd.map((r) => r._id)

    expect(blogsIds).not.toContain(blogToDelete._id)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
