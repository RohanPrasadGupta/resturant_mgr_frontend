import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
  Fade,
  IconButton,
  TextField,
  Tooltip,
  Badge,
  CircularProgress,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import styles from "./ItemCardStyle.module.scss";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ItemCard = ({ data }) => {
  const { name, description, price, category, image, available } = data;
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const userData = useSelector((state) => state.selectedUser.value);
  const [localStorageData, setLocalStorageData] = useState(null);
  const [username, setUsername] = useState("");
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedData =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("mgrUserData") || "null")
        : null;
    setLocalStorageData(storedData);
  }, []);

  const tableNumber =
    userData?.tableNumber && userData?.tableNumber !== ""
      ? userData.tableNumber
      : localStorageData?.tableNumber;

  useEffect(() => {
    if (userData?.username && userData?.username !== "") {
      setUsername(userData.username);
    } else if (
      localStorageData?.username &&
      localStorageData?.username !== ""
    ) {
      setUsername(localStorageData.username);
    } else {
      setUsername("staff");
    }
  }, [userData, localStorageData]);

  const {
    isLoading: isTableDataLoading,
    data: tableInfo,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fetchTableData", tableNumber],
    queryFn: () =>
      fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/table/${tableNumber}`
          : `${process.env.PROD_BACKEDN}/api/table/${tableNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch table data");
        }
        return res.json();
      }),
    enabled: !!tableNumber,
    refetchOnWindowFocus: true,
  });

  const { mutate: handleAddOrder, isPending } = useMutation({
    mutationFn: async ({
      tableNumber,
      tableId,
      menuItemId,
      quantity,
      orderBy,
    }) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/order`
          : `${process.env.PROD_BACKEDN}/api/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            tableNumber,
            tableId,
            items: [
              {
                menuItem: menuItemId,
                quantity,
              },
            ],
            orderBy,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add order");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setIsAddedToCart(true);
      queryClient.invalidateQueries({ queryKey: ["fetchTableData"] });
    },
    onError: () => {
      toast.error("Error adding item.");
    },
  });

  const { mutate: handleUpdateQty, isPending: isUpdatingQty } = useMutation({
    mutationFn: async ({ menuItemId, updatedQuantity }) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/order/${tableInfo?.currentOrder?._id}/update-quantity`
          : `${process.env.PROD_BACKEDN}/api/order/${tableInfo?.currentOrder?._id}/update-quantity`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            menuItemId: menuItemId,
            quantity: updatedQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update item quantity.");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fetchTableData"] });
    },
    onError: () => {
      toast.error("Error updating item.");
    },
  });

  useEffect(() => {
    if (tableNumber) {
      refetch();
    }
  }, [tableNumber, refetch]);

  useEffect(() => {
    if (tableInfo?.currentOrder?.items) {
      const itemInCart = tableInfo.currentOrder.items.find(
        (item) => item?.menuItem?._id === data?._id
      );
      if (itemInCart) {
        setQuantity(itemInCart?.quantity);
        setIsAddedToCart(true);
      } else {
        setIsAddedToCart(false);
        setQuantity(1);
      }
    }
  }, [tableInfo, data]);

  const increaseQuantity = () => {
    const updatedQuantity = quantity + 1;
    setQuantity(updatedQuantity);

    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    const timeout = setTimeout(() => {
      refetch().then(() => {
        const updatedItemID = tableInfo?.currentOrder?.items.find(
          (item) => item?.menuItem?._id === data?._id
        );
        if (updatedItemID) {
          handleUpdateQty({
            menuItemId: updatedItemID?.menuItem?._id,
            updatedQuantity,
          });
        } else {
          toast.error("Item not found in the cart. Please try again.");
          queryClient.invalidateQueries({ queryKey: ["fetchTableData"] });
        }
      });
    }, 2000);

    setUpdateTimeout(timeout);
  };

  const decreaseQuantity = () => {
    const updatedQuantity = quantity > 1 ? quantity - 1 : 1;
    setQuantity(updatedQuantity);

    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    const timeout = setTimeout(() => {
      refetch().then(() => {
        const updatedItemID = tableInfo?.currentOrder?.items.find(
          (item) => item?.menuItem?._id === data?._id
        );
        if (updatedItemID) {
          handleUpdateQty({
            menuItemId: updatedItemID?.menuItem?._id,
            updatedQuantity,
          });
        } else {
          toast.error("Item not found in the cart. Please try again.");
          queryClient.invalidateQueries({ queryKey: ["fetchTableData"] });
        }
      });
    }, 2000);

    setUpdateTimeout(timeout);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);

      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }

      const timeout = setTimeout(() => {
        refetch().then(() => {
          const updatedItemID = tableInfo?.currentOrder?.items.find(
            (item) => item?.menuItem?._id === data?._id
          );
          if (updatedItemID) {
            handleUpdateQty({
              menuItemId: updatedItemID?.menuItem?._id,
              updatedQuantity: value,
            });
          } else {
            toast.error("Item not found in the cart. Please try again.");
            queryClient.invalidateQueries({ queryKey: ["fetchTableData"] });
          }
        });
      }, 2000);

      setUpdateTimeout(timeout);
    }
  };

  const handleAddToCart = () => {
    if (!tableNumber || !tableInfo?._id || !data?._id || !username) {
      toast.error("unable to add item to cart.");
      return;
    }

    handleAddOrder({
      tableNumber,
      tableId: tableInfo._id,
      menuItemId: data._id,
      quantity,
      orderBy: username,
    });
  };

  const handleRemoveFromCart = () => {
    setIsAddedToCart(false);
    setQuantity(0);
    deleteFunc();
  };

  const { mutate: deleteFunc, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const updatedItemID = tableInfo?.currentOrder?.items.find(
        (item) => item?.menuItem?._id === data?._id
      );

      if (!updatedItemID) {
        throw new Error("Item not found in the current order.");
      }

      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/order/${tableInfo?.currentOrder?._id}/remove-item`
          : `${process.env.PROD_BACKEDN}/api/order/${tableInfo?.currentOrder?._id}/remove-item`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            menuItemId: updatedItemID?.menuItem?._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete item from the order.");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Item removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["fetchTableData"] });
    },
    onError: (error) => {
      console.error("Error deleting item:", error.message);
      toast.error("Error removing item from the cart.");
    },
  });

  return (
    <Card
      className={classNames(styles.styledCard, {
        [styles.disabled]: !available,
        [styles.addedToCart]: isAddedToCart,
      })}
      elevation={3}
    >
      <Box className={styles.cardMediaContainer}>
        <Chip
          label={category}
          size="small"
          className={classNames(styles.categoryChip, {
            [styles.vegetarian]: category === "vegetarian",
            [styles.nonVegetarian]: category !== "vegetarian",
          })}
        />

        <CardMedia
          component="img"
          image={image}
          alt={name}
          className={classNames(styles.cardMedia, {
            [styles.mediaDisabled]: !available,
          })}
        />

        {!available && (
          <Fade in={!available}>
            <Box className={styles.unavailableOverlay}>
              <Typography variant="h6" fontWeight="bold">
                Unavailable
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>

      <CardContent className={styles.cardContent}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          className={styles.title}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.description}
        >
          {description}
        </Typography>
      </CardContent>

      <CardActions className={styles.cardActions}>
        <Typography variant="h6" className={styles.priceTypography}>
          ₹{price}
        </Typography>

        {available && (
          <>
            {isAddedToCart ? (
              <Box className={styles.cartControls}>
                <Box className={styles.quantityControls}>
                  <IconButton
                    size="small"
                    onClick={decreaseQuantity}
                    className={styles.quantityButton}
                    disabled={isUpdatingQty || quantity <= 1}
                  >
                    {isUpdatingQty ? (
                      <CircularProgress size={16} />
                    ) : (
                      <RemoveIcon fontSize="small" />
                    )}
                  </IconButton>

                  <TextField
                    value={quantity}
                    onChange={handleQuantityChange}
                    variant="outlined"
                    size="small"
                    type="number"
                    inputProps={{
                      min: 1,
                      style: { textAlign: "center", padding: "1px" },
                    }}
                    className={styles.quantityInput}
                  />

                  <IconButton
                    size="small"
                    onClick={increaseQuantity}
                    className={styles.quantityButton}
                    disabled={isUpdatingQty}
                  >
                    {isUpdatingQty ? (
                      <CircularProgress size={16} />
                    ) : (
                      <AddIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>

                <IconButton
                  color="error"
                  size="small"
                  onClick={handleRemoveFromCart}
                  className={styles.deleteButton}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={handleAddToCart}
                className={styles.addButton}
                startIcon={<AddShoppingCartIcon />}
              >
                Add
              </Button>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default ItemCard;
