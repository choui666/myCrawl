import {getRepository} from "typeorm";
import { City } from '../entity/city'; 
import { Injectable } from 'container-ioc';

 @Injectable()
export class cityDao{
    
    async getCitys():Promise<City[]>{
        let result:City[] = await getRepository(City).createQueryBuilder('city').getMany();
        return result;
    }
}