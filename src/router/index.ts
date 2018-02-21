import *as Router from "koa-router";
import * as koa from 'koa';
import { BlogRoutes } from "../blog/index";
import { CityRoutes } from "../city/index"; 
import { route } from './preStart';

   
export const routes: route[] = [
    ...CityRoutes,
    ...BlogRoutes
]

export let router: Router = new Router();
routes.forEach((rt: route) => {
    router[rt.method](rt.path, rt.action);
})