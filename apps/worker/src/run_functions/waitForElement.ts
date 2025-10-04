import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";


export const WaitForElementExecutor = async (environmentio: PhaseEnvironment, environmentFn: ExecutionEnvironment) => {
    try{
        const selector: string = environmentio.inputs['Selector'] as string;
        if(!selector || selector.trim() === ''){
            environmentFn.log.ERROR('Selector is required')
            return false
        }

        const visibility: string = environmentio.inputs['Visibility'];

        if(!visibility || visibility.trim() === ''){
            environmentFn.log.ERROR('Visibility is required')
            return false
        }
        
        await environmentFn.getPage()!.waitForSelector(selector, { visible: visibility === 'visible', hidden: visibility === 'hidden' })
        environmentFn.log.INFO(`Element is now ${visibility}`)
        return true;
    }catch(err: any){
        environmentFn.log.ERROR(err.message)
        return false
    }
}