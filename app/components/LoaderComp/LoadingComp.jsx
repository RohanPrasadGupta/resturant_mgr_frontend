import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./loadingCompStyles.module.scss";

const LoaderComp = () => {
  return (
    <div className={styles.loaderMainLayout}>
      <CircularProgress />
    </div>
  );
};

export default LoaderComp;
