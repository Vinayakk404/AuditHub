import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900  py-10">
      <div className=" text-white container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-blue-900">
        {/* Column 1 - Investors */}
        <div>
          <h4 className="text-xl font-semibold mb-4">INVESTORS</h4>
          <ul>
            <li className="mb-2">
              <a
                href="https://www.tvsmotor.com/investors/overview"
                className="hover:text-gray-300"
              >
                Overview
              </a>
            </li>
            <li className="mb-2">
              <a
                href="https://www.tvsmotor.com/investors/financial-reports"
                className="hover:text-gray-300"
              >
                Financial Reports
              </a>
            </li>
            <li>
              <a
                href="https://www.tvsmotor.com/investors/communication"
                className="hover:text-gray-300"
              >
                Communication
              </a>
            </li>
          </ul>

          <h4 className="text-xl font-semibold mt-4 mb-2">
            TVS DEALER LOCATOR
          </h4>
          <ul>
            <li>
              <a
                href="https://www.tvsmotor.com/tvs-dealer-locator/tvs-2-wheeler"
                className="hover:text-gray-300"
              >
                Two Wheeler Dealers
              </a>
            </li>
            <li>
              <a
                href="https://www.tvsmotor.com/tvs-dealer-locator/tvs-3-wheeler"
                className="hover:text-gray-300"
              >
                Three Wheeler Dealers
              </a>
            </li>
            <li>
              <a
                href="https://www.tvsmotor.com/tvs-dealer-locator/super-premium"
                className="hover:text-gray-300"
              >
                Super Premium Dealers
              </a>
            </li>
            <li>
              <a
                href="https://www.tvsmotor.com/tvs-dealer-locator/tvs-iqube-electric"
                className="hover:text-gray-300"
              >
                Electric Scooter Dealers
              </a>
            </li>
            <li>
              <a
                href="https://dealers.tvsmotor.com/tvs-motors/"
                className="hover:text-gray-300"
              >
                AMD & AD Dealers
              </a>
            </li>
            <li>
              <a
                href="https://dealers.tvsmotor.com/iqube/"
                className="hover:text-gray-300"
              >
                iQube Dealers
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2 - About Us */}
        <div>
          <h4 className="text-xl font-semibold mb-4">ABOUT US</h4>
          <ul>
            <li className="mb-2">
              <a
                href="https://www.tvsmotor.com/about-us/overview"
                className="hover:text-gray-300"
              >
                Overview
              </a>
            </li>
            <li className="mb-2">
              <a
                href="https://www.tvsmotor.com/about-us/company-vision"
                className="hover:text-gray-300"
              >
                Company Vision
              </a>
            </li>
            <li className="mb-2">
              <a
                href="https://www.tvsmotor.com/about-us/achievements"
                className="hover:text-gray-300"
              >
                Achievements
              </a>
            </li>
            <li className="mb-2">
              <a
                href="https://www.tvsmotor.com/about-us/careers/overview"
                className="hover:text-gray-300"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="https://www.tvsmotor.com/about-us/contact-us"
                className="hover:text-gray-300"
              >
                Contact Us
              </a>
            </li>
          </ul>

          <h4 className="text-xl font-semibold mt-4 mb-2">NEWS & MEDIA</h4>
          <ul>
            <li>
              <a
                href="https://www.tvsmotor.com/media/news"
                className="hover:text-gray-300"
              >
                News
              </a>
            </li>
            <li>
              <a
                href="https://www.tvsmotor.com/media/press-release"
                className="hover:text-gray-300"
              >
                Press Release
              </a>
            </li>
            <li>
              <a
                href="https://www.tvsmotor.com/media/blog/overview"
                className="hover:text-gray-300"
              >
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 - Shop */}
        <div>
          <h4 className="text-xl font-semibold mb-4">SHOP</h4>
          <ul>
            <li className="mb-2">
              <a
                href="https://shop.tvsmotor.com/pages/accessories?preview_theme_id=171924422938&pb=0"
                className="hover:text-gray-300"
              >
                Accessories
              </a>
            </li>
            <li className="mb-2">
              <a
                href="https://shop.tvsmotor.com/pages/merchandise"
                className="hover:text-gray-300"
              >
                Merchandise
              </a>
            </li>
            <li>
              <a
                href="https://www.advantagetvs.com/PartEcommerceUI/home?Type=Customer"
                className="hover:text-gray-300"
              >
                Parts & Lubricants
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 - App Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">TVS CONNECT APP</h4>
          <div className="flex flex-col space-y-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.tvsm.connect&hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSv479P9YVGLOLcKO-lyUEOUTzgY44actorw&s"
                alt="Google Play"
                className="w-40"
              />
            </a>
            <a
              href="https://apps.apple.com/in/app/tvs-connect/id1453965748"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
                alt="App Store"
                className="w-40"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
