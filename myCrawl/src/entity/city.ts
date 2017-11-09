/**
 * Created by admin on 2017/11/2.
 */
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import {House} from "./House";

@Entity()
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    href: string;


    @OneToMany(type => House, house => house.city)
    house:House;

}
