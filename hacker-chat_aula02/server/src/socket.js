
import http from 'http'


export default class SocketServer {
    constructor({ port }){
        this.port = port
    }

    async initialize(eventEmitter){
        const server = http.createServer((req, res) => {
            res.writeHead(200, {'Content-Type': 'test/plain'})
            res.end('hey there!!')
        })

        return new Promise((resolve, rejects) => {
            server.on('error', rejects)
            server.listen(this.port, () => resolve(server))
        })
    }
}