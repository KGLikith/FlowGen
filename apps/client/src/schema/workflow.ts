import { z} from "zod"

export const createWorkflowSchema = z.object({
    name: z.string().min(1, "Name is required").max(20, "Name must be less than 20 characters"),
    description: z.string().max(50, "Description must be less than 50 characters").optional(),
})

export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>