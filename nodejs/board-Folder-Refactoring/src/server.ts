import { App } from './loaders/app'
const port: number = 5000;

try{
    const app = new App();
    app.init(port);
} catch(err) {
    console.log(err);
    console.log("123");
}
