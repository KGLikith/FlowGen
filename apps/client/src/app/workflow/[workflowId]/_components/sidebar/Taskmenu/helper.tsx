import { TaskGroup } from "@/gql/graphql";


export const groupLabels: Record<TaskGroup, string> = {
    DATA_EXTRACTION: "Data Extraction",
    USER_INTERACTIONS: "User Interactions",
    BROWSER: "Browser",
    INTEGRATIONS: "Integrations",
    TIMING: "Timing",
    DATA_STORAGE: "Data Storage"
}