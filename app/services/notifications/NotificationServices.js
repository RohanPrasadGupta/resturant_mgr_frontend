import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetNotifications(options = {}) {
  return useQuery({
    queryKey: ["getNotifications"],
    queryFn: async () => {
      const res = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/notifications`
          : `${process.env.PROD_BACKEND}/api/notifications`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 15000,
    cacheTime: 0,
    ...options,
  });
}

export function useMarkAllReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/notifications/read/all`
          : `${process.env.PROD_BACKEND}/api/notifications/read/all`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

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
      const res = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/notifications/hide/all`
          : `${process.env.PROD_BACKEND}/api/notifications/hide/all`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to mark all as read");
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries(["getNotifications"]);
    },
  });
}
