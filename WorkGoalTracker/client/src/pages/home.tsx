import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";
import { TaskFilters } from "@/components/task-filters";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold text-center mb-2">Work Tracker</h1>
          <div className="text-center text-muted-foreground mb-6">By: Audrey Tan</div>
          
          <TaskForm />
          
          <div className="mt-8">
            <TaskFilters 
              subjectFilter={subjectFilter}
              onSubjectFilterChange={setSubjectFilter}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />
          </div>
          
          <div className="mt-6">
            <TaskList 
              subjectFilter={subjectFilter}
              searchQuery={searchQuery}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
