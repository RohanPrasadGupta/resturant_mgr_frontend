import React from "react";
// import { useDispatch } from "react-redux";
import Navbar from "../components/navbar/Navbar";

const layout = ({ children }) => {
  //  const dispatch = useDispatch();

  //  useEffect(() => {
  //     const fetchUser = async () => {
  //       try {
  //         const res = await fetch(
  //           'https://resturant-mgr-backend.onrender.com/api/users/profile',
  //           {
  //             method: 'GET',
  //             credentials: 'include',
  //           }
  //         );

  //         if (!res.ok) throw new Error('Not authenticated');

  //         const data = await res.json();

  //         // Dispatch to Redux
  //         dispatch(
  //           loginUserRedux({
  //             username: data.role,
  //             tableNumber: data.tableId || '',
  //           })
  //         );

  //         // Store in localStorage too
  //         localStorage.setItem(
  //           'mgrUserData',
  //           JSON.stringify({
  //             username: data.role,
  //             tableNumber: data.tableId || '',
  //           })
  //         );
  //       } catch (err) {
  //         // Remove stale data if needed
  //         localStorage.removeItem('mgrUserData');
  //       }
  //     };

  //     fetchUser();
  //   }, []);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default layout;
