import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

// API Functions
export const getOrdersApi = async () => {
  const response = await axios.get(
    process.env.NODE_ENV === "development"
      ? `${process.env.LOCAL_BACKEND}/api/orders`
      : `${process.env.PROD_BACKEDN}/api/orders`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const deleteItemOrderApi = async ({ itemId, ordersID }) => {
  const response = await axios.put(
    `http://localhost:5000/api/order/${ordersID}/remove-item`,
    {
      menuItemId: itemId,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Custom Hooks
export const useGetOrders = () => {
  return useQuery({
    queryKey: ["getOrder"],
    queryFn: getOrdersApi,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    staleTime: 0,
    cacheTime: 0,
  });
};

export const useDeleteOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItemOrderApi,
    onSuccess: async () => {
      toast.success("Item deleted successfully!");
      await queryClient.refetchQueries({ queryKey: ["getOrder"] });
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    },
  });
};

// Helper hook for managing order operations
export const useOrderOperations = () => {
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useGetOrders();

  const deleteItemMutation = useDeleteOrderItem();

  const handleDeleteItem = (itemId, ordersID) => {
    deleteItemMutation.mutate({ itemId, ordersID });
  };

  return {
    orders,
    ordersLoading,
    ordersError,
    refetchOrders,
    handleDeleteItem,
    isDeletingItem: deleteItemMutation.isPending,
  };
};
