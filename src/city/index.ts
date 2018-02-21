import { Container } from 'container-ioc/dist/lib/container';
import { RootContainer, route } from '../router/preStart';
import { cityDao } from './cityDao';
import { cityService } from './cityService';
import { cityController } from './cityController';

let cityContainer = [cityDao, cityService, cityController];

const container = RootContainer.createChild();
container.register(cityContainer);
let cityCtr = container.resolve(cityController);

export let CityRoutes: route[] = [
    {
        path: "/",
        method: "get",
        action: cityCtr.getIndex
    },
    {
        path: "/citys",
        method: "get",
        action: cityCtr.getCitys
    }, {
        path: "/news",
        method: "get",
        action: cityCtr.getNews
    }, {
        path: "/totalPriceGroup",
        method: "get",
        action: cityCtr.getCountGroupbyTotalPrice
    }, {
        path: "/avaragePriceGroup",
        method: "get",
        action: cityCtr.getCountGroupbyAvaragePrice
    }, {
        path: "/squareGroup",
        method: "get",
        action: cityCtr.getCountGroupbySquare
    }
];
