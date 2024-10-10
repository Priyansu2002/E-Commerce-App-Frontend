import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;

        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };

        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await axios.put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '80px auto 0', position: 'relative', zIndex: 1 }}>
      <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem', color: '#333' }}>Shopping Bag</h2>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ddd' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '1rem' }} />
                  <div style={{ marginLeft: '1rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.brand}</span>
                    <span style={{ display: 'block', fontSize: '1rem' }}>{item.name}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button type="button" onClick={() => handleIncreaseQuantity(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#007bff' }}>
                    <i className="bi bi-plus-square-fill"></i>
                  </button>
                  <input type="text" value={item.quantity} readOnly style={{ width: '40px', textAlign: 'center', margin: '0 0.5rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                  <button type="button" onClick={() => handleDecreaseQuantity(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#dc3545' }}>
                    <i className="bi bi-dash-square-fill"></i>
                  </button>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>${(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => handleRemoveFromCart(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc3545', fontSize: '1.5rem' }}>
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </li>
            ))}
            <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '1rem', fontSize: '1.5rem' }}>Total: ${totalPrice.toFixed(2)}</div>
            <Button
              style={{ width: "25%", marginTop: '1.5rem', borderRadius: '5px' }}
              onClick={() => setShowModal(true)}
            >
              Checkout
            </Button>
          </>
        )}
      </div>
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
