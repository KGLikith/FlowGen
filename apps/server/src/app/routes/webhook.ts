import express from "express";
import { pubsub } from "../../clients/pubsub";
import { prisma, TaskType } from "@automation/db";
import { workflowExecutionPlan } from "../schema/workflow";
import WorkflowQueriesService from "../services/workflows/queries";
import WorkflowMutationService from "../services/workflows/mutation";

const router = express.Router();

router.post("/:id", express.json(), async (req, res) => {
  try {
    const { id } = req.params;

    const workflow = await prisma.workflow.findMany({
      where: { id , status: 'ACTIVE'},
    })

    if (workflow.length === 0) {
      await pubsub.publish(`WEBHOOK_${id}`,req.body);
      res.status(200).json({ received: true });
    }

    if (workflow.length > 0) {
      const executionPlanStr = workflow[0].executionPlan;
      const executionPlan = executionPlanStr ? JSON.parse(executionPlanStr) as workflowExecutionPlan : null;
      
      const phase = executionPlan?.find((step)=>step.phase === 1);

      if (!phase || !phase.nodes || phase.nodes.length === 0) {
        return res.status(400).json({ error: "There is no execution plan defined." });
      }

      const trigger = phase.nodes[0].data.type === TaskType.WEBHOOK;

      if (trigger) {
        await WorkflowMutationService.runWorkflow({
          workflowId: id,
          executionPlan: workflow[0].executionPlan ?? "",
        })
        return res.status(200).json({ message: "Webhook received and workflow triggered successfully." });
      }else {
        return res.status(400).json({ error: "The workflow does not have a webhook trigger." });
      }
    }
    
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Webhook handler failed. Please try again." });
  }
});

export default router;
