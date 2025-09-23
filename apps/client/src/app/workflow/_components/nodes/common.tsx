import { TaskParamType } from "@/schema/task";

export const ColorForHandle: Record<TaskParamType, string> = {
    [TaskParamType.BROWSER_INSTANCE]: "!bg-blue-500",
    [TaskParamType.STRING]: "!bg-green-500",
}