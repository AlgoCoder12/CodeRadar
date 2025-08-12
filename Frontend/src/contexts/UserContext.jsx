import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";


const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const {token, url} = useAuth();

  const [timeTable, setTimeTable] = useState(null);


  const uploadTimeTable = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
        const res = await axios.post(`${url}/api/schedule/upload-pdf`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {   
      console.error("Error uploading timetable:", error);
      return null;
    }
  }


    const getTimeTable = async() => {
    try {
      const res = await axios.get(`${url}/api/schedule/my`, {headers: {Authorization: `Bearer ${token}`}});
      // console.log(res)
      if (res.status === 200) {
        setTimeTable(res.data);
        // console.log("timeTbale", timeTable)
      }
      return res.data
    } catch (error) {
      console.log(error)
      return null;
    }
  }

    const values = {
        getTimeTable,
        timeTable,
        uploadTimeTable
    };

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    )
}
