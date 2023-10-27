const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

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

test('Verify that the property "id" is properly named', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})
