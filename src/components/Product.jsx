import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div style={{ display: "flex", margin: "2rem auto", maxWidth: "1200px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", overflow: "hidden", paddingTop: "60px" }}> {/* Adjust paddingTop for navbar */}
      <img
        src={imageUrl}
        alt={product.imageName}
        style={{ width: "25%", height: "auto", objectFit: "cover", borderRadius: "8px 0 0 8px" }}
      />

      <div style={{ width: "50%", padding: "2rem", backgroundColor: "#ffffff", overflowY: "auto", maxHeight: "80vh" }}> {/* Add overflow for scrolling */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 'lighter', color: "#555" }}>
            {product.category}
          </span>
          <p className="release-date" style={{ marginBottom: "2rem", color: "#777" }}>
            <i>Listed: {new Date(product.releaseDate).toLocaleDateString()}</i>
          </p>
        </div>

        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: 'capitalize', letterSpacing: '1px', color: "#333" }}>
          {product.name}
        </h1>
        <i style={{ marginBottom: "3rem", color: "#777" }}>{product.brand}</i>
        <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '10px 0px 0px' }}>PRODUCT DESCRIPTION :</p>
        <p style={{ marginBottom: "1rem", color: "#555" }}>{product.description}</p>

        <div className="product-price" style={{ marginBottom: "2rem" }}>
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {"$" + product.price}
          </span>
          <button
            className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.productAvailable}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "0.2rem",
            }}
          >
            {product.productAvailable ? "Add to cart" : "Out of Stock"}
          </button>
          <h6 style={{ marginBottom: "1rem", color: "#777" }}>
            Stock Available:{" "}
            <i style={{ color: "green", fontWeight: "bold" }}>
              {product.stockQuantity}
            </i>
          </h6>
        </div>

        <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleEditClick}
            style={{
              padding: "0.5rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "0.2rem",
            }}
          >
            Update
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={deleteProduct}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
