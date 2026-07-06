import { supabase } from "../lib/supabase";

export type Project = {
  id: string;
  name: string;
  invite_code: string;
  cover_path: string | null;
  created_at: string;

  songs?: {
    count: number;
  }[];

  project_members?: {
    count: number;
  }[];
};

function makeInviteCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  if (!user) {
    throw new Error("You need to sign in first.");
  }

  return user.id;
}

export async function getProjects() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("project_members")
    .select(`
      project:projects!inner(
        *,
        songs(count)
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? [])
    .map((row) => row.project as unknown as Project)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
}

export async function createProject(name: string) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      invite_code: makeInviteCode(),
    })
    .select()
    .single();

  if (error) throw error;

  const { error: memberError } = await supabase
    .from("project_members")
    .insert({
      project_id: data.id,
      user_id: userId,
      role: "owner",
    });

  if (memberError) throw memberError;

  return data as Project;
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Project;
}

export async function uploadProjectCover(
  projectId: string,
  file: File
) {
  const extension = file.name.split(".").pop();
  const path = `${projectId}/cover.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("project-covers")
    .upload(path, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { error } = await supabase
    .from("projects")
    .update({
      cover_path: path,
    })
    .eq("id", projectId);

  if (error) throw error;
}

export function getProjectCoverUrl(
  coverPath: string
) {
  const { data } = supabase.storage
    .from("project-covers")
    .getPublicUrl(coverPath);

  return data.publicUrl;
}

export async function deleteProject(
  project: Project
) {
  if (project.cover_path) {
    await supabase.storage
      .from("project-covers")
      .remove([project.cover_path]);
  }

  const { data: songs } = await supabase
    .from("songs")
    .select("audio_path")
    .eq("project_id", project.id);

  if (songs?.length) {
    const paths = songs
      .map((song) => song.audio_path)
      .filter(Boolean);

    if (paths.length) {
      await supabase.storage
        .from("songs")
        .remove(paths as string[]);
    }
  }

  await supabase
    .from("songs")
    .delete()
    .eq("project_id", project.id);

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", project.id);

  if (error) throw error;
}

export async function renameProject(
  projectId: string,
  name: string
) {
  const { error } = await supabase
    .from("projects")
    .update({
      name,
    })
    .eq("id", projectId);

  if (error) throw error;
}

export async function generateProjectInviteCode(
  projectId: string
) {
  const code = makeInviteCode();

  const { data, error } = await supabase
    .from("projects")
    .update({
      invite_code: code,
    })
    .eq("id", projectId)
    .select("invite_code")
    .single();

  if (error) throw error;

  return data.invite_code as string;
}

export async function joinProjectByInviteCode(
  code: string
) {
  const normalized = code
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();

  if (!normalized) {
    throw new Error("Enter an invite code.");
  }

  const { data, error } = await supabase.rpc(
    "join_project_with_invite",
    {
      join_code: normalized,
    }
  );

  if (error) throw error;

  if (!data) {
    throw new Error("Invite code not found.");
  }

  return getProject(data as string);
}
