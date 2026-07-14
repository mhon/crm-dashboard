import { useState } from "react";
import {
  useListWorkflows,
  useCreateWorkflow,
  useRunWorkflow,
  getListWorkflowsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Play, Loader2, Zap, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Workflows() {
  const { data: workflowsData, isLoading } = useListWorkflows();
  const workflows = Array.isArray(workflowsData)
    ? workflowsData
    : (workflowsData as any)?.workflows ?? (workflowsData as any)?.data ?? [];
  const createWorkflow = useCreateWorkflow();
  const runWorkflow = useRunWorkflow();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("");
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<{ wfName: string; logs: any } | null>(null);

  const handleCreate = () => {
    if (!name || !triggerEvent) return;

    createWorkflow.mutate(
      {
        data: {
          name,
          description: "Automated workflow",
          triggerEvent,
          triggerConditions: {},
          actions: [{ type: "send_email" }],
          isActive: true,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListWorkflowsQueryKey() });
          setIsCreateOpen(false);
          setName("");
          setTriggerEvent("");
          toast({ title: "Workflow created", description: "Your automation has been set up." });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to create workflow." });
        },
      }
    );
  };

  const handleTestRun = (wf: any) => {
    setRunningId(wf.id);
    runWorkflow.mutate(
      { id: wf.id },
      {
        onSuccess: (data: any) => {
          setRunningId(null);
          setRunResult({ wfName: wf.name, logs: data.logs });
          toast({ title: "Test run complete", description: `Workflow "${wf.name}" ran successfully.` });
        },
        onError: () => {
          setRunningId(null);
          toast({ variant: "destructive", title: "Test run failed", description: "Could not run the workflow." });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-muted-foreground mt-1">Manage triggered workflows and AI actions</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Workflow</DialogTitle>
              <DialogDescription>Set up a new automation trigger.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="e.g. Welcome Email" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Trigger Event</label>
                <Select value={triggerEvent} onValueChange={setTriggerEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead_created">Lead Created</SelectItem>
                    <SelectItem value="lead_status_changed">Lead Status Changed</SelectItem>
                    <SelectItem value="order_paid">Order Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Action</label>
                <Input disabled value="Send Email (Default)" />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreate}
                disabled={createWorkflow.isPending || !name || !triggerEvent}
              >
                {createWorkflow.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Workflow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Run result dialog */}
      <Dialog open={!!runResult} onOpenChange={() => setRunResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Test Run: {runResult?.wfName}
            </DialogTitle>
            <DialogDescription>The workflow completed successfully.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {runResult?.logs?.steps?.map((step: any, i: number) => (
              <div key={i} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-muted/50">
                {step.status === "ok" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className="font-medium capitalize">{step.step.replace(/_/g, " ")}</span>
                  <p className="text-muted-foreground">{step.message}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setRunResult(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : workflows?.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/10 border-dashed">
            <Zap className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-medium">No workflows yet</h3>
            <p className="text-muted-foreground mt-1">Create your first automation to save time.</p>
          </div>
        ) : (
          workflows?.map((wf: any) => (
            <Card key={wf.id} className="overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{wf.name}</h3>
                      <Badge variant={wf.isActive ? "default" : "secondary"}>
                        {wf.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Zap className="h-3 w-3" />
                      Triggers on: <strong className="font-medium">{wf.triggerEvent}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={runningId === wf.id}
                      onClick={() => handleTestRun(wf)}
                    >
                      {runningId === wf.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                      {runningId === wf.id ? "Running..." : "Test Run"}
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/50 px-6 py-3 text-xs text-muted-foreground border-t">
                  Created {wf.createdAt ? format(new Date(wf.createdAt), "MMM d, yyyy") : "Unknown"}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
