import { cityDao } from '../dao/city';
import { City } from '../entity/city';   
import { Injectable ,Inject} from 'container-ioc'; 
import { News } from '../entity/News';

@Injectable()
export class cityService {
    constructor(@Inject(cityDao) private dao: cityDao) {

    }

    getCitys():Promise<City[]>{
        return this.dao.getCitys();
    }

    getNews():Promise<News[]>{
        return this.dao.getNews();
    }
} 