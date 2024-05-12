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

 const [nodePath, filePath, ...commands ] = process.argv
 const config = CliConfig.parseArguments(commands)
 //console.log('config', config);

//console.log(process.argv);
const componentEmitter = new Events()
const socketClient = new SocketClient(config)
await socketClient.initialize()

//const controller = new TerminalController()

//await controller.initializeTable(componentEmitter)