import App from "./app";
import { port } from "./config";
// import cookiesParse from "cookie-parser";

const app = new App();

app.listen({
  port,
});
