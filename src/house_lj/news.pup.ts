/**
 * Created by admin on 2017/11/5.
 */
import * as  request from 'superagent';
import * as  cheerio from 'cheerio';
import { Connection, getConnection } from "typeorm";
import { Logger } from '../util/logger';
import { City } from "../entity/city";
import fs = require('fs');
import { News } from '../entity/News';
import { launch, Browser, Page, Response } from 'puppeteer';
import { House } from '../entity/House';

export interface NEWS {
    title: string;
    cityId: number;
    href: string;
}


export class NewsTaskByPup {
  
    constructor(private connection: Connection,private citys: City[] ) {
        Logger.switch = true;
    }



    async startByCity(browser: Browser, city: City): Promise<NEWS[]> {
        let page: Page = await browser.newPage();
        let url = `http://news.baidu.com/ns?word=${city.name}房价&tn=news&from=news&cl=2&rn=20&ct=1`;
        let response: Response = await page.goto(url,{timeout:60000});
        let body = await response.text();
        let $: CheerioSelector = cheerio.load(body);
        let citys_dom: Cheerio = $('#content_left div.result');
        let newsList: NEWS[] = [];
        for (let i = 0; i < citys_dom.length; i++) {
            let $news: Cheerio = $('h3.c-title a', citys_dom[i]);
            let entity = {
                title: $news.text(),
                cityId: 1,
                href: $news.attr('href')
            };
            newsList.push(entity);
        }
        return newsList;
    }


    async saveNews(newsList: NEWS[]): Promise<any> {
        Logger.switch = true;
        Logger.log('values is', newsList);

        let result = await this.connection.createQueryBuilder().insert().into(News).values(newsList).execute();
        Logger.log(result);
        return result;
    }

    async start() {
        let browser: Browser = await launch({ headless: true ,timeout: 0});
        try {
            let promiseArr:any[] = this.citys.map( item => {
                return new Promise(async(resolve,reject)=>{
                    let arr = await this.startByCity(browser, item);
                    console.log(item.name, arr); 
                   resolve(arr);
                }) 
            });
             
            Promise.all(promiseArr).then(async(arr)=>{
                console.log('result',arr);
                let result = await this.saveNews(arr);
                browser.close();
            }); 
        } catch (error) {
            browser.close();
        }
        
    }
}
 