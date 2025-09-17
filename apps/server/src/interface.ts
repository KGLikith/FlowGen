import { PubSub } from "graphql-subscriptions";

export interface GraphqlContext {
    clerkId: string | null;
    pubsub: PubSub;
}