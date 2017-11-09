/**
 * Created by admin on 2017/11/3.
 */
/**
 * Created by admin on 2017/11/2.
 */
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne} from "typeorm";
import {City} from "./city";

@Entity()
export class House {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string = '';

    @Column()
    img: string = '';

    @Column()
    totalPrice: number = 0;

    @Column()
    averagePrice: number = 0;


    @Column()
    square: number = 0;


    @Column()
    address: string = '';


    @Column()
    code: string = '';

    @Column()
    orientation: string = '';

    @Column()
    rooms: string = '';

    @Column()
    isBoutique: boolean = false;

    @Column()
    haveElevatar: boolean = false;

    @Column()
    moreInfoHref: string = '';

    @Column()
    totalFloor: string = '';


    @Column()
    floor: string = '';

    @Column()
    buildTime: number = 0;

    @Column()
    buildType: string = '';

    @Column()
    focusNumber: number = 0;


    @Column()
    watchedNumber: number = 0;


    @Column()
    taxfree: boolean = false;

    @Column()
    subway: boolean = false;

    @CreateDateColumn()
    createTime: Date;

    @ManyToOne(type => City, city => city.house)
    city:City;

}
