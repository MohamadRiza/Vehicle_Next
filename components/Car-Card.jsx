import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";

const CarCard = ({ car }) => {
  return (
    <Card>
      <div className="relative h-48">
        {car.images && car.images.length > 0 ? (
          <div>
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </Card>
  );
};

export default CarCard;
