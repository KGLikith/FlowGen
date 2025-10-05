import { Prisma } from "@automation/db";
import { LaunchBrowserExecutor } from "../run_functions/launch_browser";
import { PageToHtmlExecutor } from "../run_functions/page_to_html";
import { ExtractTextFromElementExecutor } from "../run_functions/extract_text";
import { FillInputExecutor } from "../run_functions/fill_input";
import { ClickElementExecutor } from "../run_functions/click_element";
import { WaitForElementExecutor } from "../run_functions/wait_for_element";
import { WebhookExecutor } from "../run_functions/webhook";
import { TriggerWebhookExecutor } from "../run_functions/trigger_webhook";
import { ExtractDataWithAIExecutor } from "../run_functions/extract_data_with_ai";
import { ReadPropertyFromJSONExecutor } from "../run_functions/read_property_from_json";
import { AddPropertyToJSONExecutor } from "../run_functions/add_property_to_json";
import { NavigateURLExecutor } from "../run_functions/navigate_url";
import { ScrollToElementExecutor } from "../run_functions/scroll_to_element";

export const ExecutorRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  WEBHOOK: WebhookExecutor,
  TRIGGER_WEBHOOK: TriggerWebhookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJSONExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJSONExecutor,
  NAVIGATE_URL: NavigateURLExecutor,
  SCROLL_ELEMENT: ScrollToElementExecutor,

};

export type ExecutionPhaseWithPayload = Prisma.ExecutionPhaseGetPayload<{
  include: {
    action: {
      include: { taskInfo: { include: { inputs: true; outputs: true } } };
    };
    trigger: {
      include: { taskInfo: { include: { inputs: true; outputs: true } } };
    };
  };
}>;

export type TaskWithInfo = Prisma.TaskInfoGetPayload<{
  include: { inputs: true; outputs: true };
}>;

export type Edge = {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
};
