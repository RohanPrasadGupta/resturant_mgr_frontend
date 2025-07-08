"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateUserRedux } from "../redux/storeSlice/loginUserSlice";
import { migrateUserData } from "../utils/migrateUserData";

export default function AuthPersistence() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        migrateUserData();

        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          dispatch(hydrateUserRedux(userData));
        } else {
          dispatch(hydrateUserRedux(null));
        }
      } catch (error) {
        console.error("Error loading user data from localStorage:", error);

        localStorage.removeItem("user");
        dispatch(hydrateUserRedux(null));
      }
    }
  }, [dispatch]);

  return null;
}
