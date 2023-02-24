import { App } from './loaders/app'
const port: number = 4000;

try{
    const app = new App();
    app.init(port);
} catch(err) {
    console.log(err);
}
