import React from 'react'

const Sidebar3 = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-full fixed top-0 left-0 p-4">
    <h2 className="text-xl font-semibold mb-4">QC Manager</h2>
    <ul>
        <li className="mb-3">
            <a href="#" className="hover:underline">Assigned Tasks</a>
        </li>
        <li className="mb-3">
            <a href="#" className="hover:underline">Update QC Form</a>
        </li>
    </ul>
</div>
  )
}

export default Sidebar3