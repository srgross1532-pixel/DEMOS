import { supabase } from "../lib/supabase";

export type Profile = {
  id: string;
  username: string;
  created_at: string;
};

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  if (!user) {
    throw new Error("Not signed in.");
  }

  return user.id;
}

export async function getMyProfile() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  return data as Profile | null;
}

export async function usernameExists(
  username: string
) {
  const { count, error } = await supabase
    .from("profiles")
    .select("*", {
      count: "exact",
      head: true,
    })
    .ilike("username", username);

  if (error) throw error;

  return (count ?? 0) > 0;
}

export async function createProfile(
  username: string
) {
  const userId = await getCurrentUserId();

  const clean = username.trim();

  const exists =
    await usernameExists(clean);

  if (exists) {
    throw new Error(
      "Username already taken."
    );
  }

  const { error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      username: clean,
    });

  if (error) throw error;
}