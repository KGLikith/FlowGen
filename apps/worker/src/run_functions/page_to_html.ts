import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";

export const PageToHtmlExecutor = async (environmentio: PhaseEnvironment, environmentFn: ExecutionEnvironment) => {
    try{
        const html =await environmentFn.getPage()!.content()

        environmentio.outputs['HTML'] = html
        environmentio.outputs['Website URL'] = environmentio.inputs['Website URL']
        
        return true
    }catch(err){
        return false
    }
}