import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
    const year = new Date().getFullYear();

    return    <footer className="bg-[#1E1E1C] text-white py-12">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Column 1 - Company Info */}
        <div className="lg:col-span-1">
          <h2 className="text-white text-xl font-semibold uppercase">Information</h2>
          <ul className="mt-4 space-y-3">
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Shipping & Return</a></li>
            <li><a href="#" className="hover:text-white">Terms & Condition</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Column 2 - Links */}
        <div className="lg:col-span-1">
          <h2 className="text-white text-xl font-semibold uppercase">Categories</h2>
          <ul className="mt-4 space-y-3">
            <li><a href="#" className="hover:text-white">All Products</a></li>
            <li><a href="#" className="hover:text-white">Box Tote</a></li>
            <li><a href="#" className="hover:text-white">Shoulder Bags</a></li>
            <li><a href="#" className="hover:text-white">Sling Bags Crossbody Bags</a></li>
          </ul>
        </div>

        {/* Column 3 - Support */}
        <div className="lg:col-span-1">
          <h2 className="text-white text-xl font-semibold uppercase">CONTACT US</h2>
          <p className="mt-4 text-white">
              Phone :
            </p>
            <a href="tel:9354002399">
                <span>
                +91-9354002399 
                </span>
            </a>
            <p className="mt-4 text-white">
              Email :
            </p>
            <a href="mailto:widevogue@gmail.com">
                <span>
                widevogue@gmail.com
                </span>
            </a>
        </div>

        {/* Column 4 - Newsletter */}
        <div className="lg:col-span-2">
          <h2 className="text-white text-xl font-semibold uppercase">Subscribe Now</h2>
          <p className="mt-4 text-white">Sign up to our mailing list and recieve 10% off your first order. We’ll also keep you updated with the latest news and exclusive offers.</p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 h-10 text-black focus:outline-none"
            />
            <input
              type="submit"
              className="bg-[#211f20] px-4 py-2 h-auto border-[#FFF] border text-white hover:border-[#E1E1E1]"
              value="Submit"
            />
          </form>
        </div>
      </div>

      <div className="mt-10 pt-6 text-center">
      <div className="flex space-x-4 items-center justify-center">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <Facebook className="w-6 h-6 text-gray-400 hover:text-blue-500" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <Instagram className="w-6 h-6 text-gray-400 hover:text-pink-500" />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <Linkedin className="w-6 h-6 text-gray-400 hover:text-blue-700" />
      </a>
    </div>
    </div>

      {/* Footer Bottom */}
      <div className="mt-4 pt-4 text-center">
        <p>Copyright &copy; {year} | Wide Vogue</p>
      </div>
    </div>
  </footer>;
}
 
export default Footer;