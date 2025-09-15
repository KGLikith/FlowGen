import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@as-integrations/express4';
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { DateTimeResolver } from "graphql-scalars";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 100;

export default async function initServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const schema = makeExecutableSchema({
    typeDefs: `
      scalar DateTime

      type Query {
        hello: String!
      }

      type Mutation {
        ping(message: String!): String!
      }
    `,
    resolvers: {
      DateTime: DateTimeResolver,

      Query: {
        hello: () => "Hello from GraphQL 🚀",
      },

      Mutation: {
        ping: (_: any, { message }: { message: string }) => `Pong: ${message}`,
      },
    },
  });

  const httpServer = createServer(app);

  const gqlserver = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await gqlserver.start();

  app.use(
    "/graphql",
    expressMiddleware(gqlserver, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization?.split(" ")[1];
        // const user = token ? await JWTService.decodeToken(token) : undefined;
        // return { user, req, res };
        return { req, res };
      },
    })
  );

  return { app, httpServer };
}
