/**
 * Created by admin on 2017/11/2.
 */
import {Entity, PrimaryGeneratedColumn, Column, ManyToMany,JoinTable} from "typeorm";
import {Article} from "./Article";

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;
  
    
    @ManyToMany(type => Article,article => article.tags)  
    articles: Article[];
}
