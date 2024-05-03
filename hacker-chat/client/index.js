
import Events from 'node:events'
import TerminalController from "./src/terminalController.js";


const componentEmitter = new Events()

const controller = new TerminalController()

await controller.initializeTable(componentEmitter)