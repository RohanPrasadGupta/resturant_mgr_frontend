"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoaderComp from "../components/LoaderComp/LoadingComp";

const Pages = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/pages/home");
  }, [router]);

  return <LoaderComp />;
};

export default Pages;
