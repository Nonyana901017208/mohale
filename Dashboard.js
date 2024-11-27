import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Slider from 'react-slick';  // Import the Slider component from react-slick
import './dashboard.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products'); // Adjust URL if needed
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate total stock of products
  const totalStock = products.reduce((acc, product) => acc + parseInt(product.quantity || 0, 10), 0);

  // Prepare data for the bar graph
  const chartData = {
    labels: products.map(product => product.name),  // Product names as labels
    datasets: [
      {
        label: 'Quantity in Stock',
        data: products.map(product => product.quantity),  // Product quantities
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for the bar graph
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Handle updating a product
  const handleUpdate = async (id, name, quantity) => {
    try {
      await axios.put(`http://localhost:5001/api/products/${id}`, { name, quantity });
      await fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product');
    }
  };

  // Handle deleting a product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Images for the rotating carousel (fixed images)
  const images = [
    "Niksnaks.jpg",
    "Cola.jpg",
    "Peanuts.jpg",
    "Maluti.jpg",
  ];

  // Slider settings
  const settings = {
    dots: true,        // Display navigation dots
    infinite: true,    // Infinite loop
    speed: 500,        // Transition speed
    slidesToShow: 1,   // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true,    // Enable auto play
    autoplaySpeed: 2000, // Change image every 2 seconds
  };

  return (
    <div className="dashboard-container">
      <div className="home">
        <h1>Welcome to Wings Cafe Inventory System</h1>
      </div>

      <div className="carousel-container">
        {/* Rotating images carousel */}
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt= '' style={{ width: '20%', height: 'auto' }} />

            </div>
          ))}
        </Slider>
      </div>

      <h1><i>Dashboard</i></h1>
      <p>Total Products in Stock: {totalStock}</p>

      {/* Bar chart displaying product quantities */}
      <div className="chart-container">
        <h2>Product Quantities in Stock</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Table displaying products */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity in Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => handleUpdate(product.id, product.name, product.quantity)}>Update</button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
