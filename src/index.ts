/**
 * Created by admin on 2017/11/2.
 */
import "reflect-metadata";
import * as koa from "koa";
import { router } from "./router";
import { startCrawl } from "./task";
import { Logger } from './util/logger';
import { createConnection } from 'typeorm';
import *as moment from 'moment';
import *as Router from 'koa-router';
 import cors =  require("koa-cors");




createConnection().then(async connection => {
    Logger.log('typeorm connected');
    startCrawl(connection);
    const app = new koa(); 
    app.use(cors());
    app.use(router.routes());
    app.listen(3000);
}).catch(error => console.log(error));





