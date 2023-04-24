import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middleware/json.js";

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  await json(req, res);  
  
  const route = routes.find((route) => {
    return route.method === method && route.url.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.url);

    const { query ,...params } = routeParams.groups;

    req.params = params;

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
