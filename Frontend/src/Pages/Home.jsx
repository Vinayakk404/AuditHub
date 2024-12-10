import React from "react";
import NavbarHome from "../Components/NavbarHome";
// import "../App.css"
import Footer from "../Components/Footer";
import Card from "../Components/Card"; // Import the Card component
import { toast, Bounce } from "react-toastify";
import BannerLogic from "../Components/BannerLogic";
import Header from "../Components/Header";
import Navbar from "../Components/Navbar.jsx";
import Features from "../Components/Features.jsx";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import axios from 'axios'

// const refreshMetabaseDashboard = async () => {
//   try {
//       // Authenticate and get the session token
//       const sessionResponse = await axios.post(
//           `http://localhost:3000/api/session`,
//           {
//               username: "vinayakkumar808@gmail.com",
//               password: "Vinayak@123"
//           }
//       );

//       const token = sessionResponse.data.id;

//       // Refresh the Metabase dashboard using the token
//       const dashboardId = 3;
//       await axios.post(
//           `http://localhost:3000/api/dashboard/${dashboardId}/refresh`,
//           {},
//           {
//               headers: { "X-Metabase-Session": token }
//           }
//       );

//       console.log("Metabase dashboard refreshed successfully.");
//       toast.success("Metabase dashboard refreshed successfully!");
//   } catch (error) {
//       console.error("Error refreshing Metabase dashboard:", error);
//       toast.error("Failed to refresh Metabase dashboard.");
//   }
// };
// refreshMetabaseDashboard();

// Array of objects with different background colors, image URLs, and text content for each card
export const cardData = [
  {
    bgColor: "#f9c557",
    imageUrl:
      "https://img.freepik.com/premium-vector/flatstyle-production-manager-with-workflow-charts-factory-equipment_1033579-58981.jpg?w=900",
    text: {
      title: "STEP 1 - Production Planner",
      description: (
        <ul style={{ listStyleType: "disc" }}>
          <li className="text-bold mb-10">
            Production Planning: Scheduling and managing production processes.
          </li>
          <li className="text-bold mb-10">
            Process Oversight: Ensuring quality, efficiency, and meeting
            deadlines.
          </li>
          <li className="text-bold mb-10">
            Production planner is responsible for updating the plan, the
            allocated budget and the days allotted for a particular plan.{" "}
          </li>
          <li className="text-bold mb-10">
            In a specific plan, what all vehicles would be produced, in which
            shift under what operator and when the plan execution will commence,
            are the responsibilities of production planner.
          </li>
        </ul>
      ),
    },
  },
  {
    bgColor: "#5aa5c0",
    // imageUrl: 'https://img.freepik.com/free-vector/people-working-factory-landing-pages_74855-2533.jpg?t=st=1728297345~exp=1728300945~hmac=e3c3b9e994039987335994efb4221b78183675978899776e68b591172ec48b22&w=1380',
    imageUrl:
      "https://www.shutterstock.com/image-vector/uniformed-workers-line-assembling-circuit-600nw-2166775401.jpg",
    text: {
      title: "STEP 2 - Plant Manager",
      description: (
        <ul style={{ listStyleType: "disc" }}>
          <li className="text-bold mb-10">
            Plant Operation: Operating and maintaining assembly machinery and
            tools.
          </li>
          <li className="text-bold mb-10">
            Reporting Issues: Identifying and reporting any production or
            machinery issues to supervisors.
          </li>
          <li className="text-bold mb-10">
            Plant Manager is responsible to monitor the batch production, report in
            case of any failure, anomalies and approve to send the manufactured
            batch to quality control.
          </li>
        </ul>
      ),
    },
  },
  {
    bgColor: "#ffffff",
    imageUrl:
      "https://img.freepik.com/free-vector/product-manager-concept-illustration_114360-21574.jpg?t=st=1728297842~exp=1728301442~hmac=4e6791f7a1d1fd949173b4d677b40d2dce80e04bffd37c6c3efe992d907ee54b&w=740",
    text: {
      title: "STEP 3 - Quality Control Manager",
      description: (
        <ul style={{ listStyleType: "disc" }}>
          <li className="text-bold mb-10">
            Quality Assurance: Developing and implementing quality control
            processes and standards to ensure products meet specifications and
            regulatory requirements.
          </li>
          <li li className="text-bold mb-10">
            Inspection and Testing: Overseeing inspections and testing of raw
            materials, components, and finished products to identify defects and
            ensure compliance.
          </li>
          <li className="text-bold mb-10">
            Quality manager updates whether a particular batch of vehicle is
            allowed to move to inventory, after passing rigorous quality checks.
          </li>
          <li className="text-bold mb-10">
            Documenting the anomalies, faults found in vehicles to report and
            find the root cause for the major breakdowns.
          </li>
        </ul>
      ),
    },
  },
  {
    bgColor: "#bcd5f4",
    imageUrl:
      "https://img.freepik.com/premium-vector/efficient-warehouse-manager-organizing-delivery-goods-box_1310786-31603.jpg?w=1060",
    text: {
      title: "STEP 4 - Inventory Manager",
      description: (
        <ul style={{ listStyleType: "disc" }}>
          <li className="text-bold mb-10">
            Inventory Control: Monitoring and managing stock levels of raw
            materials, components, and finished products to ensure optimal
            inventory without overstocking or stockouts.
          </li>
          <li className="text-bold mb-10">
            Stock Audits: Conducting regular inventory audits to verify stock
            accuracy and identify discrepancies.
          </li>
          <li className="text-bold mb-10">
            Inventory Planning: Forecasting inventory needs based on production
            schedules, sales forecasts, and market demand.
          </li>
          <li className="text-bold mb-10">
            Inventory Manager is responsible for documenting any anomalies he
            faces while putting the vehicles up to the sales manager, he is also
            responsible to approve the batch to be added to inventory which has
            been passed on by the quality control.
          </li>
        </ul>
      ),
    },
  },
  {
    bgColor: "#eef5ff",
    imageUrl:
      "https://img.freepik.com/free-vector/flat-people-business-training-illustration_23-2148922529.jpg?t=st=1728298124~exp=1728301724~hmac=6e755a219a63e0f55f67effa200b318a447b692ddc41f47765d27a0b64386bcb&w=996",
    text: {
      title: "STEP 5 - Sales Manager",
      description: (
        <ul style={{ listStyleType: "disc" }}>
          <li className="text-bold mb-10">
            Sales Strategy Development: Creating and implementing sales
            strategies to achieve revenue targets and market growth.
          </li>
          <li className="text-bold mb-10">
            Customer Relationship Management: Building and maintaining
            relationships with key customers, dealers, and distributors to drive
            sales.
          </li>
          <li className="text-bold mb-10">
            Collaboration with Other Departments: Working closely with
            marketing, production, and logistics teams to ensure alignment and
            support for sales initiatives.
          </li>
          <li className="text-bold mb-10">
            Sales Manager is responsible to sell the vehicles and maintain the
            record for the same.
          </li>
        </ul>
      ),
    },
  },
];

