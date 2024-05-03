
import ComponentsBuider from "./components.js";
import { constants } from "./constants.js";

export default class TerminalController {

    #userCollors = new Map()
    constructor() {

    }

    #pickCollor() {
        return `#` + ((1 << 24) * Math.random() | 0).toString(16) + `-fg`
    }

    #getUserCollor(userName) {
        if (this.#userCollors.has(userName))
            return this.#userCollors.get(userName)

        const collor = this.#pickCollor()
        this.#userCollors.set(userName, collor)

        return collor;
    }

    #onInputReceived(eventEmitter) {
        return function () {
            const message = this.getValue()
            console.log(message);
            this.clearValue()
        }
    }

    #onMessageReceived({ screen, chat }) {
        return msg => {
            const { userName, message } = msg
            const collor = this.#getUserCollor(userName)
            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
            screen.render()
        }
    }

    #onLogChanged({ screen, activityLog }) {
        return msg => {
            // Lynneck left
            // Lynneck join
            const [userName] = msg.split(/\s/)
            const collor = this.#getUserCollor(userName)
            activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)

            screen.render()
        }
    }

    #onStatusChanged({ screen, status }) {
        return users => {
            //['Paulo Lynneck', 'Leudiane']
            // vamos pegar o primeiro elemento da lista

            const { content } = status.items.shift()
            status.clearItems()
            status.addItem(content)

            users.forEach(userName => {
                const collor = this.#getUserCollor(userName)
                status.addItem(`{${collor}}{bold}${userName}{/}`)

            });

            screen.render()
        }
    }

    #registerEvents(eventEmitter, components) {
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATE, this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATE, this.#onStatusChanged(components))

    }

    async initializeTable(eventEmitter) {
        const components = new ComponentsBuider()
            .setScreen({ title: 'HackerChat - Paulo Lynneck' })
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setActivityLogComponent()
            .setStatusComponent()
            .build()

        this.#registerEvents(eventEmitter, components)
        components.input.focus()
        components.screen.render()


        setInterval(() => {
            eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: 'hey', userName: 'Paulo Lynneck' })
            eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: 'ho', userName: 'Leudiane' })
            eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: 'siow', userName: 'Moraes' })
        }, 1000)

        setInterval(() => {
            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATE, 'Paulo Lynneck left')
            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATE, 'Leudiane join')
            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATE, 'Moraes left')
            eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATE, 'Paulo Lynneck join')
        }, 1000);

        const users = ['Paulo Lynneck'];
        eventEmitter.emit(constants.events.app.STATUS_UPDATE, users)
        users.push('Leudiane')
        eventEmitter.emit(constants.events.app.STATUS_UPDATE, users)
        users.push('user01', 'user0125')
        eventEmitter.emit(constants.events.app.STATUS_UPDATE, users)
        users.push('user05', 'user100')



    }


}