import { cityService } from '../service/cityService';
import * as koa from 'koa';
import { Injectable, Inject } from 'container-ioc';

@Injectable()
export class cityController {



    constructor( @Inject(cityService) private service: cityService) {

    }


    getNews = async  (ctx: koa.Context) => {
        let news = await this.service.getNews();
        ctx.body = news;
    }

    getCitys = async (ctx: koa.Context) => { 
        let citys = await this.service.getCitys();
        ctx.body = citys;
    }

    getIndex = async (ctx: koa.Context) => {
        ctx.body = "welcome to mywebsite!!";
    }


}