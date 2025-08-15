import { useQuery } from "@tanstack/react-query";

export function useCompletedOrders() {
  return useQuery({
    queryKey: ["getCompletedOrder"],
    queryFn: async () => {
      const res = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/admin/all-confirm-orders`
          : `${process.env.PROD_BACKEDN}/api/admin/all-confirm-orders`,
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
    staleTime: 0,
    cacheTime: 0,
  });
}
