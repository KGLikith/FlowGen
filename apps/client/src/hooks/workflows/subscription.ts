import { webhook_subscription } from "@/graphql/subscriptions/automation"
import { useSubscription } from "@apollo/client/react"

export const useWebhookSubscription = (id: string, testing: boolean) => {
    return useSubscription(webhook_subscription,{
        variables: { id },
        skip: !id || !testing,
        onComplete: () => {
            console.log("Webhook Event Data:");
        },
        onError: (error) => {
            console.log("Webhook Event Error:", error);
        },
    })
}