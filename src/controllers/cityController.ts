import { cityService } from '../service/cityService';
import * as koa from 'koa';
import { Injectable, Inject } from 'container-ioc';

@Injectable()
export class cityController {



    constructor( @Inject(cityService) private service: cityService) {

    }

    getCitys = async (ctx: koa.Context) => {
        console.log(this);
        let citys = await this.service.getCitys();
        ctx.body = citys;
    }

    getIndex = async (ctx: koa.Context) => {
        ctx.body = "welcome to mywebsite!!";
    }


}