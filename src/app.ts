import express, { Application } from "express";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import { Database } from "./db";

class App {
  public app: Application;
  constructor() {
    new Database();
    this.app = express();
  }
  public listen(appInt: { port: number }) {
    const options = {};

    const server = createServer(options, this.app);
    server.listen(appInt.port, (): void => {
      const middleware = fs.readdirSync(path.join(__dirname, "/middleware"));
      this.middleware(middleware, "top."); // top middleware
      this.routes(); //routes
      this.middleware(middleware, "bottom."); // bottom middleware

      console.log(`App listening on port ${appInt.port}`);
    });
  }
  private middleware(middleware: any[], st: "bottom." | "top.") {
    middleware.forEach((middle) => {
      if (middle.includes(st)) {
        import(path.join(__dirname + "/middleware/" + middle)).then(
          (middleReader) => {
            new middleReader.default(this.app);
          }
        );
      }
    });
  }
  private routes() {
    const subRoutes = fs.readdirSync(path.join(__dirname, "/routes"));
    subRoutes.forEach((file: any): void => {
      if (file.includes(".routes.")) {
        const routPath = file.split(".")[0];
        import(path.join(__dirname + "/routes/" + file)).then((route) => {
          const rootPath = `/api/v1/${routPath}`;
          this.app.use(rootPath, new route.default().router);
        });
      }
    });
  }
}
export default App;
