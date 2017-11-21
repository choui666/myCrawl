import { getRepository } from "typeorm";
import { City } from '../entity/city';
import { Injectable } from 'container-ioc';
import { News } from '../entity/News';
import * as moment from 'moment';
import { House } from "../entity/House";

@Injectable()
export class cityDao {

    async getCitys(): Promise<City[]> {
        let result: City[] = await getRepository(City).createQueryBuilder('city').getMany();
        return result;
    }

    async getNews(): Promise<News[]> {
        let result: News[] = await getRepository(News).createQueryBuilder('news')
            .where(qb=>{
                const subQuery = qb.subQuery()
                .select("DATE_FORMAT(newsub.createTime,'%Y-%m-%d')")
                .from(News, "newsub")
                .orderBy('id','DESC')
                .limit(1) 
                .getQuery();
                return 'DATE_FORMAT(news.createTime,"%Y-%m-%d") = '+ subQuery;
             })
            .getMany();
        return result;
    }

    async getLatestHouseList(cityId: string): Promise<House[]> {
        let latestHouse = await this.getLatestTime(cityId);
        let result = await getRepository(House).createQueryBuilder('house')
            .where('cityId = :cityId', { cityId: cityId })
            .andWhere('DATE_FORMAT(house.createTime,"%Y-%m-%d") = :time',
            { time: moment(latestHouse.createTime).format('YYYY-MM-DD') })
            .getMany();
        return result;
    }

    async getLatestTime(cityId: string): Promise<House> {
        let result: House = await getRepository(House).createQueryBuilder('house')
            .where('cityId = :cityId', { cityId: cityId }).orderBy('id', 'DESC').limit(1).getOne();
        return result;
    }

}