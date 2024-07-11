import 'module-alias/register'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import dotenv from 'dotenv'
import moduleAlias from "module-alias"
dotenv.config({ path: '.env' })
const isProd: any = process.env.IS_PRODUCTION === 'production' && true
if (isProd) {
    moduleAlias.addAliases({
        "@": path.join(__dirname, '/../dist')
    })
} else {
    moduleAlias.addAliases({
        "@": path.join(__dirname, '/../src')
    })
}
import cors from 'cors'
import expressHandlebars from 'express-handlebars'
import http from 'http'
import { Request, Response } from 'express'
import fs from 'fs'
import passport from './plugins/passport'
import Mongo from './plugins/mongoose'
import { authClearTmp } from '@/service/auth-clear-tmp'
authClearTmp.start()
// expected output: "The word "fox" is in the sentence"


class App {
    static readonly PORT: number | string = process.env.PORT || 3000
    #app!: express.Application
    #httpServer!: http.Server
    #cors!: any
    #Mongo!: Mongo
    #jsonParser!: any
    #urlencodedParser!: any
    #dotenv!: any
    #port!: string | number
    #expressHandlebars: any


    //  #corsOptions!: any

    constructor() {
        this.initialize()
        this.createApp()
        this.middleware()
        this.createPage()
        this.createRouter()
        this.createServer()
        this.listen()
    }

    private initialize(): void {
        this.#app = express()
        this.#cors = cors
        this.#Mongo = new Mongo()
        this.#jsonParser = bodyParser.json({ limit: '50mb' })
        this.#urlencodedParser = bodyParser.urlencoded({ limit: '50mb', extended: false })

        this.#dotenv = dotenv
        this.#port = App.PORT
        this.#expressHandlebars = expressHandlebars
    }

    private createApp(): void {
        this.#dotenv.config({ path: '.env' })
        this.#Mongo.connect()
    }

    private middleware(): void {
        this.#app.use(this.#cors())
        this.#app.use(this.#jsonParser)
        this.#app.use(this.#urlencodedParser)
        //  this.#app.use(express.static('tmp'))
        //ເປີດ public ຮູບ​ ຫຼື ໜ້າບ້ານຖ້າ build ມາເປັນ project ດຽວ
        this.#app.use(express.static('public'))
        this.#app.use(express.static('public/main')) 
        this.#app.engine('handlebars', this.#expressHandlebars())
        this.#app.set('view engine', 'handlebars')
        this.#app.use(passport.initialize())
    }
    private createPage(): void {
        this.#app.get('/admin-login', (req: Request, res: Response) => {
            res.render('admin-login', { layout: false })
        })
    }

    private createRouter(): void {
        const routePath = __dirname + '/client/apis/rest/routes/'
        fs.readdirSync(routePath).map((file: string) => {
            const route = './client/apis/rest/routes/' + file
            this.#app.use('/client-api', require(route).default)
        })
        const routePaths = __dirname + '/admin/apis/rest/routes/'
        fs.readdirSync(routePaths).map((file: string) => {
            const route = './admin/apis/rest/routes/' + file
            this.#app.use('/admin-api', require(route).default)
        })
        //qhov no yog hais tias thaum yus tsis muaj view ce yus ua li no
        this.#app.get('*', (req: Request, res: Response) => {
            res.status(404).json('404, Sorry, We do not allow you')
        })
        this.#httpServer = http.createServer(this.#app)
        // this.#app.get('*', (req: Request, res: Response) => {
        //     res.status(404).json(404)
        // })
    }

    private createServer(): void {
        this.#httpServer = http.createServer(this.#app)
    }

    private listen(): void {
        this.#httpServer.listen(this.#port, () => {
            console.log('Server is runing at port: ' + this.#port)
        })
    }
}
// tslint:disable-next-line:no-unused-expression
new App()
