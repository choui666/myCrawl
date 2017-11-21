import { getRepository } from "typeorm";
import { City } from '../entity/city';
import { Injectable } from 'container-ioc';
import { News } from '../entity/News';
import * as moment from 'moment';

@Injectable()
export class cityDao {

    async getCitys(): Promise<City[]> { 
        let result: City[] = await getRepository(City).createQueryBuilder('city').getMany(); 
        return result;
    }

    async getNews(): Promise<News[]> { 
        let result: News[] = await getRepository(News).createQueryBuilder('news')
        .where('DATE_FORMAT(news.createTime,"%Y-%m-%d") = :time',{time: moment().format('YYYY-MM-DD')}).getMany(); 
        return result;
    }
    
}