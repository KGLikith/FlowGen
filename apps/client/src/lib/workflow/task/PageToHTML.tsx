import { TaskParamType, TaskType } from "@/schema/task";
import { WorkflowTask } from "@/schema/workflow";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHTMLTask = {
    type: TaskType.PAGE_TO_HTML,
    label: "Page to HTML",
    icon: (props: LucideProps) => <CodeIcon  {...props} />,
    isEntryPoint: false,
    credits: 2,
    inputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
            required: true,
        }
    ],
    outputs: [
        {
            name: "HTML Content",
            type: TaskParamType.STRING,
        },
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
        }
    ]
} satisfies WorkflowTask