import { Connection } from 'typeorm';
import { Citys } from "./house_lj/citys";
import { scheduleJob } from "node-schedule";
import { oldHouses } from './house_lj/oldHouses';
import { Logger } from './util/logger';
import *as moment from "moment";
import { NewsTask } from './house_lj/news';
import { NewsTaskByPup } from './house_lj/news.pup';

//每周一 周四获取全国二手房房价
export const startCrawlOldHouse = async (connection: Connection) => {
     scheduleJob({ 
         dayOfWeek: [2, 5],
         hour:2,
         minute:59,
         second:0
         }, async () => {
        Logger.log(moment.now(), 'start crwal data.... ');
        let citys = await new Citys().getCitysFromDataBase();
        console.log(citys);
        new oldHouses(connection, citys).start();
     });
}
 

//获取全国热点城市  只执行一次
export const startCrawlCitys = async (connection: Connection) => {
    Logger.log(moment.now(), 'start crwal citys  data.... ');
    let citys = await new Citys().saveCity();
    console.log(citys);
}

//获取全国房价焦点12条最热新闻  每天执行
export const startCrawlNews =   (connection: Connection) => {
     scheduleJob({ 
         dayOfWeek: [0,1,2,3,4,5,6] ,
         hour:2,
         minute:57,
         second:0
        }, async () => {
        Logger.log(moment.now(), 'start crwal news data.... ');
        new NewsTask(connection).start(); 
     });
}

//获取全国各地房价焦点20条最热新闻  每天执行
export const startCrawlNewsByPup =  async (connection: Connection) => {
    scheduleJob({ 
        dayOfWeek: [0,1,2,3,4,5,6] ,
        hour:2,
        minute:57,
        second:0
       }, async () => {
        Logger.log(moment.now(), 'start crwal news data.... ');
        let citys = await new Citys().getCitysFromDataBase();
        new NewsTaskByPup(connection,citys).start(); 
    });
  
}


