import fs from "fs";
import path from 'path';


export const routingControllerOptions = {
  cors: true,
  // routePrefix: "/api",
  controllers: [__dirname+'/../controllers/*{.ts,.js}'],
  middlewares: [`${__dirname}/../middlewares/*{.ts,.js}`],
  defaultErrorHandler : false,
};