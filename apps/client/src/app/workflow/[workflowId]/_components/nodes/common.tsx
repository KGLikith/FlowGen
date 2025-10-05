import { TaskParamType } from "@/gql/graphql";

export const ColorForHandle: Record<TaskParamType, string> = {
    [TaskParamType.BrowserInstance]: "!bg-blue-500",
    [TaskParamType.String]: "!bg-green-500",
    [TaskParamType.Select]: "!bg-purple-500",
    [TaskParamType.WebhookParams]: "!bg-yellow-500",
    [TaskParamType.Credential]: "!bg-pink-500",
}