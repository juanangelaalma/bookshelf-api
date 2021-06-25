const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const server = Hapi.server({
  port: 5000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['*']
    }
  }
})

server.route(routes)

server.start().then(() => {
  console.log('server running at', server.info.uri)
})
