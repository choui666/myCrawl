import { BlogDao } from './BlogDao';
import { BlogService } from './BlogService';
import { BlogController } from './BlogController';
import { Container } from 'container-ioc/dist/lib/container';
import { RootContainer, route } from '../router/preStart';
 

const BlogContainer = [BlogDao, BlogService, BlogController];
const container = RootContainer.createChild();
container.register(BlogContainer);
let blogCtr:BlogController = container.resolve(BlogController);

export const BlogRoutes: route[] = [
    {
        path: "/blog/saveArticle",
        method: "post",
        action: blogCtr.saveArticle
    },{
        path: "/blog/getArticles",
        method: "post",
        action: blogCtr.getArticles
    }, {
        path: "/blog/addTag",
        method: "post",
        action: blogCtr.addTag
    }, {
        path: "/blog/updateTag",
        method: "post",
        action: blogCtr.updateTag
    }, {
        path: "/blog/removeTag",
        method: "post",
        action: blogCtr.removeTag
    } ,{
        path: "/blog/getArticles",
        method: "get",
        action: blogCtr.getArticles
    }, {
        path: "/blog/getTag",
        method: "get",
        action: blogCtr.getTag
    } , {
        path: "/blog/addTag",
        method: "get",
        action: blogCtr.addTag
    }, {
        path: "/blog/updateTag",
        method: "get",
        action: blogCtr.updateTag
    }, {
        path: "/blog/removeTag",
        method: "get",
        action: blogCtr.removeTag
    }  
];