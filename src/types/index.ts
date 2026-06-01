export interface Vaccine {
  id: string;
  name: string;
  name_en: string;
  subtitle: string | null;
  type: "public" | "self-paid";
  done: boolean;
  done_date: string | null;       // "YYYY-MM-DD"
  scheduled_date: string | null;  // "YYYY-MM-DD"
  price: number | null;
  description: string;
  side_effects: string | null;
  notes: string | null;
  display_order: number;
  updated_at: string;             // ISO 8601
  created_at: string;             // ISO 8601
}

export interface Baby {
  id: number;
  name: string;
  birth_date: string;             // "YYYY-MM-DD"
}
