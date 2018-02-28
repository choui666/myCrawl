import { BlogDao } from './BlogDao';
import { Injectable, Inject } from 'container-ioc';
import { Article } from '../entity/Article';
import { Tag } from '../entity/Tag';

@Injectable()
export class BlogService {



    constructor( @Inject(BlogDao) private dao: BlogDao) {

    }

    async saveArticle(param: Map<string, string>) {
        let artilce = new Article();
        artilce.tags = [];
        param.forEach((value, key, item) => {
            if (key !== 'tags') artilce[key] = value;
        });
        const tags = JSON.parse(param.get('tags'));
        tags.forEach((item:{ id: number, label: string}) => { 
            let _tag = new Tag();
            _tag.id = item.id;
            _tag.label = item.label;
            artilce.tags.push(_tag);
        }); 
        let result = await this.dao.saveArticle(artilce);
        return result;
    }

    async getArticles(param: Map<string, string>) {
        let PageSearch = {
            pageSize: Number.parseInt(param.get('pageSize')),
            pageIndex: Number.parseInt(param.get('pageIndex')),
            tag: param.get('tag')
        } 
        let result = await this.dao.getArticles(PageSearch);
        let totalCount =  await this.dao.countArticles(PageSearch);
        return {
            list:result,
            totalCount
        }
    }

    async getTag(label: string) {
        console.log('service getTag');
        let result = await this.dao.getTag(label);
        console.log('service getTag result');
        return result;
    }

    async addTag(param: Map<string, string>) {
        let tag = new Tag();
        param.forEach((value, key, item) => {
            tag[key] = value;
        })
        let result = await this.dao.addTag(tag);
        return result;
    }

    async updateTag(param: Map<string, string>) {
        let tag = new Tag();
        param.forEach((value, key, item) => {
            tag[key] = value;
        })
        let result = await this.dao.updateTag(tag);
        return result;
    }

    async removeTag(param: Map<string, string>) {
        let tag = new Tag();
        param.forEach((value, key, item) => {
            tag[key] = value;
        })
        let result = await this.dao.removeTag(tag);
        return result;
    }


} 