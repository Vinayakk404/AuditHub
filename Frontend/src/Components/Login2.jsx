import React, { useState } from "react";
import "./styles2.css";
import axios from "../utils/axoisConfig";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Login2 = () => {
  const [errorMessage,setErrorMessage]=useState("");
  const handleOverlayClick = () => {

    const container = document.getElementById("container2");
    const overlayBtn = document.getElementById("overlayBtn");

    // container.classList.toggle("right__panel__active");

    overlayBtn.classList.remove("scale__btn-animation");
    window.requestAnimationFrame(() => {
      overlayBtn.classList.add("scale__btn-animation");
    });
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("-"); // Default role
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {

      setErrorMessage("Username is required")
      return;
    }
    if (!password) {
      setErrorMessage("Password is required")
      return;
    }
    if (role === "-") {
      setErrorMessage("Role is required")
      return;
    }

    try {
      // Adjust the payload based on your backend's expected structure
      const response = await axios.post("http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/auth/token", {
        username,
        password,
      });

      const token = response.data; // Assuming roles is an array

      // Store token and role in Local Storage
      localStorage.setItem("token", token);

      if (username == "ProductionManager" && role == "Production") {
        localStorage.setItem("role", "Production");
        navigate(`/Production`);
      } else if (username == "Planner1" && role == "Plant") {
        localStorage.setItem("role", "Planner1");
        navigate("/plant/Plant-1");
      } else if (username == "Planner2" && role == "Plant") {
        localStorage.setItem("role", "Planner2");
        navigate("/plant/Plant-2");
      } else if (username == "Planner3" && role == "Plant") {
        localStorage.setItem("role", "Planner3");
        navigate("/plant/Plant-3");
      } else if (username == "InventoryManager" && role == "Inventory") {
        localStorage.setItem("role", "Inventory");
        navigate("/inventory");
      } else if (username == "SalesManager" && role == "Sales") {
        localStorage.setItem("role", "Sales");
        navigate("/sales");
      } else if ((username == "QualityManager" && role == "Quality")) {
        localStorage.setItem("role", "Quality");
        navigate("/Quality");
      } else {
        setErrorMessage("Incorrect Role Selection")
        return;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Incorrect credentials")
     
    }
  };

  return (
    <div id="container2">
      <div className="form__container signup__container">
        <div>
          <h1>Create Account</h1>

          <div className="form__group">
            <input type="text" placeholder="Name" required />
          </div>
          <div className="form__group">
            <input type="email" placeholder="Email" required />
          </div>
          <div className="form__group">
            <input type="password" placeholder="Password" required />
          </div>
          {/* <button>SIGN UP</button> */}
        </div>
      </div>
      <div className="form__container signin__container">
        <random>
          <h1>Sign in</h1>
     {/* Total Loss Display */}
     {errorMessage!="" && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}
          <div className="form__group">
            <input
              type="text"
              placeholder="Username "
              value={username}
              onChange={(e) => {setUsername(e.target.value);setErrorMessage("")}}
              required
            /> 
          </div>
          <div className="form__group" required>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {setPassword(e.target.value);  setErrorMessage("")}}
              required
            />
          </div>

          <select
            className="w-[400px] px-3 py-2 mt-4 border-blue-300  rounded focus:outline-none focus:ring focus:border-blue-300"
            value={role}
            onChange={(e) => {setRole(e.target.value);setErrorMessage("")}}
            required
          >
            <option value="-" >
              Select Role
            </option>
            <option value="Production">Production Manager</option>
            <option value="Plant">Plant Manager</option>
            <option value="Quality">Quality Control</option>
            <option value="Inventory">Inventory Manager</option>
            <option value="Sales">Sales Manager</option>
          </select>

          <button onClick={handleSubmit}>SIGN IN</button>
        </random>
      </div>
      <div className="overlay__container" id="overlayContainer">
        <div className="overlay__wrapper">
          <div className="overlay__panel overlay__panel__left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button
              id="overlayBtn"
              className="w-10 "
              onClick={handleOverlayClick}
            >
              SIGN IN
            </button>
          </div>
          <div className="overlay__panel overlay__panel__right">
            <h1 className="font-extrabold text-4xl">Hi there !</h1>
            <p className="font-normal text-xl">
              Enter your details and select your role !!
            </p>
            {/* <button id="overlayBtn" className='flex' onClick={handleOverlayClick}><span>SIGN UP</span></button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login2;
