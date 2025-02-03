import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskListProps {
  subjectFilter: string;
  searchQuery: string;
}

export function TaskList({ subjectFilter, searchQuery }: TaskListProps) {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"]
  });

  const toggleTask = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("PATCH", `/api/tasks/${taskId}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const filteredTasks = tasks?.filter(task => {
    const matchesSubject = !subjectFilter || subjectFilter === "_all" || task.subject.toLowerCase() === subjectFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {filteredTasks?.map((task) => (
        <Card key={task.id} className="relative">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={() => toggleTask.mutate(task.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex flex-col gap-2">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {task.details}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{task.subject}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Due: {format(new Date(task.dueDate), 'PPP')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={task.importance >= 4 ? "destructive" : task.importance >= 3 ? "secondary" : "outline"}
                >
                  Priority {task.importance}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask.mutate(task.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredTasks?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No tasks found
        </p>
      )}
    </div>
  );
}