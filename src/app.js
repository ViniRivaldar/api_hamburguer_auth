import express from 'express'

import LoginRoute from './app/routes/LoginRoute.js'
import RegisterRoute from './app/routes/RegisterRoute.js'

import './database/index.js';


class App{
    constructor(){
        this.app = express()
        this.middleware()
        this.routes()
    }

    middleware(){
        this.app.use(express.json())
    }

    routes(){
        this.app.use('/login',LoginRoute)
        this.app.use('/register',RegisterRoute)
    }
}

export default new App().app