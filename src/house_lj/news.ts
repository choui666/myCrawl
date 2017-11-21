/**
 * Created by admin on 2017/11/5.
 */
import * as  request from 'superagent';
import * as  cheerio from 'cheerio';
import { Connection, getConnection } from "typeorm";
import { Logger } from '../util/logger';
import { City } from "../entity/city";
import fs = require('fs');
import { News } from '../entity/News';

export class NewsTask {
    private newsList: { title: string; href: string }[] = [];
    private pointer = 0;
    private errorTime = 0;

    constructor(private connection: Connection) {
        Logger.switch = true;
    }

    async  saveNews() {
        Logger.switch = true;
        Logger.log('values is', this.newsList);

        let result = await this.connection.createQueryBuilder().insert().into(News).values(this.newsList).execute();
        Logger.log(result);
    }

    allNews() {
        let url = 'http://news.baidu.com/house';
        console.log(url);
        //request.get(url).pipe((fs.createWriteStream('news2.html')));

        request.get(url).set({
            'Referer': 'http://news.baidu.com',
            'Accept': 'image/webp,image/*,*/*;q=0.8'
        }).end((err: any, res: request.Response) => {
            if (!err && res.status == 200) {
                this.errorTime = 0;
                let $ = cheerio.load(res.text);
                const jiaodian_node = $('.l-common.section')[0]; 
                const jiaodian_node_lis = $('li', jiaodian_node);
                jiaodian_node_lis.each((index, item) => {
                    this.newsList.push({
                        title: $(item).text(),
                        href: $('a',item).attr('href')
                    });
                });
                this.saveNews();
            } else {
                ++this.errorTime;
                this.errorTime < 5 && this.allNews();
                Logger.error('网络异常--allNews,retry angain times:', this.errorTime);
            }
        })
    }


    start() {
        this.allNews();
    }
}
 