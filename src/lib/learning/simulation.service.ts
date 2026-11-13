import { supabase } from "@/integrations/supabase/client";

type SimulationQueryResult = { data: unknown; error: { message: string } | null };
type SimulationQuery = PromiseLike<SimulationQueryResult> & {
  select(columns: string): SimulationQuery;
  eq(column: string, value: unknown): SimulationQuery;
  insert(values: Record<string, unknown>): SimulationQuery;
  order(column: string, options?: { ascending?: boolean }): SimulationQuery;
  single(): Promise<SimulationQueryResult>;
};
const db = supabase as unknown as { from(table: string): SimulationQuery };

export type PublishedSimulation = {
  id: string;
  exam_slug: string;
  title: string;
  description: string | null;
  audience: string;
  duration_minutes: number | null;
};

export async function getPublishedSimulations(examSlug = "ebserh-hubrasil"): Promise<PublishedSimulation[]> {
  const { data, error } = await db.from("exam_simulations").select("id,exam_slug,title,description,audience,duration_minutes")
    .eq("exam_slug", examSlug).eq("published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PublishedSimulation[];
}

export async function startSimulationAttempt(simulationId: string) {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!auth.user) throw new Error("Entre na sua conta para iniciar um simulado.");
  const { data, error } = await db.from("exam_simulation_attempts").insert({
    simulation_id: simulationId,
    user_id: auth.user.id,
  }).select("*").single();
  if (error) throw error;
  return data;
}
