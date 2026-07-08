import type {
  ReadinessIssueType,
  ReadinessStatus,
} from "@/lib/validation/ReadinessStatus";

export interface ReadinessIssue {
  component: string;
  message: string;
  type: ReadinessIssueType;
}

export interface ReadinessReport {
  status: ReadinessStatus;
  blockingIssues: ReadinessIssue[];
  warnings: ReadinessIssue[];
  readyComponents: string[];
  missingComponents: string[];
}

export function createReadinessReport(input: Partial<ReadinessReport>): ReadinessReport {
  return {
    status: input.status ?? "READY",
    blockingIssues: input.blockingIssues ?? [],
    warnings: input.warnings ?? [],
    readyComponents: input.readyComponents ?? [],
    missingComponents: input.missingComponents ?? [],
  };
}

