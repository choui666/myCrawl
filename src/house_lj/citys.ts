/**
 * Created by admin on 2017/11/6.
 */
import   * as request  from 'request';
import   * as  cheerio  from 'cheerio';
import fs = require('fs');
import {getConnection} from "typeorm";
import {City} from "../entity/city";


const url = 'https://bj.lianjia.com/';


export class Citys {

    getCitys():Promise<{href:string,name:string}[]> {
        return new Promise((resolve, reject) => {
            request(url, null, (error, res, body) => {

                if (!error && res.statusCode == 200) {
                    var $ = cheerio.load(body);
                    var leftCitys = $('.fl.citys-l a'), rightCitys = $('.fl.citys-r a'), result:{href:string,name:string}[] = [];

                    
                    leftCitys.each(function () {
                        $(this).attr('href').indexOf('you.lianjia.com')<0&&result.push({
                            href: $(this).attr('href'),
                            name: $(this).text()
                        })
                    });
                    rightCitys.each(function () {
                        $(this).attr('href').indexOf('you.lianjia.com')<0&&result.push({
                            href: $(this).attr('href'),
                            name: $(this).text()
                        })
                    });

                    resolve(result)
                } else {
                    reject({erro: '网络异常'})
                }
            })
        })
    }


    async saveCity() {
        let citys = await  this.getCitys();
        let result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(City)
            .values(citys)
            .execute();
            return result;
    }


    async getCitysFromDataBase(){
       let _citys = await getConnection().createQueryBuilder(City,'city').select().getMany();
       return _citys;
    }

}