"use client";

import { motion } from "framer-motion";
import React from "react";
import { useLocation } from "react-router-dom";

// JSON mapping of vehicle images to vehicle IDs
const VEHICLE_IMAGE_MAPPING = {
  V101: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/130211/apache-160-right-side-view-2.png?isig=0&q=80",
  V102: "https://imgd.aeplcdn.com/1056x594/n/bw/models/colors/undefined-gloss-black-1587565120702.jpg?q=80",
  V103: "https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/tvs-ntorq-125-disc1725629749318.jpg?q=80",
  V104: "https://www.tvsmotor.com/tvs-jupiter/-/media/Feature/BrandPriceCity/JupiterBikeImg.webp",
  V105: "https://static.autox.com/uploads/bikes/2017/05/1486028280-tvs-star-city-plus.jpg",
  V106: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjgRns7F3Y8jptuxj3lJZrO6_dt2r0Kk997w&s",
  V107:"https://imgd.aeplcdn.com/664x374/n/bw/models/colors/tvs-select-model-wallnut-brown-1715634491365.png?q=80",
  V108:"https://images.carandbike.com/cms/TVS_Raider_9d7bc11c88.jpg"
  // Add more mappings as needed
};

const Card = ({ vehicle }) => {
  // Retrieve the image URL based on the vehicleId
  const imgUrl = VEHICLE_IMAGE_MAPPING[vehicle.vehicleId] || "https://via.placeholder.com/400x300?text=Default+Image";

  // Determine vehicle.stock color based on the value
  const stockColor = vehicle.stock < 100 ? "text-red-500" : "text-green-500";


  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
    >
      {/* Image Section */}
      <div className="h-48 w-full">
        <img
          src={imgUrl}
          alt={vehicle.vehicleModel}
          className="object-cover w-96 h-full"
        />
      </div>

      {/* Text Section */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          {vehicle.vehicleModel}
        </h2>
        <p className="text-md text-gray-600 mb-1 text-center">
          <span className="font-medium">Vehicle ID:</span> {vehicle.vehicleId}
        </p>
        <p className={`text-md font-bold text-center ${stockColor}`}>
          <span className="font-medium">Stock:</span> {vehicle.stock}
          <br/>
        {vehicle.stock<100 &&(  <span className=" text-red-500">Low Stock!</span>)}
        </p>
      </div>
    </motion.div>
  );
};

export default Card;
