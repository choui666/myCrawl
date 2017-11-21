import { cityDao } from '../dao/city';
import { City } from '../entity/city';
import { Injectable, Inject } from 'container-ioc';
import { News } from '../entity/News';
import { House } from '../entity/House';

@Injectable()
export class cityService {



    constructor( @Inject(cityDao) private dao: cityDao) {

    }

    getCitys(): Promise<City[]> {
        return this.dao.getCitys();
    }

    getNews(): Promise<News[]> {
        return this.dao.getNews();
    }

    async getCountGroupbyTotalPrice(cityId: string): Promise<{ [index: number]: number }> {
        let houseList = await this.dao.getLatestHouseList(cityId);
        let resultMap = {
            50: 0,
            100: 0,
            150: 0,
            200: 0,
            250: 0,
            300: 0,
            350: 0,
            400: 0,
            450: 0,
            500: 0,
            550: 0,
            600: 0,
            650: 0,
            700: 0,
            750: 0,
            800: 0,
            850: 0,
            900: 0,
            950: 0,
            1000: 0,
            2000: 0,
            3000: 0,
            4000: 0
        }
        for (let house of houseList) {
            if (house.totalPrice < 50) {
                ++resultMap[50];
            } else if (house.totalPrice < 100) {
                ++resultMap[100];
            } else if (house.totalPrice < 150) {
                ++resultMap[150];
            } else if (house.totalPrice < 200) {
                ++resultMap[100];
            } else if (house.totalPrice < 250) {
                ++resultMap[250];
            } else if (house.totalPrice < 300) {
                ++resultMap[300];
            } else if (house.totalPrice < 350) {
                ++resultMap[350];
            } else if (house.totalPrice < 400) {
                ++resultMap[400];
            } else if (house.totalPrice < 450) {
                ++resultMap[450];
            } else if (house.totalPrice < 500) {
                ++resultMap[500];
            } else if (house.totalPrice < 550) {
                ++resultMap[550];
            } else if (house.totalPrice < 600) {
                ++resultMap[600];
            } else if (house.totalPrice < 650) {
                ++resultMap[650];
            } else if (house.totalPrice < 700) {
                ++resultMap[700];
            } else if (house.totalPrice < 750) {
                ++resultMap[750];
            } else if (house.totalPrice < 800) {
                ++resultMap[800];
            } else if (house.totalPrice < 850) {
                ++resultMap[850];
            } else if (house.totalPrice < 900) {
                ++resultMap[900];
            } else if (house.totalPrice < 950) {
                ++resultMap[950];
            } else if (house.totalPrice < 1000) {
                ++resultMap[1000];
            } else if (house.totalPrice < 2000) {
                ++resultMap[2000];
            } else if (house.totalPrice < 3000) {
                ++resultMap[3000];
            } else {
                ++resultMap[4000];
            }
        }
        return resultMap;
    }


    async getCountGroupbyAvaragePrice(cityId: string): Promise<{ [index: number]: number }> {
        let houseList = await this.dao.getLatestHouseList(cityId);
        let resultMap = {
            5000: 0,
            10000: 0,
            15000: 0,
            20000: 0,
            25000: 0,
            30000: 0,
            35000: 0,
            40000: 0,
            45000: 0,
            50000: 0,
            55000: 0,
            60000: 0,
            65000: 0,
            70000: 0,
            75000: 0,
            80000: 0,
            85000: 0,
            90000: 0,
            95000: 0,
            100000: 0,
            120000: 0,
            140000: 0,
            160000: 0,
            200000: 0,
            300000: 0
        }
        for (let house of houseList) {
            if (house.totalPrice < 5000) {
                ++resultMap[5000];
            } else if (house.totalPrice < 10000) {
                ++resultMap[10000];
            }
            else if (house.totalPrice < 15000) { ++resultMap[15000]; }
            else if (house.totalPrice < 20000) { ++resultMap[20000]; }
            else if (house.totalPrice < 25000) { ++resultMap[25000]; }
            else if (house.totalPrice < 30000) { ++resultMap[30000]; }
            else if (house.totalPrice < 35000) { ++resultMap[35000]; }
            else if (house.totalPrice < 40000) { ++resultMap[40000]; }
            else if (house.totalPrice < 45000) { ++resultMap[45000]; }
            else if (house.totalPrice < 50000) { ++resultMap[50000]; }
            else if (house.totalPrice < 55000) { ++resultMap[55000]; }
            else if (house.totalPrice < 60000) { ++resultMap[60000]; }
            else if (house.totalPrice < 65000) { ++resultMap[65000]; }
            else if (house.totalPrice < 70000) { ++resultMap[70000]; }
            else if (house.totalPrice < 75000) { ++resultMap[75000]; }
            else if (house.totalPrice < 80000) { ++resultMap[80000]; }
            else if (house.totalPrice < 85000) { ++resultMap[85000]; }
            else if (house.totalPrice < 90000) { ++resultMap[90000]; }
            else if (house.totalPrice < 95000) { ++resultMap[95000]; }
            else if (house.totalPrice < 100000) { ++resultMap[100000]; }
            else if (house.totalPrice < 120000) { ++resultMap[120000]; }
            else if (house.totalPrice < 140000) { ++resultMap[140000]; }
            else if (house.totalPrice < 160000) { ++resultMap[160000]; }
            else if (house.totalPrice < 200000) { ++resultMap[200000]; }
            else {
                ++resultMap[300000]
            }



        }
        return resultMap;
    }

} 