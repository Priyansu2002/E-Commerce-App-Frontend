import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [notification, setNotification] = useState(""); // State for popup notification

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification("Product added to cart!"); // Show notification
    setTimeout(() => setNotification(""), 3000); // Hide notification after 3 seconds
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: "100px", height: "100px" }} />
      </h2>
    );
  }

  return (
    <>
      {/* Popup Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "opacity 0.5s ease",
            zIndex: 1000,
          }}
        >
          {notification}
          <button
            onClick={() => setNotification("")}
            style={{
              background: "none",
              border: "none",
              color: "white",
              marginLeft: "15px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            &times;
          </button>
        </div>
      )}

      <div
        className="grid"
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          padding: "40px",
          transition: "transform 0.3s ease",
        }}
      >
        {filteredProducts.length === 0 ? (
          <h2 style={{ textAlign: "center", flexGrow: 1 }}>No Products Available</h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } = product;

            return (
              <div
                className="card mb-3"
                style={{
                  width: "260px",
                  height: "380px",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: productAvailable ? "#fff" : "#ccc",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "stretch",
                  transition: "transform 0.2s ease-in-out",
                  cursor: "pointer",
                }}
                key={id}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img
                    src={imageUrl}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      padding: "5px",
                      margin: "0",
                      borderRadius: "12px 12px 0 0",
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  />
                  <div
                    className="card-body"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <div>
                      <h5 style={{ margin: "0 0 10px 0", fontSize: "1.3rem" }}>
                        {name.toUpperCase()}
                      </h5>
                      <i style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                        {"~ " + brand}
                      </i>
                    </div>
                    <hr style={{ margin: "10px 0" }} />
                    <div className="home-cart-price">
                      <h5
                        style={{
                          fontWeight: "600",
                          fontSize: "1.2rem",
                          marginBottom: "5px",
                        }}
                      >
                        <i className="bi bi-currency-rupee"></i>
                        {price}
                      </h5>
                    </div>
                    <button
                      style={{
                        margin: "10px 25px 0px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "10px",
                        border: "none",
                        borderRadius: "5px",
                        transition: "background-color 0.3s ease",
                        cursor: productAvailable ? "pointer" : "not-allowed",
                      }}
                      onMouseEnter={(e) => {
                        if (productAvailable) e.currentTarget.style.backgroundColor = "#45a049";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#4CAF50";
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      disabled={!productAvailable}
                    >
                      {productAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;
