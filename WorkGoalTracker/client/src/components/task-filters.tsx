import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task } from "@db/schema";

interface TaskFiltersProps {
  subjectFilter: string;
  onSubjectFilterChange: (value: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

export function TaskFilters({
  subjectFilter,
  onSubjectFilterChange,
  searchQuery,
  onSearchQueryChange,
}: TaskFiltersProps) {
  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"]
  });

  const subjects = Array.from(new Set(tasks?.map(task => task.subject) || []));

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>

      <Select
        value={subjectFilter}
        onValueChange={onSubjectFilterChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">All Subjects</SelectItem>
          {subjects.map((subject) => (
            <SelectItem key={subject} value={subject}>
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}