import { graphql } from "@/gql";

export const webhook_subscription = graphql(`
    subscription WebhookEvent($id: ID!) {
        webhookEvent(id: $id)
    }
`)