import * as koa from 'koa';
import * as  request from 'superagent';

export class Utils{
    static paramEmpty(ctx: koa.Context, props: string[]) :Map<string,string>{
        let param = new Map<string,string>();
        if(ctx.method==='GET'){
            props.forEach(prop => {
                if (!ctx.query[prop]) {
                    ctx.throw(prop + '不能为空');
                }
                param.set(prop,ctx.query[prop]);
            });
        }else{
            props.forEach(prop => {
                if (!ctx.request['body'][prop]) {
                    ctx.throw(prop + '不能为空');
                }
                param.set(prop,ctx.request['body'][prop]);
            });
        }
        
        return param;
    }

    // static translateToNum(){

    // }
}