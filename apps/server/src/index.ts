import initServer from "./app";
import * as dotenv from "dotenv";
import { altairExpress } from "altair-express-middleware";


dotenv.config();

async function init() {
  const { app, httpServer } = await initServer(); 

  app.get("/", (req, res) => {
    res.status(200).send({ message: "Server is running" });
  });

  app.use(
    "/altair",
    altairExpress({
      endpointURL: "/graphql",
      subscriptionsEndpoint: `ws://localhost:4000/subscriptions`,
    })
  );

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    console.log(`🚀 GraphQL HTTP: http://localhost:${PORT}/graphql`);
    console.log(`📡 Subscriptions WS: ws://localhost:${PORT}/subscriptions`);
    console.log(`🧪 Altair Playground: http://localhost:${PORT}/altair`);
  });
  
}

init();