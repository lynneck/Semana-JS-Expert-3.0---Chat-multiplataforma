/*
    node index.js\
    --username paulolynneck \
    --room sala01 \
    --hostUri localhost
*/
import Events from 'node:events'
import TerminalController from "./src/terminalController.js";
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socket.js';
import EventManager from './src/eventManager.js';

 const [nodePath, filePath, ...commands ] = process.argv
 const config = CliConfig.parseArguments(commands)
 //console.log('config', config);

//console.log(process.argv);
const componentEmitter = new Events()
const socketClient = new SocketClient(config)
await socketClient.initialize()
const eventManager = new EventManager({ componentEmitter, socketClient})
const events = eventManager.getEvents()
socketClient.attachEvents(events)

const data = {
    roomId: config.room,
    userName: config.username    
}
eventManager.joinRoomAndWaitForMessages(data)

const controller = new TerminalController()

await controller.initializeTable(componentEmitter)