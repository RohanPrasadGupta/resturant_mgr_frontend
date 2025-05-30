import React, { useState } from "react";
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
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import styles from "./ItemCardStyle.module.scss";
import classNames from "classnames";

const ItemCard = ({ data }) => {
  const { name, description, price, category, image, available } = data;
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    // You would integrate with your actual cart system here
    console.log(`Added ${quantity} of ${name} to cart`);
  };

  const handleRemoveFromCart = () => {
    setIsAddedToCart(false);
    setQuantity(1);
    // You would integrate with your actual cart system here
    console.log(`Removed ${name} from cart`);
  };

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

        {isAddedToCart && (
          <Badge
            badgeContent={quantity}
            color="primary"
            className={styles.quantityBadge}
            max={99}
          >
            <Chip
              icon={<ShoppingCartIcon fontSize="small" />}
              label="In Cart"
              size="small"
              className={styles.inCartChip}
            />
          </Badge>
        )}

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
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <TextField
                    value={quantity}
                    onChange={handleQuantityChange}
                    variant="outlined"
                    size="small"
                    type="number"
                    inputProps={{
                      min: 1,
                      style: { textAlign: "center", padding: "2px" },
                    }}
                    className={styles.quantityInput}
                  />

                  <IconButton
                    size="small"
                    onClick={increaseQuantity}
                    className={styles.quantityButton}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Tooltip title="Remove from cart">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={handleRemoveFromCart}
                    className={styles.deleteButton}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Tooltip title="Add to Cart">
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  className={styles.addButton}
                  startIcon={<AddShoppingCartIcon />}
                >
                  Add
                </Button>
              </Tooltip>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default ItemCard;
