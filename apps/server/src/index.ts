import initServer from "./app";
import * as dotenv from "dotenv";

dotenv.config();

async function init() {
  const { app, httpServer } = await initServer(); 

  app.get("/", (req, res) => {
    res.status(200).send({ message: "Server is running" });
  });


  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    console.log(`🚀 GraphQL HTTP: http://localhost:${PORT}/graphql`);
  });
  
}

init();