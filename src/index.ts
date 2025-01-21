import { ApolloServer } from '@apollo/server';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
  const app = express();
  app.use(express.json());

  const Port = Number(process.env.Port) || 8000;

  app.get("/", (req, res) => {
    res.json({ message: 'server is up and running' });
  });

//make graphqlserver

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String,
        say(name:String):String
      }
    `,
    resolvers: {
    
      Query: {
        hello: () => 'Hello from GraphQL',
        say: (_, { name }) => `Hey ${name}, how are you?`
      }
    },
  });

  // start the gql server
  await gqlServer.start();

  // Fix usage of expressMiddleware
  app.use('/graphql', expressMiddleware(gqlServer));


  app.listen(Port, () => console.log(`server started at PORT:${Port}`));
}

init();
