"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  apiPath: string;
  label?: string;
  onDeleted?: () => void;
}

export function DeleteBtn({ apiPath, label = "Delete", onDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to ${label.toLowerCase()}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await fetch(apiPath, { method: "DELETE" });
      if (onDeleted) onDeleted();
      else router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-gray-400 hover:text-red-500 p-1 transition-colors disabled:opacity-50"
      title={label}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
