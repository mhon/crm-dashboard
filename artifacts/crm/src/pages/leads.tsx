import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListLeads,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  getListLeadsQueryKey,
  useGenerateLeadScore,
} from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Mail, Phone, Loader2, Target, BarChart, Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  status: z.string().default("new"),
});

export default function Leads() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: leadsData, isLoading } = useListLeads();
  const leads = Array.isArray(leadsData) ? leadsData : (leadsData as any)?.leads ?? (leadsData as any)?.data ?? [];

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", phone: "", status: "new" },
  });

  const editForm = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", phone: "", status: "new" },
  });

  const generateLeadScore = useGenerateLeadScore();
  const [scoringLeadId, setScoringLeadId] = useState<string | null>(null);

  const handleScoreLead = (lead: any) => {
    setScoringLeadId(lead.id);
    generateLeadScore.mutate(
      { data: { leadData: lead } },
      {
        onSuccess: (data: any) => {
          updateLead.mutate(
            { id: lead.id, data: { name: lead.name, email: lead.email, ai_score: data.score } },
            {
              onSettled: () => {
                setScoringLeadId(null);
                queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
              },
            }
          );
          toast({ title: `AI Score: ${data.score}/100`, description: data.explanation });
        },
        onError: () => {
          setScoringLeadId(null);
          toast({ variant: "destructive", title: "Error", description: "Failed to score lead." });
        },
      }
    );
  };

  const handleDeleteLead = (id: string) => {
    deleteLead.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
          toast({ title: "Lead deleted" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to delete lead." });
        },
      }
    );
  };

  const handleOpenEdit = (lead: any) => {
    setSelectedLead(lead);
    editForm.reset({
      name: lead.name ?? "",
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      status: lead.status ?? "new",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (values: z.infer<typeof leadSchema>) => {
    if (!selectedLead) return;
    updateLead.mutate(
      {
        id: selectedLead.id,
        data: {
          name: values.name,
          email: values.email,
          phone: values.phone ?? undefined,
          status: values.status,
          ai_score: selectedLead.ai_score ?? undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
          setIsEditOpen(false);
          setSelectedLead(null);
          toast({ title: "Lead updated", description: "Changes saved successfully." });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to update lead." });
        },
      }
    );
  };

  function onSubmit(values: z.infer<typeof leadSchema>) {
    createLead.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
          setIsCreateOpen(false);
          form.reset();
          toast({ title: "Lead created", description: "The lead has been added successfully." });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to create lead." });
        },
      }
    );
  }

  const filteredLeads = leads.filter(
    (lead: any) =>
      search === "" ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "contacted": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "qualified": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "lost": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Create Lead Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Lead</DialogTitle>
              <DialogDescription>Create a new prospect. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createLead.isPending}>
                    {createLead.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Lead
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedLead(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>Update the lead's details and status.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateLead.isPending}>
                  {updateLead.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-2/3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredLeads?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <Target className="mx-auto h-12 w-12 opacity-20 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No leads found</h3>
            <p>Try adjusting your search or add a new lead.</p>
          </div>
        ) : (
          filteredLeads?.map((lead: any) => (
            <Card key={lead.id} className="overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg truncate pr-4">{lead.name}</h3>
                    <Badge className={`${getStatusColor(lead.status)} border-0 hover:bg-transparent flex-shrink-0`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{lead.phone}</span>
                      </div>
                    )}
                    {lead.ai_score !== undefined && lead.ai_score !== null && (
                      <div className="flex items-center gap-2 text-primary font-medium mt-2">
                        <BarChart className="h-4 w-4 flex-shrink-0" />
                        <span>AI Score: {lead.ai_score}/100</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 px-6 py-3 text-xs text-muted-foreground border-t flex justify-between items-center gap-2">
                  <span>Added {format(new Date(lead.created_at), "MMM d, yyyy")}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(lead)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-primary hover:text-primary/80"
                      onClick={() => handleScoreLead(lead)}
                      disabled={scoringLeadId === lead.id}
                    >
                      {scoringLeadId === lead.id ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Target className="mr-1 h-3 w-3" />
                      )}
                      AI Score
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:text-destructive/80"
                      onClick={() => handleDeleteLead(lead.id)}
                      disabled={deleteLead.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
