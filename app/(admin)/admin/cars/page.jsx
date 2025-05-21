import React from "react";
import CarsList from "./_components/car-lists";

export const metadata = {
  title: "cars | vehicle Admin",
  description: "Manage cars in your marketplace",
};

const CarsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Car Management</h1>
      <CarsList/>
    </div>
  );
};

export default CarsPage;
