import { supabase } from "../lib/supabase";

export type Project = {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
};

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Project[];
}

export async function createProject(name: string) {
  const invite = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      invite_code: invite,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Project;
}