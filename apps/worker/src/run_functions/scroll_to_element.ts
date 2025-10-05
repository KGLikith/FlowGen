import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";

export const ScrollToElementExecutor = async (
  environmentio: PhaseEnvironment,
  environmentFn: ExecutionEnvironment
) => {
  try {
    const selector: string = environmentio.inputs["Selector"] as string;
    if (!selector || selector.trim() === "") {
      environmentFn.log.ERROR("Selector is required");
      return false;
    }

    environmentFn.getPage()!.evaluate((selector) => {
      const ele = document.querySelector(selector);
      if (!ele) {
        throw new Error("Element not found.");
      }
      const top = ele.getBoundingClientRect().top - window.scrollY;
      window.scrollTo({ top });
    }, selector);
    environmentFn.log.INFO(`Scrolled to element successfully`);
    return true;
  } catch (err: any) {
    environmentFn.log.ERROR(err.message);
    return false;
  }
};
