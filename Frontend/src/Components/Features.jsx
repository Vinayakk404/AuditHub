import React from 'react'

const Features = () => {
  return (
    
   <div class="px-4 mt-4">
   <div class="flex justify-center">
     <div class="flex space-x-4 w-full">
       {/* <!-- Card 1 --> */}
       <div class="relative h-[500px] flex-1 bg-gray-800 bg-opacity-60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform hover:flex-[1.25] items-center">
         {/* <!-- Video Overlay --> */}
         <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 invisible transition-opacity duration-300 hover:opacity-100 hover:visible">
           <header class="absolute top-28 left-0 right-0 z-10 flex justify-center items-center">
             <button class="text-gray-800 text-4xl font-ibicon focus:outline-none"></button>
           </header>
           <iframe width="1424" height="713" src="https://www.youtube.com/embed/ecl-eCbYFPM" title="Reverse Engineer CSS Animations #Shorts" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
         </div>
 
         {/* <!-- Image --> */}
         <img
           src="https://media.istockphoto.com/id/1480239219/photo/an-analyst-uses-a-computer-and-dashboard-for-data-business-analysis-and-data-management.jpg?s=612x612&w=0&k=20&c=URv6HYZ8L3NCQnxT8-ITvInMW7mlsTE6EjnXHaqF-H4="
           alt="Global Presence"
           class="brightness-50 backdrop-blur-lg absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-10"
         />
 
         {/* <!-- Text --> */}
         <div class="relative z-20 flex justify-center items-center mt-56 transform translate-y-20 transition-transform duration-500">
           <h2 class="text-center text-3xl md:text-3xl lg:text-4xl font-semibold text-white drop-shadow-md">
               INTERACTIVE <br /> DASHBOARDS
           </h2>
         </div>
 
         {/* <!-- Buttons --> */}
         <div class="absolute top-90 left-0 w-full grid place-items-center opacity-0 invisible transition-opacity duration-300 hover:opacity-100 hover:visible">
           <button class="min-w-[170px] bg-white border-2 border-white rounded-lg text-lg font-semibold text-blue-800 uppercase tracking-wide shadow-md transition-all duration-500 px-3 py-2">
             Play Video
           </button>
           <a
             href="#global-presence-section"
             class="mt-2 border-2 border-white rounded-lg bg-black bg-opacity-50 text-white font-semibold uppercase tracking-wide px-5 py-3 text-center"
           >
             Know More
           </a>
         </div>
       </div>
 
       {/* <!-- Repeat similar structure for Cards 2, 3, and 4 --> */}
       
       {/* <!-- Card 2 --> */}
       <div class="relative flex-1 bg-gray-800 bg-opacity-10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform hover:flex-[1.25]">
         {/* <!-- Video Overlay --> */}
         <div class="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 invisible transition-opacity duration-300 hover:opacity-100 hover:visible">
           <header class="absolute top-28 left-0 right-0 z-10 flex justify-center items-center">
             <button class="text-gray-800 text-4xl font-ibicon focus:outline-none"></button>
           </header>
         
         </div>
 
         {/* <!-- Image --> */}
         <img
           src="https://png.pngtree.com/background/20230618/original/pngtree-d-render-of-a-user-friendly-seo-data-analytics-interface-with-picture-image_3752664.jpg"
           alt="Technology Innovation"
           class="brightness-50 absolute top-1/2 left-1/2 w-full h-screen object-cover transform -translate-x-1/2 -translate-y-1/2 z-10"
         />
 
         {/* <!-- Text --> */}
         <div class="relative z-20 flex justify-center items-center mt-56 transform translate-y-20 transition-transform duration-500">
           <h2 class="text-center text-3xl md:text-3xl lg:text-4xl font-semibold text-white drop-shadow-md">
           DATA
           <br /> CONSOLIDATION
           </h2>
         </div>
 
         {/* <!-- Buttons --> */}
         <div class="absolute top-90 left-0 w-full grid place-items-center opacity-0 invisible transition-opacity duration-300 hover:opacity-100 hover:visible">
           <button class="min-w-[170px] bg-white border-2 border-white rounded-lg text-lg font-semibold text-blue-800 uppercase tracking-wide shadow-md transition-all duration-500 px-3 py-2">
             Play Video
           </button>
           <a
             href="#ib-landing-awards"
             class="mt-2 border-2 border-white rounded-lg bg-black bg-opacity-50 text-white font-semibold uppercase tracking-wide px-5 py-3 text-center"
           >
             Know More
           </a>
         </div>
       </div>
 
       {/* <!-- Similarly, add Cards 3 and 4 with respective content --> */}
       
       {/* <!-- Card 3 --> */}
       <div class="relative flex-1 bg-gray-800 bg-opacity-60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform hover:flex-[1.25]">
         {/* <!-- Video Overlay --> */}
         <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 invisible transition-opacity duration-300 hover:opacity-100 hover:visible">
           <header class="absolute top-28 left-0 right-0 z-10 flex justify-center items-center">
             <button class="text-gray-800 text-4xl font-ibicon focus:outline-none"></button>
           </header>
           <iframe
             src="https://www.youtube.com/embed/0b9G_g6UYng"
             class="w-full h-full border-0 rounded-md transform scale-0 transition-transform duration-300 hover:scale-100"
             allowfullscreen
           ></iframe>
         </div>
 
         {/* <!-- Image --> */}
         <img
           src="https://www.intellicus.com/wp-content/uploads/2021/02/realtime-blog.jpg"
           alt="Our Brand"
           class=" brightness-50 absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-10"
         />
 
         {/* <!-- Text --> */}
         <div class="relative z-20 flex justify-center items-center mt-56 transform translate-y-20 transition-transform duration-500">
           <h2 class="text-center text-3xl md:text-3xl lg:text-4xl font-semibold text-white drop-shadow-md">
           REAL TIME   <br /> ANALYTICS
           </h2>
         </div>
 
         {/* <!-- Buttons --> */}
         <div class="absolute top-90 left-0 w-full grid place-items-center opacity-0 invisible transition-opacity duration-300 hover:opacity-100 hover:visible">
           <button class="min-w-[170px] bg-white border-2 border-white rounded-lg text-lg font-semibold text-blue-800 uppercase tracking-wide shadow-md transition-all duration-500 px-3 py-2">
             Play Video
           </button>
           <a
             href="#our-brand-section"
             class="mt-2 border-2 border-white rounded-lg bg-black bg-opacity-50 text-white font-semibold uppercase tracking-wide px-5 py-3 text-center"
           >
             Know More
           </a>
         </div>
       </div>
 
       {/* <!-- Card 4 --> */}
       <div class="relative flex-1 bg-gray-800 bg-opacity-10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out transform hover:flex-[1.25]">
         {/* <!-- Video Overlay --> */}
         <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 invisible transition-opacity duration-300 hover:opacity-100 hover:visible">
           <header class="absolute top-28 left-0 right-0 z-10 flex justify-center items-center">
             <button class="text-gray-800 text-4xl font-ibicon focus:outline-none"></button>
           </header>
           <iframe
             src="https://www.youtube.com/embed/d88x0ynxwwg?enablejsapi=1&rel=0&modestbranding=1&autohide=1&showinfo=0"
             class="w-full h-full border-0 rounded-md transform scale-0 transition-transform duration-300 hover:scale-100"
             allowfullscreen
           ></iframe>
         </div>
 
         {/* <!-- Image --> */}
         <img
           src="https://cdn.prod.website-files.com/659f77ad8e06050cc27ed531/65ab0ef1188859be0ddba1ca_0c9dd4a7c4f66348a078c3aa582a54c97d27aa62-993x444.webp"
           alt="CSR"
           className=" brightness-50 backdrop-blur-lg  absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-0"
         />
 
         {/* <!-- Text --> */}
         <div class="relative z-20 flex justify-center items-center mt-56 transform translate-y-20 transition-transform duration-500 z-20">
           <h2 class="text-center text-3xl md:text-3xl lg:text-4xl font-semibold text-white drop-shadow-md">
           WORKFLOW<br />  OPTIMIZATION 
           </h2>
         </div>
 
         {/* <!-- Buttons --> */}
         <div class="absolute top-90 left-0 w-full grid place-items-center opacity-0 invisible transition-opacity duration-300 hover:opacity-100 hover:visible">
           <button class="min-w-[170px] bg-white border-2 border-white rounded-lg text-lg font-semibold text-blue-800 uppercase tracking-wide shadow-md transition-all duration-500 px-3 py-2">
             Play Video
           </button>
           <a
             href="#corporate-section"
             class="mt-2 border-2 border-white rounded-lg bg-black bg-opacity-50 text-white font-semibold uppercase tracking-wide px-5 py-3 text-center"
           >
             Know More
           </a>
         </div>
       </div>
     </div>
   </div>
 </div>
 
  )
}

export default Features