import puppeteer from "puppeteer"
import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";


export const LaunchBrowserExecutor = async (environmentio: PhaseEnvironment, environmentFn: ExecutionEnvironment) => {
    try{
        const websiteUrl = environmentio.inputs['Website URL']
        const browser = await puppeteer.launch({ headless: true });

        environmentFn.log.INFO("Browser started successfully")
        environmentFn.setBrowser(browser);

        const page = await browser.newPage();
        await page.goto(websiteUrl)

        environmentFn.setPage(page);
        environmentFn.log.INFO(`Opened Page at : ${websiteUrl}`)

        return true
    }catch(err){
        environmentFn.log.ERROR("Failed to launch browser." + (err as Error).message)
        return false
    }
}