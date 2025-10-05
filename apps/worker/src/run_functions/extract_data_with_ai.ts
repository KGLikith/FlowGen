import { prisma } from "@automation/db";
import { ExecutionEnvironment, PhaseEnvironment } from "../schema/environment";
import { decrypt } from "../actions/decypt";
import OpenAI from "openai";

export const ExtractDataWithAIExecutor = async (
  environmentio: PhaseEnvironment,
  environmentFn: ExecutionEnvironment
) => {
  try {
    const credentialId: string = environmentio.inputs["Credential"] as string;
    if (!credentialId || credentialId.trim() === "") {
      environmentFn.log.ERROR("Credential is required");
      return false;
    }

    const prompt: string = environmentio.inputs["Prompt"] as string;
    if (!prompt || prompt.trim() === "") {
      environmentFn.log.ERROR("Prompt is required");
      return false;
    }

    const content = await environmentio.inputs["Content"];
    if (!content || content.trim() === "") {
      environmentFn.log.ERROR("Content is required");
      return false;
    }

    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });

    if (!credential) {
      environmentFn.log.ERROR("Credential not found");
      return false;
    }
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      environmentFn.log.ERROR(
        "Encryption key not set in environment variables."
      );
      return false;
    }
    const decrypted = await decrypt(credential.value, key);
    if (!decrypted) {
      environmentFn.log.ERROR("Failed to decrypt credential");
      return false;
    }

    const apiKey = decrypted;

    const mockExractedData = {
      userNameSelector: "#username",
      passwordSelector: "#password",
      loginSelector:
        "body > div > form > input.btn.btn-primary",
    };

    // const openai = new OpenAI({
    //   apiKey: apiKey,
    // });

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are a world class expert in data extraction from HTML or text. You will be given a prompt and content from which you need to extract data as per the prompt. You will provide the response in JSON format(array or object) with key as the field to be extracted and value as the selector or value of the field without any additional words or explanation. If you are unable to find the selector or value, you will return "Not found" as the value. You will not provide any explanation or additional text. You will only provide the valid JSON array without any surrounding text.`,
    //     },
    //     {
    //       role: "user",
    //       content: `Prompt: ${prompt}\n\nContent: ${content}\n\nResponse:`,
    //     }
    //   ],
    //   temperature: 1,
    // });

    // environmentFn.log.INFO(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    // environmentFn.log.INFO(`Completion tokens: ${response.usage?.completion_tokens}`);
    // environmentFn.log.INFO(`Total tokens: ${response.usage?.total_tokens}`);

    // const result = response.choices[0].message?.content;
    // if(!result){
    //   environmentFn.log.ERROR("No response from AI");
    //   return false;
    // }

    environmentio.outputs["Extracted Data"] = JSON.stringify(mockExractedData);

    environmentFn.log.INFO(`Data Extracted Successfully`);
    return true;
  } catch (err: any) {
    environmentFn.log.ERROR(err.message);
    return false;
  }
};
