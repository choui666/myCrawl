import * as koa from 'koa';
import { Injectable, Inject } from 'container-ioc';
import { Article } from '../entity/Article';
import { BlogService } from './BlogService';
import { Utils } from '../util/index';

@Injectable()
export class BlogController {

    constructor( @Inject(BlogService) private service: BlogService) {

    }

    saveArticle = async (ctx: koa.Context) => {
        let params = Utils.paramEmpty(ctx, ['title', 'content', 'shortCuts', 'tags']);
        let result = await this.service.saveArticle(params);
        ctx.body = result
    }

    getArticles  = async (ctx: koa.Context) => { 
        let params = Utils.paramEmpty(ctx, ['pageIndex', 'pageSize']);
        if( Number.isNaN(Number.parseInt(params.get('pageIndex'))) ){
           return ctx.throw('pageIndex 必须为数字')
        }else if(Number.isNaN(Number.parseInt(params.get('pageSize')))){
            return  ctx.throw('pageSize 必须为数字')
        }
        let result = await this.service.getArticles(params);
        ctx.body = result
    }


    getTag = async (ctx: koa.Context) => {
        let label:string = ctx.query['label'];
        let result = await this.service.getTag(label||'');
        ctx.body = result
    }


    addTag = async (ctx: koa.Context) => {
        let params = Utils.paramEmpty(ctx, ['label']);
        let result = await this.service.addTag(params);
        ctx.body = result
    }

    updateTag = async (ctx: koa.Context) => {
        let params = Utils.paramEmpty(ctx, ['label','id']);
        let result = await this.service.updateTag(params);
        ctx.body = result
    }

    removeTag = async (ctx: koa.Context) => {
        let params = Utils.paramEmpty(ctx, ['id']);
        let result = await this.service.removeTag(params);
        ctx.body = result
    }

   
    
 
}