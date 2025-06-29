import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token")?localStorage.getItem("token"):null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const url = "http://localhost:8080";

  const getCurrentUser = async (token) => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/users/current-user`, {headers: {Authorization: `Bearer ${token}`}});
      // console.log("cr",response)
      const user = response.data;
      if (user) {
        setUser(user);
        navigate("/")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      getCurrentUser(token);
    }
  },[])

  useEffect(() => {
    // Check for OAuth callback
    const pToken = searchParams.get('token');
    const userId = searchParams.get('userId');
    
    if (pToken && userId) {
      localStorage.setItem('token', pToken);
      localStorage.setItem('userId', userId);
      setToken(pToken); 
      getCurrentUser(pToken); 
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  // Simulate loading user from localStorage or API
  //register
  const signup = async (data) => {
    try {
      // console.log(data);
      setLoading(true)
      const formData = new FormData();

      const obj = {
        username: data.email,
        email: data.email,
        fullName: data.fullName,
        password: data.password
      }

        const response = await axios.post(`${url}/api/auth/register`, obj);
        // console.log(response)
        const {user, token} = response.data;
      // console.log(token, user)
        if (user) {
          setUser(user);
        }
        if(token) {
          localStorage.setItem("token", token)
          setToken(token)
        }
    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false);
    }
  }

  // Login function
  const login = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${url}/api/auth/login`, userData);
      const {token, user} = response.data;
      

      if (token) {
        localStorage.setItem("token", token)
        setToken(token);
      }
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.log(error)
      if (error.response?.status === 401) {
        throw new Error("Incorrect email or password");
      }
  
      // Handle other errors
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
      
    } finally{
      setLoading(false)
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
