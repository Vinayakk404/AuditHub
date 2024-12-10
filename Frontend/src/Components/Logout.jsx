import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Logout = () => {

    const navigate=useNavigate();
    const logout=()=>{
        localStorage.setItem("role","");
        localStorage.setItem("token","");
        navigate("/login");
    }
  return (
    <button    >
    <div onClick={logout} className={`flex items-center p-3 rounded-md transition-colors
            
        text-gray-700 hover:text-white hover:bg-blue-500 "
   }`}>
    <FaSignOutAlt className='mr-3'/>
      Logout
    </div>
    </button>
  )
}

export default Logout