import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post("http://localhost:8080/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product added successfully:", response.data);
        alert("Product added successfully");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Error adding product");
      });
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f9",
        animation: "fadeIn 1s ease-in",
        padding: "20px",
      }}
    >
      <div
        className="center-container"
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          width: "100%",
          transition: "transform 0.3s ease",
        }}
      >
        <form onSubmit={submitHandler} style={{ width: "100%" }}>
          <h2 style={{ textAlign: "center", color: "#333" }}>Add Product</h2>
          <div className="row g-3" style={{ marginTop: "20px" }}>
            <div className="col-md-6">
              <label className="form-label" style={{ fontWeight: "bold" }}>
                Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Product Name"
                onChange={handleInputChange}
                value={product.name}
                name="name"
                style={{
                  transition: "box-shadow 0.3s ease",
                }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" style={{ fontWeight: "bold" }}>
                Brand
              </label>
              <input
                type="text"
                name="brand"
                className="form-control"
                placeholder="Enter your Brand"
                value={product.brand}
                onChange={handleInputChange}
                style={{
                  transition: "box-shadow 0.3s ease",
                }}
              />
            </div>

            <div className="col-12">
              <label className="form-label" style={{ fontWeight: "bold" }}>
                Description
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Add product description"
                value={product.description}
                name="description"
                onChange={handleInputChange}
                style={{
                  transition: "box-shadow 0.3s ease",
                }}
              />
            </div>

            <div className="col-6">
              <label className="form-label" style={{ fontWeight: "bold" }}>
                Price
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Eg: $1000"
                onChange={handleInputChange}
                value={product.price}
                name="price"
                style={{
                  transition: "box-shadow 0.3s ease",
                }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" style={{ fontWeight: "bold" }}>
                Category
              </label>
              <select
                className="form-select"
                value={product.category}
                onChange={handleInputChange}
                name="category"
                style={{
                  transition: "box-shadow 0.3s ease",
                }}
              >
                <option value="">Select category</option>
                <option value="Laptop">Laptop</option>
                <option value="Headphone">Headphone</option>
                <option value="Mobile">Mobile</option>
                <option value="Electronics">Electronics</option>
                <option value="Toys">Toys</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>

            <div className="col-6">
              <label className="form-label" style={{ fontWeight: "bold" }}>
                Stock Quantity
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Stock Remaining"
                onChange={handleInputChange}
                value={product.stockQuantity}
                name="stockQuantity"
                style={{
                  transition: "box-shadow 0.3s ease",
                }}
              />
            </div>

            <div className="col-6">
              <label className="form-label" style={{ fontWeight: "bold" }}>
                Release Date
              </label>
              <input
                type="date"
                className="form-control"
                value={product.releaseDate}
                name="releaseDate"
                onChange={handleInputChange}
                style={{
                  transition: "box-shadow 0.3s ease",
                }}
              />
            </div>

            <div className="col-12">
              <label className="form-label" style={{ fontWeight: "bold" }}>
                Image
              </label>
              <input
                className="form-control"
                type="file"
                onChange={handleImageChange}
                style={{
                  transition: "box-shadow 0.3s ease",
                }}
              />
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="productAvailable"
                  id="gridCheck"
                  checked={product.productAvailable}
                  onChange={(e) =>
                    setProduct({ ...product, productAvailable: e.target.checked })
                  }
                  style={{ marginRight: "10px" }}
                />
                <label className="form-check-label">
                  Product Available
                </label>
              </div>
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  backgroundColor: "#007bff",
                  borderColor: "#007bff",
                  width: "35%",
                  padding: "10px 0",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#0056b3";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#007bff";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
