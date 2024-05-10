import SocketServer from "./socket.js";
import Event from 'events'

const eventEmitter = new Event()

const port = process.argv.PORT || 9898 
const socketServer = new SocketServer({ port })
const server = await socketServer.initialize(eventEmitter)
console.log('socket sever is running at', server.address().port);