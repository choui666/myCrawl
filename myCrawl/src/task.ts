import { Connection } from 'typeorm';
import { Citys } from "./house_lj/citys";
import { scheduleJob } from "node-schedule";
import { oldHouses } from './house_lj/oldHouses';
import { Logger } from './util/logger';
import *as moment from "moment";


export const startCrawl = (connection: Connection) => {
    scheduleJob({ dayOfWeek: [0, 4] }, async () => {
        Logger.log(moment.now(), 'start crwal data.... ');
        let citys = await new Citys().getCitysFromDataBase();
        console.log(citys);
        new oldHouses(connection, citys).start();
    });
}


