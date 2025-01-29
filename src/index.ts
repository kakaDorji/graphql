import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { prismaClient } from './libs/db';

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;
  app.use(express.json());
  app.use(cors());

  // Create GraphQL server
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name:String):String
      }
      type Mutation{
      createUser(firstName:String!,lastName:String!,email:String!,password:String!):Boolean
      }  
    `,
    resolvers: {
      Query: {
        hello: () => 'hey there from graphql server',
        say: (_, { name }:{name:String}) => `hey ${name}`,
      },
      Mutation:{
        createUser:async(_,{firstName,lastName,email,password}:{
          firstName:string;
          lastName:string;
          email:string;
          password:string
        })=>{
       await prismaClient.user.create({
        data:{
           email,
           firstName,
           lastName,
           password,
           salt:"random_salt", 
        }
       });
       return true;

        }

      }
    },
  });

  // Start the GraphQL server
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "server is up and running" });
  });

  // Use expressMiddleware with Apollo Server
  app.use('/graphql', expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`server started at PORT: ${PORT}`);
  });
}

init();
