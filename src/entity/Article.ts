/**
 * Created by admin on 2017/11/2.
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable,CreateDateColumn } from "typeorm";
import { Tag } from "./Tag";

@Entity()
export class Article {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type:'mediumtext'
    })
    content: string;

    @Column()
    shortCuts: string;
 
    @CreateDateColumn()
    createTime: Date;
    
    @ManyToMany(type => Tag,tag => tag.articles, {
        cascadeInsert: true,
        cascadeUpdate: true
    }) 
    @JoinTable() 
    tags: Tag[];

   

}
