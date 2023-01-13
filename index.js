const app = require('./app') // varsinainen Express-sovellus
const http = require('http')
const {PORT} = require('./utils/config')
const logger = require('./utils/logger')
const { connectToDatabase } = require('./utils/db')

const server = http.createServer(app);


async function start() {
  await connectToDatabase();
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  })
}

start();