function App() {
  const goServices = () => {
    window.scrollBy(0, 800);
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const headingVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const paragraphVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, delay: 0.5 },
    },
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-between w-screen">
        <div className="max-w-6xl mx-auto text-white z-10">
          {/* Header */}
          <Navbar />
        </div>
        <div className="w-full h-screen bg-banner-bg bg-no-repeat bg-center bg-cover relative overflow-hidden">
          <div className="w-full h-screen absolute top-0 left-0 -z-10">
            <BannerLogic />
          </div>
        </div>

        {/* Main content */}

        <div className="flex-grow mt-40">
          {/* Hero Section */}

          {/* Overlay for better text readability */}
          <div className="absolute inset-0  opacity-50"></div>

          {/* Content */}
          <motion.div
            className="relative z-10 text-center px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              id="home"
              className="text-9xl md:text-9xl font-bold text-white mt-10"
              variants={headingVariants}
            >
              AuditHub
            </motion.h1>
            <motion.p
              className="mt-8 text-xl md:text-2xl text-white"
              variants={paragraphVariants}
            >
              Your One Stop Solution To Auditing
            </motion.p>



            {/* Optional Call-to-Action Button */}
            <motion.a
              onClick={() => {
                const element = document.getElementById("services");
                element?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="hover:cursor-pointer  mt-12 inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 100 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          <div className=" hover:cursor-pointer mx-auto flex mt-32 w-[35px] h-[160px]  justify-center">
            <motion.div
              animate={{ y: [10, 30, 10] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="hover:cursor-pointer  "
              onClick={() => {
                const element = document.getElementById("services");
                element?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            ><FaArrowDown size={40} color="white"/></motion.div>
          </div>
          <div className="flex flex-col items-center " id="services">
            <section className="mt-72 mb-20 flex justify-center items-center font-bold text-6xl text-white">
              Services
            </section>
          </div>
          <Features />
          {/* Dynamic Card Section */}
          <div className="flex flex-col items-center">
            <section
              id="production-flow"
              className="mt-64 mb-20 flex justify-center items-center font-bold text-6xl text-white"
            >
              Production Flow
            </section>
          </div>

          {/* Dynamic Card Section */}
          <div className="flex flex-col items-center min-h-screen">
            <section className="relative flex flex-col gap-[10vh] py-[10vh]">
              {cardData.map((card, idx) => (
                <Card
                  key={idx}
                  imgUrl={`${card.imageUrl}`}
                  bgColor={card.bgColor}
                  text={card.text}
                />
              ))}
            </section>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;
