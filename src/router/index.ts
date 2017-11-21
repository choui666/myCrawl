import * as compose from "koa-compose";
import *as Router from "koa-router";
import * as koa from 'koa'; 
import { cityController } from '../controllers/cityController';
import { Container } from 'container-ioc';
import { cityService } from '../service/cityService';
import { cityDao } from '../dao/city';

let container = new Container();
container.register([cityDao,cityService,cityController]);

const cityCtr:cityController = container.resolve(cityController); 
  
export interface route{
    path:string;
    method:'get'|'post';
    action:koa.Middleware;
}

export const routes:route[]  =  [
    {
        path:"/",
        method:"get",
        action:cityCtr.getIndex
    },
    {
        path:"/citys",
        method:"get",
        action:cityCtr.getCitys
    }, {
        path:"/news",
        method:"get",
        action:cityCtr.getNews
    },{
        path:"/totalPriceGroup",
        method:"get",
        action:cityCtr.getCountGroupbyTotalPrice
    }, {
        path:"/avaragePriceGroup",
        method:"get",
        action:cityCtr.getCountGroupbyAvaragePrice
    }, {
        path:"/squareGroup",
        method:"get",
        action:cityCtr.getCountGroupbySquare
    }, 

    
    
];

export let router:Router = new   Router(); 
routes.forEach((rt:route)=>{
    router[rt.method](rt.path,rt.action);
})