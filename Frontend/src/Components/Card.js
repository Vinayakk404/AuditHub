"use client";

import { motion, useInView, useScroll } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const Card = ({ imgUrl, bgColor, text }) => {
  // Definition for sticky position of the card
  const vertMargin = 10;

  // Ref for container
  const container = useRef(null);

  // State vars
  const [maxScrollY, setMaxScrollY] = useState(Infinity);
  const [dynamicStyles, setDynamicStyles] = useState({
    scale: 1,
    filter: 0,
  });

  // Framer Motion helpers
  const { scrollY } = useScroll({
    target: container,
  });
  const isInView = useInView(container, {
    margin: `0px 0px -${100 - vertMargin}% 0px`,
    once: true,
  });

  // Scroll tracking
  scrollY.on("change", (scrollY) => {
    let animationValue = 1;
    if (scrollY > maxScrollY) {
      animationValue = Math.max(0, 1 - (scrollY - maxScrollY) / 10000);
    }

    setDynamicStyles({
      scale: animationValue,
      filter: (1 - animationValue) * 100,
    });
  });

  useEffect(() => {
    if (isInView) {
      setMaxScrollY(scrollY.get());
    }
  }, [isInView]);

  return (
    <motion.div
      ref={container}
      className="sticky w-[90vw] rounded-xl overflow-hidden flex"
      style={{
        scale: dynamicStyles.scale,
        filter: `blur(${dynamicStyles.filter}px)`,
        height: `${100 - 2 * vertMargin}vh`,
        top: `${vertMargin}vh`,
        backgroundColor: bgColor,
      }}
    >
      {/* Image container with padding */}
      <div className="w-1/2 h-full p-2"> {/* Add padding here */}
        <img
          src={imgUrl}
          alt={imgUrl}
          className="w-full h-full object-contain rounded-lg" // Ensure the image covers the full height and width
        />
      </div>

      {/* Text container */}
      <div className="flex flex-col justify-center w-1/2 h-full p-4">
        <div className="bg-white bg-opacity-80 rounded-lg p-6 shadow-md h-full flex flex-col ">
          <div><h2 className="text-4xl text-gray-800 font-bold text-center  mt-0 ">{text.title}</h2></div>
          <p className="text-xl text-gray-600  mt-20 ml-6">{text.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
