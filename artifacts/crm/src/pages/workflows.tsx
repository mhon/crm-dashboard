import { useState } from "react";
import { useListWorkflows, useCreateWorkflow, getListWorkflowsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Workflow, Plus, Play, Loader2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Workflows() {
  const { data: workflowsData, isLoading } = useListWorkflows();
  const workflows = Array.isArray(workflowsData) ? workflowsData : (workflowsData as any)?.workflows ?? (workflowsData as any)?.data ?? [];
  const createWorkflow = useCreateWorkflow();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("");

  const handleCreate = () => {
    if (!name || !triggerEvent) return;

    createWorkflow.mutate({
      data: {
        name,
        description: "Automated workflow",
        triggerEvent,
        triggerConditions: {},
        actions: [{ type: "send_email" }],
        isActive: true,
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWorkflowsQueryKey() });
        setIsCreateOpen(false);
        setName("");
        setTriggerEvent("");
        toast({ title: "Workflow created", description: "Your automation has been set up." });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to create workflow." });
      }
    });
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
              <DialogDescription>
                Set up a new automation trigger.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="e.g. Welcome Email" value={name} onChange={e => setName(e.target.value)} />
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
              <Button onClick={handleCreate} disabled={createWorkflow.isPending || !name || !triggerEvent}>
                {createWorkflow.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Workflow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="h-3 w-3" />
                      Test Run
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/50 px-6 py-3 text-xs text-muted-foreground border-t">
                  Created {wf.createdAt ? format(new Date(wf.createdAt), 'MMM d, yyyy') : 'Unknown'}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
