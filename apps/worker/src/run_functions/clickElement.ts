import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";

export const ClickElementExecutor = async (
  environmentio: PhaseEnvironment,
  environmentFn: ExecutionEnvironment
) => {
  try {
    const selector: string = environmentio.inputs["Selector"] as string;
    if (!selector || selector.trim() === "") {
      environmentFn.log.ERROR("Selector is required");
      return false;
    }

    await environmentFn.getPage()!.click(selector);
    environmentFn.log.INFO(`Element clicked successfully`);
    return true;
  } catch (err: any) {
    environmentFn.log.ERROR(err.message);
    return false;
  }
};
