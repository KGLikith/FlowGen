import { TaskParamType } from "@/gql/graphql";

export const ColorForHandle: Record<TaskParamType, string> = {
    [TaskParamType.BrowserInstance]: "!bg-blue-500",
    [TaskParamType.String]: "!bg-green-500",
}