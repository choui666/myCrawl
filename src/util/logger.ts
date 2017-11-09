/**
 * Created by admin on 2017/11/5.
 */
export class Logger {

    static switch: boolean = false;

    static log(...args) {
        Logger.switch && console.log([...args])
    }

    static error(...args) {
        Logger.switch && console.log([...args])
    }

    static warning(...args) {
        Logger.switch && console.log([...args])
    }
}