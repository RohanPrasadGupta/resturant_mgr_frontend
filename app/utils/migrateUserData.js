export const migrateUserData = () => {
  if (typeof window !== "undefined") {
    try {
      const oldData = localStorage.getItem("mgrUserData");
      if (oldData) {
        const parsed = JSON.parse(oldData);

        localStorage.setItem(
          "user",
          JSON.stringify({
            username: parsed.username,
            tableNumber: parsed.tableNumber || "",
          })
        );

        localStorage.removeItem("mgrUserData");
        // console.log("Successfully migrated user data from mgrUserData to user");
      }
    } catch (error) {
      console.error("Error migrating user data:", error);
      localStorage.removeItem("mgrUserData");
    }
  }
};
