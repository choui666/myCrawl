/**
 * Created by admin on 2017/11/5.
 */
import   * as request  from 'request';
import   * as  cheerio  from 'cheerio';
import {Connection, getConnection} from "typeorm";
import {House} from "../entity/House";
import {Logger} from "../util/logger";
import {City} from "../entity/city";


export class oldHouses {
    private ershouFang: House[] = [];
    private pointer = 0;
    private errorTime = 0;

    constructor(private connection: Connection, private citys: City[]) {
        Logger.switch = true;
    }

    async  saveHouses() {
        Logger.switch = true;
        Logger.log('values is', this.ershouFang);
        for (let i = 0; i < this.ershouFang.length; i += 20) {
            let result = await  this.connection.createQueryBuilder().insert().into(House).values(this.ershouFang.splice(i, 20)).execute();
            Logger.log(result);
        }
        ++this.pointer;
        this.ershouFang = [];
        this.oldHousesPages();
    }


    getHouseDetail($: CheerioStatic, li: CheerioElement): House {
        let house = new House();
        let title_a = $('div.title a', li), houseInfo_a = $('div.houseInfo', li)
            , positionInfo_div = $('div.positionInfo', li), followInfo_div = $('div.followInfo', li),
            priceInfo_div = $('div.priceInfo', li);

        // Logger.log('$ is ',$);
        // Logger.log('li is ',li);
        // Logger.log('title_a is',title_a);
        // Logger.log('houseInfo_a is ',houseInfo_a);
        // Logger.log('positionInfo_div is ',positionInfo_div);
        // Logger.log('followInfo_div is ',followInfo_div);


        house.name = title_a.text();
        house.code = title_a.attr('data-housecode');
        house.moreInfoHref = title_a.attr('href');

        let infos: string[] = houseInfo_a.text().split('|');

        Logger.log('houseInfo_a', infos);
        infos.length >= 1 && (house.address = infos[0]);
        infos.length >= 2 && (house.rooms = infos[1]);
        infos.length >= 3 && (house.square = Number.parseInt(infos[2].replace('平米', '')));
        infos.length >= 4 && (house.orientation = infos[3]);
        infos.length >= 5 && (house.isBoutique = infos[4].indexOf('简装') > -1 ? false : true);
        infos.length >= 6 && (house.haveElevatar = infos[5].indexOf('无电梯') > -1 ? false : true);

        let position = positionInfo_div.text();
        Logger.log('position is ', position);

        house.floor = (/(.*)层/.exec(position) && /(.*)层/.exec(position)[1]) || '0';
        house.totalFloor = (/\(共(\d*)层\)/.exec(position) && /\(共(\d*)层\)/.exec(position)[1]) || '0';
        house.buildTime = Number.parseInt((/([\d]*)年建/.exec(position) && /([\d]*)年建/.exec(position)[1]) || '0');
        house.buildType = (/.*年建(.*)-/.exec(position) && /.*年建(.*)-/.exec(position)[1]) || '0';
        house.address = house.address + '--' + /.*-(.*)/.exec(position)[1];
        house.floor = house.floor.replace('(共' + house.totalFloor, '');

        let followInfo = followInfo_div.text(), matched: string[];
        Logger.log('followInfo is ', followInfo);
        matched = /(\d+)人关注 \/ 共(\d+)次带看 \/ (.+)发布/.exec(followInfo);
        Logger.log('matched is', matched);
        house.focusNumber = Number.parseInt(matched[1]);
        house.watchedNumber = Number.parseInt(matched[2]);

        house.subway = !!$('span.subway', li).text();
        house.taxfree = !!$('span.taxfree', li).text();


        house.totalPrice = Number.parseInt($('div.totalPrice span', priceInfo_div).text());
        house.averagePrice = Number.parseInt(/单价(\d+)元\/平米/.exec($('div.unitPrice span', priceInfo_div).text())[1]);

        house.img = $('a.img img.lj-lazy', li).attr('data-original');
        house.city = this.citys[this.pointer];
        return house;
    }

    oldHousesOne(maxPage: number, currentPage: number) {
        request(`${this.citys[this.pointer].href}ershoufang/pg${currentPage}`, null, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                this.errorTime = 0;
                let $ = cheerio.load(body);
                const li_nodes = $('.sellListContent li');
                li_nodes.each((index, item) => {
                    this.ershouFang.push(this.getHouseDetail($, item));
                });
                console.log('currentPage,maxPage', currentPage, maxPage);
                if (currentPage <= maxPage) {
                    this.oldHousesOne(maxPage, ++currentPage);
                } else {
                    this.saveHouses();
                }
            } else {
                ++this.errorTime;
                this.errorTime < 5 && this.oldHousesOne(maxPage, currentPage);
                Logger.error('网络异常--oldHousesOne,retry angain times:', this.errorTime);
            }
        })
    }

    maxPage(): Promise<number> {
        return new Promise((resolve, reject) => {
            Logger.log(this.citys, this.pointer, `${this.citys[this.pointer].href}ershoufang/pg1`);
            request(`${this.citys[this.pointer].href}ershoufang/pg1`, null, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    let $ = cheerio.load(body),maxPages = 0;
                    try {
                        maxPages = Number.parseInt(JSON.parse($('.page-box.house-lst-page-box').attr('page-data')).totalPage);
                    }catch (err){
                        Logger.log(err);
                    }
                    resolve(maxPages);
                } else {
                    Logger.error('网络异常--maxPage');
                    reject(0);
                }
            })
        })
    }

    async oldHousesPages() {
        if (this.pointer < this.citys.length) {
            let _maxPage = await   this.maxPage();
            if(_maxPage  === 0 ){//页面不支持 跳过该城市
                ++this.pointer;
                return this.oldHousesPages();
            }
            Logger.log('max page is :', _maxPage);
            this.oldHousesOne(_maxPage, 1);
        }
    }


    start() {
        this.oldHousesPages();
    }
}