import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";


export const FillInputExecutor = async (environmentio: PhaseEnvironment, environmentFn: ExecutionEnvironment) => {
    try{
        const selector: string = environmentio.inputs['Selector'] as string;
        if(!selector || selector.trim() === ''){
            environmentFn.log.ERROR('Selector is required')
            return false
        }

        const value: string = environmentio.inputs['Value'];

        if(!value || value.trim() === ''){
            environmentFn.log.ERROR('Value is required')
            return false
        }

        await environmentFn.getPage()!.type(selector, value)
        environmentFn.log.INFO(`Element is now filled with value: ${value}`)
        return true;
    }catch(err: any){
        environmentFn.log.ERROR(err.message)
        return false
    }
}