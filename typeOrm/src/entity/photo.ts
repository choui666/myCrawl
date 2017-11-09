/**
 * Created by admin on 2017/10/24.
 */
import {Column, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {PhotoMetadata} from "./PhotoMetadata";
import {Author} from "./Author";
import {Album} from "./Album";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column()
    filename: string;

    @Column('double')
    views: number = 0;

    @Column()
    isPublished: boolean = false;


    @OneToOne(type => PhotoMetadata, metadata => metadata.photo, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    metadata: PhotoMetadata;


    @ManyToOne(type => Author, author => author.photos)
    author: Author;


    @ManyToMany(type => Album, album => album.photos)
    albums: Album[];
}