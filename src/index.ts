/**
 * Created by admin on 2017/11/2.
 */
import "reflect-metadata";
import * as koa from "koa";
import { router } from "./router";
import { startCrawlOldHouse, startCrawlNews,startCrawlCitys, startCrawlNewsByPup } from './task';
import { Logger } from './util/logger';
import { createConnection } from 'typeorm';
import cors =  require("koa-cors");
import  * as http from "http";
import  * as https from "https"; 
import * as fs from "fs";

console.log('start app!');

createConnection().then(async connection => { 
    console.log('connected app!');

    

    //task任务开启
    //startCrawlCitys(connection);
    startCrawlOldHouse(connection); 
    startCrawlNewsByPup(connection);

    const app = new koa(); 
    //全局错误处理
    app.use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          // will only respond with JSON
          ctx.status = err.statusCode || err.status || 500;
          ctx.body = {
            message: err.message
          };
        }
      })
    app.use(cors());
    app.use(router.routes());
    app.listen(3003);
     
}).catch(error => console.log(error)); 


