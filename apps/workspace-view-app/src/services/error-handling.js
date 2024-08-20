import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export const handleError = (error) => {
  const message = error.message || "something went wrong";
  monday.execute("notice", { type: "error", message, timeout: 5000 });
};
