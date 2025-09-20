import React from "react";
import { useNavigate } from "react-router-dom";
import UiButton from "./UiButton";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTiktok } from "react-icons/fa";
import Logo from "../../assets/NextGen Electronics.png";

export default function UiFooter() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="glass-dark border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            {/* Logo/Brand */}
            <div
              className={`flex items-center gap-3 font-display font-bold text-xl cursor-pointer heading-glass transition-all duration-300 ease-in-out hover:scale-105 transform ${
                location.pathname === "/" ? "text-glass" : "text-glass-muted"
              }`}
              onClick={() => handleNavigation("/")}
            >
              <img src={Logo} alt="NextGen Electronics" className="w-10 h-10 transition-transform duration-300 ease-in-out hover:scale-110" />
              <span className="hidden sm:block transition-all duration-300 ease-in-out">NextGen Electronics</span>
              <span className="sm:hidden transition-all duration-300 ease-in-out">NextGen</span>
            </div>{" "}
            <p className="text-glass-muted text-sm leading-relaxed">Your trusted source for cutting-edge electronics and smart devices. Quality products, competitive prices, exceptional service.</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-glass-muted hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 glass-hover"
              >
                <FacebookOutlinedIcon fontSize="small" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-glass-muted hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 glass-hover"
              >
                <XIcon fontSize="small" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-glass-muted hover:text-pink-400 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 glass-hover"
              >
                <InstagramIcon fontSize="small" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-glass-muted hover:text-blue-500 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 glass-hover"
              >
                <LinkedInIcon fontSize="small" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-glass-muted hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 glass-hover"
              >
                <YouTubeIcon fontSize="small" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-glass-muted hover:text-black transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 glass-hover"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-glass">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => handleNavigation("/")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <HomeOutlinedIcon fontSize="small" className="mr-2" />
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/search")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <ShoppingBagOutlinedIcon fontSize="small" className="mr-2" />
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/search?category=all")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <CategoryOutlinedIcon fontSize="small" className="mr-2" />
                  Categories
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/search?brand=all")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <StarBorderOutlinedIcon fontSize="small" className="mr-2" />
                  Brands
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/search?deals=true")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <LocalOfferOutlinedIcon fontSize="small" className="mr-2" />
                  Deals
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/about")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <ArticleOutlinedIcon fontSize="small" className="mr-2" />
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-glass">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => handleNavigation("/contact")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <PhoneOutlinedIcon fontSize="small" className="mr-2" />
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/shipping")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <LocalShippingOutlinedIcon fontSize="small" className="mr-2" />
                  Shipping Info
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/returns")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <ReplayOutlinedIcon fontSize="small" className="mr-2" />
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/size-guide")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <StraightenOutlinedIcon fontSize="small" className="mr-2" />
                  Size Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/faq")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <HelpOutlineOutlinedIcon fontSize="small" className="mr-2" />
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/tracking")} className="text-glass-muted hover:text-glass transition-colors duration-200 flex items-center py-1 w-full text-left">
                  <RoomOutlinedIcon fontSize="small" className="mr-2" />
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-glass flex items-center">
              <EmailOutlinedIcon fontSize="small" className="mr-2" />
              Stay Updated
            </h4>
            <p className="text-glass-muted text-sm leading-relaxed">Subscribe to our newsletter for the latest products and exclusive offers.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full input-glass px-4 py-3 rounded-lg text-glass placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors"
              />
              <UiButton type="submit" variant="contained" color="primary" size="small" fullWidth className="w-full">
                <EmailOutlinedIcon fontSize="small" className="mr-2" />
                Subscribe
              </UiButton>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-glass-muted text-sm">© {currentYear} NextGen Electronics. All rights reserved.</div>
            <div className="flex flex-wrap gap-6 text-sm">
              <button onClick={() => handleNavigation("/privacy")} className="text-glass-muted hover:text-glass transition-colors duration-200">
                Privacy Policy
              </button>
              <button onClick={() => handleNavigation("/terms")} className="text-glass-muted hover:text-glass transition-colors duration-200">
                Terms of Service
              </button>
              <button onClick={() => handleNavigation("/cookies")} className="text-glass-muted hover:text-glass transition-colors duration-200">
                Cookie Policy
              </button>
              <button onClick={() => handleNavigation("/sitemap")} className="text-glass-muted hover:text-glass transition-colors duration-200">
                Sitemap
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
