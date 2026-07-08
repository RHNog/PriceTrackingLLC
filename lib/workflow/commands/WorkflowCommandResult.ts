import type { WorkflowCommand } from "@/lib/workflow/commands/WorkflowCommand";
import type { VendorWorkflowSnapshot } from "@/types/VendorWorkflowState";

export type WorkflowCommandResult = {
  accepted: boolean;
  command: WorkflowCommand;
  reason?: string;
  workflow: VendorWorkflowSnapshot;
};
