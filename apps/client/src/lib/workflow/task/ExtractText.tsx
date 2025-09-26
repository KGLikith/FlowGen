// import { ActionKey, TaskParamType } from "@/gql/graphql";
// import { WorkflowTask } from "@/schema/workflow";
// import { LucideProps, TextIcon } from "lucide-react";

// export const ExtractTextTask = {
//     type: ActionKey.ExtractTextFromElement,
//     label: "Extract Text From Element",
//     icon: (props: LucideProps) => <TextIcon {...props} />,
//     isEntryPoint: false,
//     credits: 2,
//     inputs: [
//         {
//             name: "Html",
//             type: TaskParamType.String,
//             required: true,
//             variant: "textarea"
//         },
//         {
//             name: "Selector",
//             type: TaskParamType.STRING,
//             required: true,
//         },
//     ],
//     outputs: [
//         {
//             name: "Extracted Text",
//             type: TaskParamType.STRING
//         }
//     ]
// } satisfies WorkflowTask