const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { initialBlogs, newBlog, newUser } = require('../tests/dataSamples')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('When there are some intial blogs saved', () => {
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

describe('Viewing a specific blog', () => {
  test('Property "id" is properly named', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('Testing a new blog creation', () => {
  test('A blog has been created by an authorized user', async () => {
    const authUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${authUser._body.token}`)
      .expect(200)
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

  test('If a token is not provided blog creation fails with proper status code 401 Unauthorized', async () => {
    const usersInDb = await User.find({})

    const blogWithUserProp = {
      title: 'Bolg for delete testing',
      author: 'root',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: usersInDb[0]._id.toString()
    }

    await api
      .post('/api/blogs')
      .send(blogWithUserProp)
      .expect(401)
      .expect({ error: 'Unauthorized' })
  })

  test('If likes prop is being stored with value 0 when the property is missing in the body request', async () => {
    delete newBlog.likes
    const authUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${authUser._body.token}`)
      .expect(200)

    expect(response._body.likes).toBe(0)
  })

  //   test('An error "404 Bad Request" is send when the form is submitted and title or url are empty', async () => {
  //     const blogsInDb = await Blog.find({})
  //     const authUser = await api
  //       .post('/api/login')
  //       .send({ username: 'root', password: 'sekret' })
  //
  //     await api
  //       .post('/api/blogs')
  //       .send({ ...newBlog, title: undefined })
  //       .send({ ...newBlog, url: undefined })
  //       .set('Authorization', `Bearer ${authUser._body.token}`)
  //       .expect(400)
  //
  //     expect(blogsInDb).toHaveLength(initialBlogs.length)
  //   })
})

describe('Updating a blog', () => {
  test('Succeeds with status code 204 if id is valid', async () => {
    const initialBlogsInDb = await Blog.find({})
    const blogToUpdate = initialBlogsInDb[0]._id
    const updatedBlogTitle = 'Blog updated'

    const blogWithUpdatedValues = { ...blogToUpdate, title: updatedBlogTitle }

    await api
      .put(`/api/blogs/${blogToUpdate}`)
      .send(blogWithUpdatedValues)
      .expect(201)

    const blogsInDbAtEnd = await Blog.find({})

    expect(blogsInDbAtEnd[0].title).toBe(updatedBlogTitle)
  })
})

describe('Deletion of a blog', () => {
  test('Succeeds with status code 204 if id is valid', async () => {
    const usersInDb = await User.find({})

    const blogWithUserProp = {
      title: 'Bolg for delete testing',
      author: 'root',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: usersInDb[0]._id.toString()
    }

    const authUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .post('/api/blogs')
      .send(blogWithUserProp)
      .set('Authorization', `Bearer ${authUser._body.token}`)
      .expect(200)

    const initialBlogsInDb = await Blog.find({})
    const blogToDelete = initialBlogsInDb.pop()

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', `Bearer ${authUser._body.token}`)
      .expect(204)

    const blogsInDbAtEnd = await Blog.find({})

    expect(blogsInDbAtEnd).toHaveLength(initialBlogsInDb.length)

    const blogsIds = blogsInDbAtEnd.map((r) => r._id)

    expect(blogsIds).not.toContain(blogToDelete._id)
  })
})

describe('Testing a new user creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'DVS', passwordHash })

    await user.save()
  })

  test('Creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('User creation fails with a username or password shorter than 3 characters and the response return a suitable error message', async () => {
    const userWithInvalidUsername = { ...newUser, username: 'da' }
    const userWithInvalidPassword = { ...newUser, password: '12' }

    const response = (invalidUser) =>
      api.post('/api/users').send(invalidUser).expect(400)

    const invalidUsernameResponse = await response(userWithInvalidUsername)

    expect(invalidUsernameResponse.text).toContain(
      'User validation failed: username: Path `username` (`da`) is shorter than the minimum allowed length (3).'
    )

    const invalidPasswordResponse = await response(userWithInvalidPassword)

    expect(invalidPasswordResponse.text).toContain(
      '{"error":"Password is shorter than the minimum allowed length (3)"}'
    )
  })

  // test('created user should be unique and an error should be shown if exists', async () => {
  //   const usersAtStart = await User.find({})
  //
  //   const newUser = {
  //     username: 'root',
  //     name: 'Superuser',
  //     password: 'salainen'
  //   }
  //
  //   const result = await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/)
  //
  //   expect(result.body.error).toContain('expected `username` to be unique')
  //
  //   const usersAtEnd = await User.find({})
  //   expect(usersAtEnd).toEqual(usersAtStart)
  // })
})

afterAll(async () => {
  await mongoose.connection.close()
})
