import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data); // Update product list with fetched data
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Update product in the state after modification
  const updateProduct = (updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  // Delete product from the state
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      alert('Product deleted successfully.');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Something went wrong while deleting the product.');
    }
  };

  // Sell product and update the quantity
  const handleSell = async (id) => {
    const productToSell = products.find(product => product.id === id);
    if (productToSell.quantity > 0) {
      const updatedProduct = { ...productToSell, quantity: productToSell.quantity - 1 };

      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });

        if (!response.ok) throw new Error('Failed to sell product');

        updateProduct(updatedProduct);
        alert('Product sold successfully.');
      } catch (error) {
        console.error('Error selling product:', error);
        alert('Something went wrong while selling the product.');
      }
    } else {
      alert("This product is out of stock!");
    }
  };

  // Add stock to a product
  const handleAddStock = async (id) => {
    const productToUpdate = products.find(product => product.id === id);
    const addedStock = prompt("Enter the quantity to add to stock:", 1);

    if (addedStock && !isNaN(addedStock) && parseInt(addedStock) > 0) {
      const updatedProduct = { ...productToUpdate, quantity: productToUpdate.quantity + parseInt(addedStock) };

      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });

        if (!response.ok) throw new Error('Failed to add stock');

        updateProduct(updatedProduct);
        alert('Stock added successfully.');
      } catch (error) {
        console.error('Error adding stock:', error);
        alert('Something went wrong while adding stock.');
      }
    } else {
      alert("Please enter a valid number.");
    }
  };

  useEffect(() => {
    fetchProducts(); // Initial fetch when the component mounts
  }, []);

  return (
    <div>
      <h2>Product Management</h2>

      {/* Product Form to add new product */}
      <ProductForm fetchProducts={fetchProducts} />

      {/* Display the products in a table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>M{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <button onClick={() => handleSell(product.id)}>Sell</button>
                <button onClick={() => handleAddStock(product.id)}>update</button>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;