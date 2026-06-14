import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCustomer,
  useUpdateCustomer,
  useListOrders,
  useListNotes,
  useCreateNote,
  useDeleteNote,
  getGetCustomerQueryKey,
  getListOrdersQueryKey,
  getListNotesQueryKey,
} from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  Calendar,
  Package,
  StickyNote,
  Trash2,
  Loader2,
  Save,
  Clock,
  ShoppingBag,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
});

const noteSchema = z.object({
  text: z.string().min(1, "Note text is required"),
});

type TimelineItem =
  | { type: "order"; id: string; date: Date; product_name: string; amount: number; status: string }
  | { type: "note"; id: string; date: Date; text: string };

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Paid</Badge>;
    case "shipped":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">Shipped</Badge>;
    case "pending":
    default:
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">Pending</Badge>;
  }
}

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: customer, isLoading: loadingCustomer } = useGetCustomer(
    id,
    { query: { queryKey: getGetCustomerQueryKey(id), enabled: !!id } }
  );

  const { data: orders, isLoading: loadingOrders } = useListOrders(
    { customer_id: id },
    { query: { queryKey: getListOrdersQueryKey({ customer_id: id }), enabled: !!id } }
  );

  const { data: notes, isLoading: loadingNotes } = useListNotes(
    { customer_id: id },
    { query: { queryKey: getListNotesQueryKey({ customer_id: id }), enabled: !!id } }
  );

  const updateCustomer = useUpdateCustomer();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    values: customer
      ? { name: customer.name, email: customer.email, phone: customer.phone || "" }
      : { name: "", email: "", phone: "" },
  });

  const noteForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { text: "" },
  });

  const timeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];
    for (const o of orders ?? []) {
      items.push({
        type: "order",
        id: o.id,
        date: new Date(o.created_at),
        product_name: o.product_name,
        amount: o.amount,
        status: o.status,
      });
    }
    for (const n of notes ?? []) {
      items.push({
        type: "note",
        id: n.id,
        date: new Date(n.created_at),
        text: n.text,
      });
    }
    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [orders, notes]);

  function onUpdateCustomer(values: z.infer<typeof customerSchema>) {
    updateCustomer.mutate(
      { id, data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCustomerQueryKey(id) });
          setIsEditing(false);
          toast({ title: "Customer updated" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to update customer" });
        },
      }
    );
  }

  function onAddNote(values: z.infer<typeof noteSchema>) {
    createNote.mutate(
      { data: { customer_id: id, text: values.text } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListNotesQueryKey({ customer_id: id }) });
          noteForm.reset();
          toast({ title: "Note added" });
        },
      }
    );
  }

  const handleDeleteNote = (noteId: string) => {
    deleteNote.mutate(
      { id: noteId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListNotesQueryKey({ customer_id: id }) });
          toast({ title: "Note deleted" });
        },
      }
    );
  };

  if (loadingCustomer) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="space-y-6">
      {/* Customer Info Card */}
      <Card>
        <CardContent className="p-6">
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onUpdateCustomer)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" disabled={updateCustomer.isPending}>
                    {updateCustomer.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">{customer.name}</h2>
                <div className="grid gap-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Added {format(new Date(customer.created_at), "MMMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders + Notes side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Orders */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Orders</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : orders?.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{order.product_name}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">₱{order.amount.toLocaleString()}</span>
                      <div className="w-20 text-right">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-primary" />
              <CardTitle>Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...noteForm}>
              <form onSubmit={noteForm.handleSubmit(onAddNote)} className="space-y-3">
                <FormField
                  control={noteForm.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Add a note about this customer..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="sm" className="w-full" disabled={createNote.isPending}>
                  {createNote.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Add Note
                </Button>
              </form>
            </Form>

            <Separator />

            {loadingNotes ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : notes?.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No notes added.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {notes?.map((note) => (
                  <div key={note.id} className="bg-muted/40 p-3 rounded-lg text-sm relative group">
                    <p className="whitespace-pre-wrap mb-2">{note.text}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{format(new Date(note.created_at), "MMM d, yyyy h:mm a")}</span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={deleteNote.isPending}
                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Activity Timeline</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">All orders and notes in chronological order</p>
        </CardHeader>
        <CardContent>
          {loadingOrders || loadingNotes ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : timeline.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No activity yet. Add an order or note to get started.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-5 bottom-5 w-px bg-border" />

              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={`${item.type}-${item.id}`} className="flex gap-4 relative">
                    {/* Icon bubble */}
                    {item.type === "order" ? (
                      <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-200 dark:border-blue-800">
                        <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    ) : (
                      <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-200 dark:border-amber-800">
                        <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${item.type === "order" ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {item.type === "order" ? "Order" : "Note"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(item.date, "MMM d, yyyy · h:mm a")}
                        </span>
                      </div>

                      {item.type === "order" ? (
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-lg p-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="font-medium text-sm">{item.product_name}</p>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">₱{item.amount.toLocaleString()}</span>
                              {getStatusBadge(item.status)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900 rounded-lg p-3 group">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-sm whitespace-pre-wrap flex-1">{item.text}</p>
                            <button
                              onClick={() => handleDeleteNote(item.id)}
                              disabled={deleteNote.isPending}
                              className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
                              aria-label="Delete note"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
