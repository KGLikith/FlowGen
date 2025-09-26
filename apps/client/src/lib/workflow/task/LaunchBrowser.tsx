// import { TaskParamType, TaskType } from "@/schema/task";
// import { WorkflowTask } from "@/schema/workflow";
// import { GlobeIcon, LucideProps } from "lucide-react";

// export const LaunchBrowserTask = {
//     type: TaskType.LAUNCH_BROWSER,
//     label: "Launch Browser",
//     icon: (props: LucideProps) => <GlobeIcon className="stroke-pint-400 " {...props} />,
//     isEntryPoint: true,
//     credits: 5,
//     inputs: [
//         {
//             name: "Website URL",
//             type: TaskParamType.STRING,
//             placeholder: "https://example.com",
//             required: true,
//             hideHandle: true
//         }
//     ],
//     outputs: [
//         {
//             name: "Web page",
//             type: TaskParamType.BROWSER_INSTANCE
//         }
//     ]
// } satisfies WorkflowTask