import {  Prisma } from "@automation/db";
import { LaunchBrowserExecutor } from "../run_functions/launch_browser";
import { PageToHtmlExecutor } from "../run_functions/page_to_html";
import { ExtractTextFromElementExecutor } from "../run_functions/extract_text";

export const ExecutorRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
};
    
export type ExecutionPhaseWithPayload = Prisma.ExecutionPhaseGetPayload<{
    include: {
        action: { include: { taskInfo: { include: { inputs: true, outputs: true } } } }  ,
        trigger: { include: { taskInfo: { include: { inputs: true, outputs: true } } } }
    }
}>

export type TaskWithInfo = Prisma.TaskInfoGetPayload<{
    include: { inputs:  true, outputs: true}
}>

export type Edge = {
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string
}

