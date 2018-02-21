import { getRepository, getConnection } from "typeorm";
import { Injectable } from 'container-ioc';
import * as moment from 'moment';
import { Article } from '../entity/Article';
import { Tag } from '../entity/Tag';

@Injectable()
export class BlogDao {
    async saveArticle(article: Article): Promise<any> {
        return await getConnection().manager.save(article);


        // .createQueryBuilder() 
        // .insert()
        // .into(Article) 
        // .values(article)
        // .execute();
    }

    async getArticles(param: {
        pageSize: number,
        pageIndex: number,
        tag: string
    }) {
        if (param.tag) {
            return await getConnection()
                .createQueryBuilder()
                .from(Article, 'article')
                .select('article')
                .leftJoin('article.tags', 'tag')
                .addSelect(['group_concat(tag.id) as tagIds','group_concat(tag.label) as tagNames'])
                .where("tag.id = :tag", { tag: param.tag })
                .groupBy('article.id')
                .skip(param.pageSize * (param.pageIndex - 1))
                .limit(param.pageSize)
                .execute();
        } else {
            return await getConnection()
                .createQueryBuilder()
                .from(Article, 'article') 
                .select('article')
                .leftJoin('article.tags', 'tag') 
                .addSelect(['group_concat(tag.id) as tagIds','group_concat(tag.label) as tagNames'])
                .groupBy('article.id')
                .skip(param.pageSize * (param.pageIndex - 1))
                .limit(param.pageSize)
                .execute();
        }
    }

    async countArticles(param: {
        pageSize: number,
        pageIndex: number,
        tag: string
    }) {
        if (param.tag) {
            return await getConnection()
                .createQueryBuilder()
                .from(Article, 'article') 
                .leftJoin('article.tags', 'tag') 
                .where("tag.id = :tag", { tag: param.tag })
                .groupBy('article.id') 
                .getCount(); 
                //.execute();
        } else {
            return await getConnection()
                .createQueryBuilder()
                .from(Article, 'article') 
                .select('article')
                .leftJoin('article.tags', 'tag') 
                .addSelect(['group_concat(tag.id) as tagIds','group_concat(tag.label) as tagNames'])
                .groupBy('article.id') 
                .getCount(); 
        }
    }




    async getTag(label: string): Promise<any> {
        return await getConnection()
            .createQueryBuilder()
            .from(Tag, 'tag')
            .where("tag.label like :label", { label: `%${label}%` })
            .execute();
    }

    async addTag(tag: Tag): Promise<any> {
        return await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Tag)
            .values(tag)
            .execute();
    }

    async updateTag(tag: Tag): Promise<any> {
        return await getConnection()
            .createQueryBuilder()
            .update(Tag)
            .set({ label: tag.label })
            .where("id = :id", { id: tag.id })
            .execute();
    }

    async removeTag(tag: Tag): Promise<any> {
        return await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Tag)
            .where("id = :id", { id: tag.id })
            .execute();
    }

}