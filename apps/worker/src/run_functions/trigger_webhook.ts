import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";

export const TriggerWebhookExecutor = async (
  environmentio: PhaseEnvironment,
  environmentFn: ExecutionEnvironment
) => {
  try {
    const targetUrl: string = environmentio.inputs["Target URL"] as string;
    if (!targetUrl || targetUrl.trim() === "") {
      environmentFn.log.ERROR("Target URL is required");
      return false;
    }
    const body = environmentio.inputs["Body"] as string | undefined;
    if(!body || body.trim()===""){
      environmentFn.log.ERROR("Body is required");
      return false;
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      environmentFn.log.ERROR(`HTTP error! status: ${response.status}`);
      return false;
    }
    const responseData = await response.json();
    environmentio.outputs["Response"] = JSON.stringify(responseData);
    return true;
  } catch (err: any) {
    environmentFn.log.ERROR(err.message);
    return false;
  }
};
