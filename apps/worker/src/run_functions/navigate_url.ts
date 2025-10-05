import puppeteer from "puppeteer";
import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";

export const NavigateURLExecutor = async (
  environmentio: PhaseEnvironment,
  environmentFn: ExecutionEnvironment
) => {
  try {
    const websiteUrl = environmentio.inputs["Website URL"];

    if (!websiteUrl) {
      environmentFn.log.ERROR("Website URL is not defined.");
      return false;
    }

    await environmentFn.getPage()!.goto(websiteUrl);
    environmentFn.log.INFO(`Visited ${websiteUrl}`);

    return true;
  } catch (err) {
    environmentFn.log.ERROR(
      "Failed to launch browser." + (err as Error).message
    );
    return false;
  }
};
