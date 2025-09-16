import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { DateTimeResolver } from "graphql-scalars";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { EventEmitter } from "events";
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { execute, subscribe } from "graphql";
import { pubsub } from "../clients/pubsub";
import { prisma } from "@org/db";

EventEmitter.defaultMaxListeners = 100;

export default async function initServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(clerkMiddleware());

  const schema = makeExecutableSchema({
    typeDefs: `
      scalar DateTime

      type Query {
        hello: String!
      }

    `,
    resolvers: {
      DateTime: DateTimeResolver,

      Query: {
        hello: (_: any, __: any, { auth }) => {
          console.log("Auth: ", auth);
          console.log("UserId: ", auth.userId);

          return "Hello world!";
        },
      },
    },
  });

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/subscriptions",
  });

  const serverCleanup = useServer(
    {
      schema,
      execute,
      subscribe,
      context: async (ctx) => {
        const token = ctx.connectionParams?.authorization as string | undefined;

        let auth = null;
        if (token) {
          auth = getAuth({ headers: { authorization: token } } as any);
        }

        return { auth, pubsub };
      },
    },
    wsServer
  );

  const gqlserver = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await gqlserver.start();

  app.use(
    "/graphql",
    expressMiddleware(gqlserver, {
      context: async ({ req, res }) => {
        const auth = getAuth(req);

        return {
          req,
          res,
          auth,
        };
      },
    })
  );

  return { app, httpServer };
}
