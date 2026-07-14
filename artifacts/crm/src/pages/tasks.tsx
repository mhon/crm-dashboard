import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListTasks,
  useCreateTask,
  getListTasksQueryKey,
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
import { Search, Plus, Calendar, CheckSquare, Loader2, ListTodo } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string().default("pending"),
});

export default function Tasks() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tasksData, isLoading } = useListTasks();
  const tasks = Array.isArray(tasksData) ? tasksData : (tasksData as any)?.tasks ?? (tasksData as any)?.data ?? [];

  const createTask = useCreateTask();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
    },
  });

  function onSubmit(values: z.infer<typeof taskSchema>) {
    createTask.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
          setIsCreateOpen(false);
          form.reset();
          toast({
            title: "Task created",
            description: "The task has been added successfully.",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create task.",
          });
        },
      }
    );
  }

  const filteredTasks = tasks.filter((task: any) => 
    search === "" || task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
              <DialogDescription>
                Create a new task. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Call John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Discuss new features" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createTask.isPending}>
                    {createTask.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Task
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

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
        ) : filteredTasks?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <ListTodo className="mx-auto h-12 w-12 opacity-20 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No tasks found</h3>
            <p>Try adjusting your search or add a new task.</p>
          </div>
        ) : (
          filteredTasks?.map((task: any) => (
            <Card key={task.id} className="overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg cursor-pointer truncate pr-4">
                      {task.title}
                    </h3>
                    <Badge variant={task.status === "completed" ? "default" : "outline"} className="border-primary text-primary hover:bg-primary/10">
                      {task.status}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {task.due_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Due: {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-muted/50 px-6 py-3 text-xs text-muted-foreground border-t flex justify-between items-center">
                  <span>Added {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
