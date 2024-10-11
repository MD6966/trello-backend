const app = require('./app')
require('dotenv').config();
const connectDB = require('./config/database')


process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack} `)
    console.log("Shutting down server due to uncauhgt exception ")
    process.exit(1)
})
connectDB()

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started at PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.stack}`)
    console.log('Shutting down the server due to unhandled rejection')
    server.close(()=> {process.exit(1)})
} )