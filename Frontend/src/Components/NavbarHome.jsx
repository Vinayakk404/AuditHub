import React from "react";

const NavbarHome = () => {
  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side: Logo */}
        <div className="flex items-center">
          <img
            src="https://w1.pngwing.com/pngs/989/805/png-transparent-sky-logo-tvs-motor-company-symbol-television-himachal-pradesh-motorcycle-blue.png" // Replace with your logo path
            alt="Company Logo"
            className="w-23 h-12" // Adjust width and height as needed
          />
        </div>

        {/* Right side: Navigation links */}
        <div className="space-x-6">
          <a
            href="#aboutus"
            className="text-white hover:text-gray-400 transition duration-300"
          >
            About Us
          </a>
          <a
            href="#contactus"
            className="text-white hover:text-gray-400 transition duration-300"
          >
            Contact Us
          </a>
          <a
            href="#login"
            className="text-white hover:text-gray-400 transition duration-300"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;
