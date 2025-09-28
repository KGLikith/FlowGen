import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";

export const PageToHtmlExecutor = async (environmentio: PhaseEnvironment, environmentFn: ExecutionEnvironment) => {
    try{
        const html =await environmentFn.getPage()!.content()
        environmentFn.log.INFO("Fetched HTML content of the page")
        
        environmentio.outputs['HTML'] = html
        environmentio.outputs['Website URL'] = environmentio.inputs['Website URL']
        
        return true
    }catch(err){
        environmentFn.log.ERROR((err as Error).message)
        return false
    }
}