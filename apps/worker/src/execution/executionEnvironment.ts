import { Environment } from "../schema/environment";

const registry: Record<string, Environment> = {};

export function getEnvironment(executionId: string): Environment {
  if (!registry[executionId]) {
    registry[executionId] = { phases: {} };
  }
  return registry[executionId];
}

export async function cleanupEnvironment(executionId: string) {
  const env = registry[executionId];
  if (env?.browser) {
    await env.browser.close().catch(() => {});
  }
  delete registry[executionId];
}
