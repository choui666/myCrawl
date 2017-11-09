/**
 * Created by admin on 2017/11/2.
 */
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    href: string;



}
