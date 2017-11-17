/**
 * Created by admin on 2017/11/2.
 */
import "reflect-metadata";
import * as koa from "koa";
import { router } from "./router";
import { startCrawl } from "./task";
import { Logger } from './util/logger';
import { createConnection } from 'typeorm';
import cors =  require("koa-cors");


console.log('start app!');

createConnection().then(async connection => { 
    console.log('connected app!');
    startCrawl(connection);
    const app = new koa(); 
    app.use(cors());
    app.use(router.routes());
    app.listen(3003);
}).catch(error => console.log(error)); 


