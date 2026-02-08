import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const filters = [
  { id: "mentor", label: "Mentors Only" },
  { id: "available", label: "Available Now" },
  { id: "tech", label: "Tech Industry" },
  { id: "finance", label: "Finance" },
  { id: "recent", label: "Recent Grads" },
];

interface AlumniSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
}

export function AlumniSearch({ onSearch, onFilterChange }: AlumniSearchProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterToggle = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((f) => f !== filterId)
      : [...activeFilters, filterId];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="glass-card p-6 mb-8">
      {/* Search bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search alumni by name, company, skills..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            className="w-full h-12 pl-12 pr-4 rounded-xl glass-input text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                onSearch("");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        <Button
          variant={showFilters ? "neonViolet" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="h-12"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFilters.length > 0 && (
            <Badge variant="neonCyan" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Quick Filters</span>
            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterToggle(filter.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilters.includes(filter.id)
                    ? "bg-primary/20 text-primary border border-primary/50 shadow-neon-violet"
                    : "bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}