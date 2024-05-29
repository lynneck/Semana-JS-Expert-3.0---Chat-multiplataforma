import { constants } from "./constants.js"

export default class Controller {
    #users = new Map()
    #rooms = new Map()

    constructor( {socketServer} ){
        this.socketServer = socketServer

    }

    onNewConnection(socket){
        const {id} = socket
        console.log('connection stablished wich', id)
        const userData = { id, socket }
        this.#updateGlobalUserData(id, userData)

        socket.on('data',  this.#onSocketData(id))
        socket.on('error', this.#onSocketClosed(id))
        socket.on('end', this.#onSocketClosed(id))
    }

    async joinRoom(socketId, data){
        const userData = data
        console.log(`${userData.userName} joined ${ [socketId] }`);
        const user = this.#updateGlobalUserData(socketId, userData)
        const { roomId } = userData

        const users = this.#joinUserOnRoom( roomId, user)

        const curretUsers = Array.from(users.values())
            .map(({ id, userName }) => ({ userName, id }))

            //Atualiza o usuario que conectou sobre             // atualiza o usuario corrente sobre todos os usuarios 
            //quais usuarios ja estao conectados na mesma sala! // que ja estao conectados na mesma sala 
        this.socketServer.sendMessage(user.socket, constants.event.UPDATE_USERS, curretUsers)

        // avisa a rede que um novo usuario se conectou

        this.broadCast({
            socketId,
            roomId,
            message:{ id: socketId, userName: userData.userName},
            event: constants.event.NEW_USER_CONNECTED,
        })

    }

    broadCast({ socketId, roomId, event, message, includeCurrentSocket = false}){
        const userOnRoom = this.#rooms.get(roomId)

        for ( const [key, user] of userOnRoom) {
            if(!includeCurrentSocket && key === socketId) continue;
            this.socketServer.sendMessage(user.socket, event, message)
        }
    }

    #joinUserOnRoom(roomId, user){
        const usersonRoom = this.#rooms.get(roomId) ?? new Map()
        usersonRoom.set(user.id, user)
        this.#rooms.set(roomId, usersonRoom)

        return usersonRoom
    }
 
    #onSocketClosed(id){
        return data => {
            console.log('onSocketClosed', id);
        }
    }

    #onSocketData(id){
        return data => {
            try {
                const { event, message} = JSON.parse(data)
                this[event](id, message)
            } catch (error) {
                console.error(`wrong event format!!`, data.toString());
                
            }
        }
    }

    #updateGlobalUserData(socketId, userData){
        const users = this.#users
        const user = users.get(socketId) ?? {}

        const updateUserData = {
            ...user,
            ...userData
        }

        users.set(socketId, updateUserData)

        return users.get(socketId)
    }
}