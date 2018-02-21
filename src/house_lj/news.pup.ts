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
  
     pointer = 0;

    constructor(private connection: Connection,private citys: City[] ) {
        Logger.switch = true;
    }



    async startByCity(browser: Browser, city: City)  {
        let page: Page = await browser.newPage();
        let url = `http://news.baidu.com/ns?word=${city.name}房价&tn=news&from=news&cl=2&rn=20&ct=1`;
        let response: Response = await page.goto(url);
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
        let result = await this.saveNews(newsList);
        this.pointer++;
        if(this.citys&&this.citys.length>this.pointer){
            this.startByCity(browser,this.citys[this.pointer]);
        }else{
            this.pointer = 0;
            browser.close(); 
        }
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
            this.startByCity(browser,this.citys[this.pointer]); 
        } catch (error) {
            browser.close();
        }
        
    }

    
}
 