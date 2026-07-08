import { useState } from "react";

import { createProfile } from "../services/profileService";

export default function UsernamePage() {

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!username.trim()) return;

    try {
      setLoading(true);

      await createProfile(
  username.trim().toLowerCase()
);

window.location.replace("/projects");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090D] px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#141821] p-8">

        <h1 className="text-4xl font-black text-white">
          Welcome!
        </h1>

        <p className="mt-3 text-zinc-400">
          Choose a username. Everyone in your
          projects will see this instead of
          your email.
        </p>

        <input
          autoFocus
          value={username}
          maxLength={20}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          placeholder="Username"
          className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-lg text-white outline-none placeholder:text-zinc-500 focus:border-blue-500"
        />

        <button
          disabled={
            loading ||
            username.trim().length < 3
          }
          onClick={handleContinue}
          className="mt-8 w-full rounded-2xl bg-blue-500 py-4 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : "Continue"}
        </button>

      </div>
    </main>
  );
}