import { ApolloServer } from '@apollo/server';
import { User } from './user';
import { mutation } from './user/mutation';  // Ensure this is imported correctly

async function createApolloServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
      }
      type Mutation {
        ${User.mutation}  
      }
    `,
    resolvers: {
      Query: {
      ...User.resolvers.queries
      },
      Mutation: {
        ...User.resolvers.mutation,  // Make sure this resolver is defined in the User module
      },
    },
  });

  // Start the GraphQL server
  await gqlServer.start();

  return gqlServer;
}

export default createApolloServer;
