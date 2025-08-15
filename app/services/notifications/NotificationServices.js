import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Helper to resolve backend base; supports NEXT_PUBLIC_* fallbacks for client usage
function resolveBackendBase() {
  const dev =
    process.env.NEXT_PUBLIC_LOCAL_BACKEND || process.env.LOCAL_BACKEND || "";
  const prod =
    process.env.NEXT_PUBLIC_PROD_BACKEND || process.env.PROD_BACKEND || "";
  const base = process.env.NODE_ENV === "development" ? dev : prod;
  return base?.replace(/\/$/, ""); // trim trailing slash
}

export function useGetNotifications({ enabled = false } = {}) {
  return useQuery({
    queryKey: ["getNotifications"],
    enabled, // only run when explicitly enabled
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const base = resolveBackendBase();
      if (!base) {
        // If base URL missing, skip with graceful error
        throw new Error(
          "Backend base URL not configured (set NEXT_PUBLIC_LOCAL_BACKEND / NEXT_PUBLIC_PROD_BACKEND)"
        );
      }
      const res = await fetch(`${base}/api/notifications`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }
      return res.json();
    },
  });
}

export function useMarkAllReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const base = resolveBackendBase();
      const res = await fetch(`${base}/api/notifications/read/all`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to mark all as read");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getNotifications"]);
    },
  });
}

export function useMarkAllHideNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const base = resolveBackendBase();
      const res = await fetch(`${base}/api/notifications/hide/all`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to mark all as read");
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries(["getNotifications"]);
    },
  });
}
