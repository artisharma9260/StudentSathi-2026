import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LS_KEY = "ss_saved_schemes";

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

function writeLocal(ids) {
  localStorage.setItem(LS_KEY, JSON.stringify(ids));
}

/**
 * Saved-schemes hook.
 * - If authenticated: syncs with GET/POST/DELETE /passport/saved-schemes
 * - Else: falls back to localStorage so users can still bookmark before signing up.
 */
export function useSavedSchemes() {
  const { isAuthenticated } = useAuth();
  const [ids, setIds] = useState(new Set(readLocal()));
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setIds(new Set(readLocal()));
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get("/passport/saved-schemes");
      const list = data?.data?.schemes ?? data?.data ?? [];
      const setIds2 = new Set(list.map((x) => (typeof x === "string" ? x : x._id)));
      setIds(setIds2);
    } catch {
      // Backend offline — keep localStorage state
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (schemeId, title) => {
      const isSaved = ids.has(schemeId);
      // Optimistic update
      const next = new Set(ids);
      if (isSaved) next.delete(schemeId);
      else next.add(schemeId);
      setIds(next);
      writeLocal(Array.from(next));

      if (!isAuthenticated) {
        toast.success(isSaved ? "Removed from bookmarks" : "Bookmarked locally · Log in to sync");
        return;
      }
      try {
        if (isSaved) {
          await api.delete(`/passport/saved-schemes/${schemeId}`);
          toast.success(`Unsaved${title ? `: ${title}` : ""}`);
        } else {
          await api.post(`/passport/saved-schemes/${schemeId}`);
          toast.success(`Saved${title ? `: ${title}` : ""}`);
        }
      } catch {
        // Revert on failure
        setIds(new Set(ids));
        writeLocal(Array.from(ids));
        toast.error("Could not update bookmark");
      }
    },
    [ids, isAuthenticated]
  );

  return { savedIds: ids, isSaved: (id) => ids.has(id), toggle, loading, refresh };
}
