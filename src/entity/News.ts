/**
 * Created by admin on 2017/11/2.
 */
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm"; 

@Entity()
export class News {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    href: string;

    @CreateDateColumn()
    createTime: Date;

}
