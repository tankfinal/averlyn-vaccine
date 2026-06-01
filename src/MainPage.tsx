import { useState } from "react";
import { Header } from "./components/Header";
import { StatsBar } from "./components/StatsBar";
import { FilterBar } from "./components/FilterBar";
import { Timeline } from "./components/Timeline";
import { Footer } from "./components/Footer";
import { vaccines } from "./data/vaccines";
import type { FilterType } from "./utils/vaccine";

export function MainPage() {
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");

  return (
    <div className="container">
      <Header />
      <StatsBar vaccines={vaccines} />
      <FilterBar
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />
      <Timeline vaccines={vaccines} currentFilter={currentFilter} />
      <Footer />
    </div>
  );
}
