/**
 * Created by admin on 2017/11/2.
 */
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { Article } from "./Article";

@Entity()
export class Article_Statistics {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    like: number

    @Column()
    watched: number

    @OneToOne(type => Article)
    @JoinColumn()
    article: Article;

}
