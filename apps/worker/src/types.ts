import { ActionKey, TriggerKey } from "@automation/db";
import { LaunchBrowserExecutor } from "./run_functions/launch_browser";
import { PageToHtmlExecutor } from "./run_functions/page_to_html";
import { ExtractTextFromElementExecutor } from "./run_functions/extract_text";
import { Browser } from "puppeteer";

export interface AppNodeData {
  trigger: boolean;
  triggerId?: string;
  actionId?: string;
  credits: number;
  type: TriggerKey | ActionKey;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface AppNode {
  data: AppNodeData;
}

export const ExecutorRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
};
    
export type Environment = {
  browser?: Browser;
  phases: Record<
    string,
    {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    }
  >;
};
