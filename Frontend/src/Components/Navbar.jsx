// Navbar.js
import React from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";

const Navbar = () => {
  // Define animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="w-full text-white py-4 flex justify-between items-center border-b-[1px] border-b-blue-600 px-6 md:px-12 lg:px-20"
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold uppercase mr-14">Tvs Motors</h1>
      </motion.div>

      {/* Navigation Links */}
      <motion.div variants={itemVariants}>
        <ul className="flex gap-6 text-sm uppercase font-semibold">
          <li className="cursor-pointer hover:text-gray-50 transition-colors duration-300">
            Home
          </li>
          <li
            className="cursor-pointer hover:text-blue-400 transition-colors duration-300"
            onClick={() => {
              const element = document.getElementById("services");
              element?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Services+
          </li>
          <li
            className="cursor-pointer hover:text-blue-400 transition-colors duration-300"
            onClick={() => {
              const element = document.getElementById("production-flow");
              element?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Production Flow
          </li>
        </ul>
      </motion.div>

      {/* Login Button */}
      <motion.div variants={itemVariants}>
        <Link to="/login">
          <button className=" ml-14 d   bg-green-600 py-2 px-6 rounded-xl text-base uppercase font-semibold hover:bg-green-700 transition-colors duration-300">
            Log in
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;
