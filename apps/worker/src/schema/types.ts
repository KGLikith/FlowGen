import {  Prisma } from "@automation/db";
import { LaunchBrowserExecutor } from "../run_functions/launch_browser";
import { PageToHtmlExecutor } from "../run_functions/page_to_html";
import { ExtractTextFromElementExecutor } from "../run_functions/extract_text";
import { FillInputExecutor } from "../run_functions/fill_input";
import { ClickElementExecutor } from "../run_functions/clickElement";
import { WaitForElementExecutor } from "../run_functions/waitForElement";
import { WebhookExecutor } from "../run_functions/webhook";
import { TriggerWebhookExecutor } from "../run_functions/triggerWebhook";

export const ExecutorRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  WEBHOOK: WebhookExecutor,
  TRIGGER_WEBHOOK: TriggerWebhookExecutor,
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

