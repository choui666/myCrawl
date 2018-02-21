import { Container } from "container-ioc/dist/lib/container";
import * as koa from 'koa';

export let  RootContainer = new Container();

export interface route {
    path: string;
    method: 'get' | 'post';
    action: koa.Middleware;
}