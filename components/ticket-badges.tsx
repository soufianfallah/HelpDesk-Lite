import type { TicketPriority, TicketStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { priorityLabels, statusLabels } from "@/types";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const variant = status === "CLOSED" ? "success" : status === "IN_PROGRESS" ? "warning" : "info";
  return <Badge variant={variant}>{statusLabels[status]}</Badge>;
}
export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const variant = priority === "HIGH" ? "destructive" : priority === "MEDIUM" ? "warning" : "secondary";
  return <Badge variant={variant}>{priorityLabels[priority]}</Badge>;
}
