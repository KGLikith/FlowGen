import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";

export const ReadPropertyFromJSONExecutor = async (
  environmentio: PhaseEnvironment,
  environmentFn: ExecutionEnvironment
) => {
  try {
    const jsonData = environmentio.inputs["JSON"]
    if(!jsonData || jsonData.trim() == ""){
      environmentFn.log.ERROR("No json found.")
      return false;
    }
    const property_name = environmentio.inputs["Property Name"]
    if(!property_name || property_name.trim() == ""){
      environmentFn.log.ERROR("No property name defined")
      return false;
    }

    const json = JSON.parse(jsonData)
    const property_val = json[property_name]

    if(property_val == undefined){
      environmentFn.log.ERROR("Property with the name not found")
      return false;
    }


    environmentio.outputs["Property Value"] =property_val

    environmentFn.log.INFO(`Property Read Successfully`);
    return true;
  } catch (err: any) {
    environmentFn.log.ERROR(err.message);
    return false;
  }
};
