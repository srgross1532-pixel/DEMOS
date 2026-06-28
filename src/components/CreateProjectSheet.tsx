type Props = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
};

export default function CreateProjectSheet({
  open,
  value,
  onChange,
  onClose,
  onCreate,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-3xl bg-[#141821] p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white">
          New Project
        </h2>

        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Project name"
          className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none focus:border-blue-500"
        />

        <div className="mt-8 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 py-4 text-white transition hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={onCreate}
            disabled={!value.trim()}
            className="flex-1 rounded-2xl bg-blue-500 py-4 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}