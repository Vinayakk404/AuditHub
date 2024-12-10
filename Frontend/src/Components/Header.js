// src/components/Header.jsx
import { motion } from "framer-motion";

const Header = ({title,subText}) => {
  return (
    <header className="relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center text-center text-white">
    
      <div className="relative z-10 px-4">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-black"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-black"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >
         {subText}
        </motion.p>
      </div>
    </header>
  );
};

export default Header;
