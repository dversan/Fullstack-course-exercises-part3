const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await mongoose.connection.close()
})

test('There are 3 notes', async () => {
  const response = await api.get('/api/blogs')

  expect(response._body).toHaveLength(3)
})
afterAll(async () => {
  await mongoose.connection.close()
})

test('The first note is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  expect(response._body[0]).toEqual({
    id: '653a8aa11edd4bea0372454a',
    title: 'A blog',
    author: 'David',
    url: 'https://web.com',
    likes: 5
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})
