import App from "./app";
import { port } from "./config";
// import cookiesParse from "cookie-parser";

const app = new App();

setTimeout(() => {
  app.listen({
    port,
  });
}, 4000);
