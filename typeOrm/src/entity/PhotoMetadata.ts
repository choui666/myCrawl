import {Entity} from "typeorm/decorator/entity/Entity";
import {Column, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Photo} from "./photo";
/**
 * Created by admin on 2017/10/25.
 */

@Entity()
export class PhotoMetadata {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    height: number;

    @Column("int")
    width: number;

    @Column()
    orientation: string;

    @Column()
    compressed: boolean;

    @Column()
    comment: string;

    @OneToOne(type => Photo)
    @JoinColumn()
    photo: Photo;
}