import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {User} from "./entity/User";
import {Photo} from "./entity/photo";
import {PhotoMetadata} from "./entity/PhotoMetadata";
import {Album} from "./entity/Album";
import {City} from "./entity/city";

createConnection().then(async connection => {

     //excuteCity(connection);
    // excutePhoto(connection);
    // excuteTest(connection);
    // excuteRepositoryPhoto(connection);
    //excuteRepositoryPhotoALL(connection);
    //excuteOnetoOneRepository(connection);
    //excuteOnetoOneRepository2(connection);
    // excuteOnetoOneRepository3(connection);
    //excuteOnetoOneRepositoryAuto(connection);
    //excuteManytoManyManager(connection);
    //excuteManytoManyRepository(connection);

}).catch(error => console.log(error));



async function excuteCity(connection: Connection) {
    console.log("Inserting a new user into the database...");
    const city = new City();
    city.name = "北京";
    city.href = "https://nj.lianjia.com/";
    console.log(city);
    await connection.manager.save(city);
    console.log("Saved a new user with id: " + city.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(City);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");
}




async function excuteUser(connection: Connection) {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "choui2";
    user.lastName = "karon";
    user.age = 26;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");
}


async function excutePhoto(connection: Connection) {
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;

    return connection.manager
        .save(photo)
        .then(photo => {
            console.log("Photo has been saved. Photo id is", photo.id);
        });
}


async function excuteTest(connection: Connection) {
    /*...*/
    let savedPhotos = await connection.manager.find(Photo);
    console.log("All photos from the db: ", savedPhotos);
}


async function excuteRepositoryPhoto(connection: Connection) {
    let photo = new Photo();
    photo.name = "Me and lion";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-lion.jpg";
    photo.views = 4;
    photo.isPublished = false;

    let photoRepository = connection.getRepository(Photo);

    await photoRepository.save(photo);
    console.log("Photo has been saved");

    let savedPhotos = await photoRepository.find();
    console.log("All photos from the db: ", savedPhotos);
}

async function excuteRepositoryPhotoALL(connection: Connection) {
    /*...*/
    let photoRepository = connection.getRepository(Photo);

    // let allPhotos = await photoRepository.find();
    // console.log("All photos from the db: ", allPhotos);

    let firstPhoto = await photoRepository.findOneById(1);
    console.log("First photo from the db: ", firstPhoto);

    let meAndBearsPhoto = await photoRepository.findOne({name: "Me and Bears"});
    console.log("Me and Bears photo from the db: ", meAndBearsPhoto);

    let allViewedPhotos = await photoRepository.find({views: 1});
    console.log("All viewed photos: ", allViewedPhotos);

    let allPublishedPhotos = await photoRepository.find({isPublished: true});
    console.log("All published photos: ", allPublishedPhotos);

    let [allPhotos, photosCount] = await photoRepository.findAndCount();
    console.log("All photos: ", allPhotos);
    console.log("Photos count: ", photosCount);
}

async function excuteOnetoOneRepository2(connection: Connection) {

    let photoRepository = connection.getRepository(Photo);
    let photos = await photoRepository.find({relations: ["metadata"]});
    console.log('the result is：', photos)
}

async function excuteOnetoOneRepository3(connection: Connection) {
    /*...*/
    let photos = await connection
        .getRepository(Photo)
        .createQueryBuilder("photo")
        .innerJoinAndSelect("photo.metadata", "metadata")
        .getMany();
    console.log('the result is：', photos);
}


async function excuteOnetoOneRepositoryAuto(connection: Connection) {
    /*...*/
    // create photo object
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg"
    photo.isPublished = true;

    // create photo metadata object
    let metadata = new PhotoMetadata();
    metadata.height = 640;
    metadata.width = 480;
    metadata.compressed = true;
    metadata.comment = "cybershoot";
    metadata.orientation = "portait";

    photo.metadata = metadata; // this way we connect them

    // get repository
    let photoRepository = connection.getRepository(Photo);

    // saving a photo also save the metadata
    await photoRepository.save(photo);

    console.log("Photo is saved, photo metadata is saved too.")
}

async function excuteManytoManyManager(connection: Connection) {
    // create a few albums
    let album1 = new Album();
    album1.name = "Bears";
    await connection.manager.save(album1);

    let album2 = new Album();
    album2.name = "Me";
    await connection.manager.save(album2);

// create a few photos
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.albums = [album1, album2];
    await connection.manager.save(photo);

// now out photo is saved and albums are attached to it
// now lets load them:
    const loadedPhoto = await connection
        .getRepository(Photo)
        .findOneById(1, {relations: ["albums"]});

    console.log('the result is:', loadedPhoto);
}


async function excuteManytoManyRepository(connection: Connection) {
    let photos = await connection
        .getRepository(Photo)
        .createQueryBuilder("photo") // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
        .innerJoinAndSelect("photo.metadata", "metadata")
        .leftJoinAndSelect("photo.albums", "album")
        .where("photo.isPublished = true")
        .andWhere("(photo.name = :photoName OR photo.name = :bearName)")
        .orderBy("photo.id", "DESC")
        .take(10)
        .setParameters({photoName: "Me and Bears", bearName: "Me and lion"})
        .getMany();
    console.log('this result is:', photos)
}

