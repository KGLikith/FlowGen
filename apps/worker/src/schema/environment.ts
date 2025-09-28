import { Browser, Page } from "puppeteer";
import { LogCollector } from "./log";

export type Environment = {
  browser?: Browser;
  page?: Page;
  phases: Record<
    string,
    PhaseEnvironment
  >;
};


export type PhaseEnvironment = {
  inputs: Record<string, string>;
  outputs: Record<string, string>;
}

export type ExecutionEnvironment = {
  getBrowser(): Browser | undefined;
  setBrowser(browser: Browser): void

  getPage(): Page | undefined;
  setPage(page: Page): void;

  log: LogCollector
}