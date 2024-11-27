import React, { useState } from 'react';
import './ProductList.css';

const ProductForm = ({ fetchProducts }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const validateInputs = () => {
    const isPriceValid = Number(product.price) >= 0;
    const isQuantityValid = Number(product.quantity) >= 0;
    const isFormFilled = Object.values(product).every((field) => field.trim() !== '');

    return isPriceValid && isQuantityValid && isFormFilled;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      alert('All fields are required and Price and Quantity must be non-negative numbers');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          category: product.category,
          price: Number(product.price),  // Ensure this is a number
          quantity: Number(product.quantity) // Ensure this is a number
        }),
      });

      if (!response.ok) throw new Error('Failed to add product');

      const result = await response.json(); // Ensure we get a response back to debug
      console.log('Server response:', result); // Debugging line

      // Clear the form fields
      setProduct({ name: '', description: '', category: '', price: '', quantity: '' });

      // Refresh product list
      fetchProducts();

      alert('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Something went wrong while adding the product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={product.name} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
