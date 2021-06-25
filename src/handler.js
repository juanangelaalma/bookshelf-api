const { nanoid } = require('nanoid')
const books = require('./books')

const isEmpty = (property) => {
  if (property == null) return 1
  else return 0
}

const readPageGreather = (readPage, pageCount) => {
  if (readPage > pageCount) return 1
  else return 0
}

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  // validation
  if (isEmpty(name)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPageGreather(readPage, pageCount)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(12)
  const finished = readPage === pageCount
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }
  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const showAllBooks = (request, h) => {
  const { name, reading, finished } = request.query
  let data = books
  if (name) {
    const key = new RegExp(name, 'i')
    data = books.filter(book => book.name.search(key) !== -1)
  }

  if (reading) {
    // eslint-disable-next-line eqeqeq
    data = books.filter(book => book.reading == reading)
  }

  if (finished) {
    // eslint-disable-next-line eqeqeq
    data = books.filter(book => book.finished == finished)
  }

  const responseData = data.map(item => {
    return {
      id: item.id,
      name: item.name,
      publisher: item.publisher
    }
  })

  const response = h.response({
    status: 'success',
    data: {
      books: responseData
    }
  })
  response.code(200)
  return response
}

const showBookById = (request, h) => {
  const { bookId } = request.params

  const responseData = books.filter(book => book.id === bookId)

  // eslint-disable-next-line eqeqeq
  if (responseData == '') {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }

  const response = h.response({
    status: 'success',
    data: {
      book: responseData[0]
    }
  })
  response.code(200)
  return response
}

const updateBookById = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  // validation
  if (isEmpty(name)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPageGreather(readPage, pageCount)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const { bookId } = request.params
  const index = books.findIndex(book => book.id === bookId)
  const finished = readPage === pageCount
  const updateAt = new Date().toISOString()

  if (index !== -1) {
    books[index] = {
      ...books[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updateAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookById = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex(book => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBook, showAllBooks, showBookById, updateBookById, deleteBookById }
