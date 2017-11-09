import {Column, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Photo} from "./photo";
import {Entity} from "typeorm/decorator/entity/Entity";
/**
 * Created by admin on 2017/10/25.
 */
@Entity()
export class Author {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Photo, photo => photo.author) // note: we will create author property in the Photo class below
    photos: Photo[];
}