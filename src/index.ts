import express from 'express';
import createApolloServer from './graphql';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';


async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;
  app.use(express.json());
  app.use(cors());

  // Create GraphQL server
  

  app.get("/", (req, res) => {
    res.json({ message: "server is up and running" });
  });

  // Use expressMiddleware with Apollo Server
  app.use('/graphql', expressMiddleware(await createApolloServer()));

  app.listen(PORT, () => {
    console.log(`server started at PORT: ${PORT}`);
  });
}

init();
