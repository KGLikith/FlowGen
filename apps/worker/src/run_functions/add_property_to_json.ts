import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";

export const AddPropertyToJSONExecutor = async (
  environmentio: PhaseEnvironment,
  environmentFn: ExecutionEnvironment
) => {
  try {
    const jsonData = environmentio.inputs["JSON"];
    if (!jsonData || jsonData.trim() == "") {
      environmentFn.log.ERROR("No json found.");
      return false;
    }
    const property_name = environmentio.inputs["Property Name"];
    if (!property_name || property_name.trim() == "") {
      environmentFn.log.ERROR("No property name defined");
      return false;
    }

    const property_val = environmentio.inputs["Property Value"];
    if (!property_val || property_val.trim() == "") {
      environmentFn.log.ERROR("No property value defined");
      return false;
    }

    const json = JSON.parse(jsonData);

    json[property_name] = property_val;

    if (json == undefined) {
      environmentFn.log.ERROR("Property with the name not found");
      return false;
    }

    environmentio.outputs["JSON"] = JSON.stringify(json);

    environmentFn.log.INFO(`JSON updated Successfully`);
    return true;
  } catch (err: any) {
    environmentFn.log.ERROR(err.message);
    return false;
  }
};
