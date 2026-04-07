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
import { GraphqlData } from "./graphql";
import userService from "./services/user";
import webhookrouter from "./routes/webhook";
import { verifyToken } from "@clerk/backend";

EventEmitter.defaultMaxListeners = 100;

export default async function initServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(clerkMiddleware());

  // type Mutation {
  //   ${User.mutations}
  // }

  app.use('/webhook', webhookrouter)

  const schema = makeExecutableSchema({
    typeDefs: `
      scalar DateTime
      scalar JSON

      ${GraphqlData.types}

      type Query {
        ${GraphqlData.queries}
      }

      type Mutation {
        ${GraphqlData.mutations}
      }

      type Subscription {
        ${GraphqlData.subscriptions}
      }

    `,
    resolvers: {
      DateTime: DateTimeResolver,

      Query: {
        ...GraphqlData.resolvers.queries,
      },
      Mutation: {
        ...GraphqlData.resolvers.mutations,
      },
      Subscription: {
        ...GraphqlData.resolvers.subscriptions,
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
    execute: async (args) => execute(args),
    subscribe: async (args) => subscribe(args),
    context: async (ctx) => {
      const token =
        typeof ctx.connectionParams?.headers === "object"
          ? (ctx.connectionParams.headers as Record<string, any>)?.authorization
          : undefined;

      let clerkId = null;

      if (token) {
        try {
          const verifiedToken = await verifyToken(token.replace("Bearer ", ""), {
            secretKey: process.env.CLERK_SECRET_KEY!,
          });
          clerkId = verifiedToken.sub;
        } catch (err) {
          console.error("❌ Clerk token verification failed:", (err as Error).message);
        }
      }

      return { clerkId, pubsub };
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
        let user = null;

        if (auth.userId) {
          user = await userService.upsertUser(auth.userId);
        }

        return {
          req,
          res,
          clerkId: auth.userId,
          pubsub,
        };
      },
    })
  );

  return { app, httpServer };
}
