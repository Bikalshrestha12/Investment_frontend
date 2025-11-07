import React, { createContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// import { servicesitems } from '../pages/Service';
import axios from 'axios';
import AxiosWithAuth from './AxiosWithAuth';
// import { projectData } from '../pages/Project';


export const InvestmentContext = createContext();

const InvestmentContextProvider = (props) => {

  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // console.log(projectData);

  const token = localStorage.getItem("token");
  // console.log("Login token :", token)
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // const response = await axios.get('http://localhost:5000/api/v1/projects');
        const response = await AxiosWithAuth().get('/api/v1/projects');

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
            ? response.data.data
            : [];
        setProjectData(data);
        // console.log('Fetched Services data:', data);
      } catch (err) {
        if (err.response) {
          setError(`Error: ${err.response.data.message || 'Failed to fetch project data'}`);
        } else if (err.request) {
          setError('No response from server. Please check your backend.');
        } else {
          setError(`Error: ${err.message}`);
        }
        console.error('Axios error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);




  //  card item
  const fetchCart = async () => {
    if (!token || !projectData.length) return;
    const currentProjectId = projectData?.[0]?._id;
    try {
      // const res = await axios.get('http://localhost:5000/api/v1/carts',
      const res = await AxiosWithAuth().get('/api/v1/carts', {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-project-id': currentProjectId,
        },
      });
      // console.log("Cart response:", res.data);
      setCartItems(res.data.data);
      // console.log("Fetching carts with project ID:", currentProjectId);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };


  const addToCart = async (projectId) => {
    try {
      await AxiosWithAuth().post(
        // 'http://localhost:5000/api/v1/carts',
        '/api/v1/carts',
        { project: projectId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-project-id': projectId,
          },
        }
      );
      toast.success("Add to cart success fully!")
      fetchCart();
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error("Add to cart failed!")
    }
  };

  const removeFromCart = async (cartIds) => {
    try {
      for (const id of cartIds) {
        // await axios.delete(`http://localhost:5000/api/v1/carts/${id}`, 
        await AxiosWithAuth().delete(`/api/v1/carts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      toast.success('Removed from cart!');
      setCartItems(prev => prev.filter(item => !cartIds.includes(item._id)));
    } catch (err) {
      console.error('Failed to remove from cart', err);
      toast.error('Remove from cart failed!');
    }
  };

  const handleConfirmUpdate = async (projectId, cartIds, newQty) => {
    if (newQty <= 0 || isNaN(newQty)) {
      alert('Quantity must be at least 1');
      return;
    }

    try {
      // Delete all existing cart items for that project
      for (const id of cartIds) {
        // await axios.delete(`http://localhost:5000/api/v1/carts/${id}`, 
        await AxiosWithAuth().delete(`/api/v1/carts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Add new cart items equal to newQty
      for (let i = 0; i < newQty; i++) {
        await AxiosWithAuth().post(
          // 'http://localhost:5000/api/v1/carts',
          '/api/v1/carts',
          { project: projectId, quantity: 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'x-project-id': projectId,
            },
          }
        );
      }

      // Refresh cart items
      await fetchCart();
      toast.success('Cart updated successfully!');
    } catch (error) {
      console.error('Failed to update cart', error);
      alert('Update failed');
    }
  };


  useEffect(() => {
    if (projectData.length > 0 && token) {
      fetchCart();
    }
  }, [projectData, token]);


  // console.log("cart Item Data :", cartItems)

  const value = {
    // servicesitems,
    projectData, loading, error,
    cartItems, addToCart, removeFromCart, handleConfirmUpdate,
    // projectData,
  }
  // console.log("value: ", value)
  return (
    <InvestmentContext.Provider value={value}>
      {props.children}
    </InvestmentContext.Provider>
  )
}

export default InvestmentContextProvider