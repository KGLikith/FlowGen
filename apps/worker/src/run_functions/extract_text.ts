import * as cheerio from "cheerio";
import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";


export const ExtractTextFromElementExecutor = async (environmentio: PhaseEnvironment, environmentFn: ExecutionEnvironment) => {
    try{
        const elementSelector: string = environmentio.inputs['Selector'] as string;
        
        if(!elementSelector) {
            environmentFn.log.ERROR("No selector defined")
            return false
        }
        
        const html = environmentio.inputs['HTML']

        if(!html) {
            environmentFn.log.ERROR("No HTML provided")
            return false
        }

        const $ = cheerio.load(html);
        const element = $(elementSelector);

        if(!element) {
            environmentFn.log.ERROR("Element not found")
            return false
        }

        const extractedText = $.text(element)

        if(!extractedText) {
            environmentFn.log.ERROR("No text found in the element")
            return false
        }

        environmentFn.log.INFO("Text extracted successfully")
        environmentio.outputs['Extracted Text'] = extractedText
        environmentio.outputs['Website URL'] = environmentio.inputs['Website URL']
        return true;
    }catch(err: any){
        environmentFn.log.ERROR(err.message)
        return false
    }
}