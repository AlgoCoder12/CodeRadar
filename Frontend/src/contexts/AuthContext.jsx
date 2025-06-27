import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token")?localStorage.getItem("token"):null);
  const [loading, setLoading] = useState(true);

  const url = "http://localhost:8080";

  // Simulate loading user from localStorage or API
  //register
  const signup = async (data) => {
    try {
      // console.log(data);
      setLoading(true)
        const response = await axios.post(`${url}/api/auth/register`, {username: data.email, ...data});
        const {user, token} = response;
        if (user) {
          setUser(user);
        }
        if(token) {
          setToken(token)
          localStorage.setItem("token", token)
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
      console.log(response)
      if (token) {
        setToken(token);
        localStorage.setItem("token", token)
      }
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const getCurrentUser = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/users/current-user`, {headers: {Authorization: `Bearer ${token}`}});
      // console.log("cr",response)
      const user = response.data;
      if (user) {
        setUser(user);
        
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
  },[])

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
