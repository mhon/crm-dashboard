import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
  getListCompaniesQueryKey,
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
import { Search, Plus, Building2, Globe, Briefcase, Loader2, Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  domain: z.string().optional(),
  industry: z.string().optional(),
});

export default function Companies() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: companiesData, isLoading } = useListCompanies();
  const companies = Array.isArray(companiesData)
    ? companiesData
    : (companiesData as any)?.companies ?? (companiesData as any)?.data ?? [];

  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", domain: "", industry: "" },
  });

  const editForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", domain: "", industry: "" },
  });

  const handleDeleteCompany = (id: string) => {
    deleteCompany.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
          toast({ title: "Company deleted" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to delete company." });
        },
      }
    );
  };

  const handleOpenEdit = (company: any) => {
    setSelectedCompany(company);
    editForm.reset({
      name: company.name ?? "",
      domain: company.domain ?? "",
      industry: company.industry ?? "",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (values: z.infer<typeof companySchema>) => {
    if (!selectedCompany) return;
    updateCompany.mutate(
      {
        id: selectedCompany.id,
        data: {
          name: values.name,
          domain: values.domain || undefined,
          industry: values.industry || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
          setIsEditOpen(false);
          setSelectedCompany(null);
          toast({ title: "Company updated", description: "Changes saved successfully." });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to update company." });
        },
      }
    );
  };

  function onSubmit(values: z.infer<typeof companySchema>) {
    createCompany.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
          setIsCreateOpen(false);
          form.reset();
          toast({ title: "Company created", description: "The company has been added successfully." });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to create company." });
        },
      }
    );
  }

  const filteredCompanies = companies.filter(
    (company: any) =>
      search === "" || company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Create Company Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Company</DialogTitle>
              <DialogDescription>Create a new company record. Click save when you're done.</DialogDescription>
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
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Input placeholder="acme.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createCompany.isPending}>
                    {createCompany.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Company
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Company Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setSelectedCompany(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the company's details.</DialogDescription>
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
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="acme.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateCompany.isPending}>
                  {updateCompany.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(6)
            .fill(0)
            .map((_, i) => (
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
        ) : filteredCompanies?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <Building2 className="mx-auto h-12 w-12 opacity-20 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No companies found</h3>
            <p>Try adjusting your search or add a new company.</p>
          </div>
        ) : (
          filteredCompanies?.map((company: any) => (
            <Card key={company.id} className="overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg truncate pr-4">{company.name}</h3>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {company.domain && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{company.domain}</span>
                      </div>
                    )}
                    {company.industry && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{company.industry}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 px-6 py-3 text-xs text-muted-foreground border-t flex justify-between items-center">
                  <span>Added {format(new Date(company.created_at), "MMM d, yyyy")}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(company)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive/80"
                      onClick={() => handleDeleteCompany(company.id)}
                      disabled={deleteCompany.isPending}
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
