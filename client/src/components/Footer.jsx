import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Diamond, 
  MapPin, 
  Mail, 
  Phone, 
  Share2, 
  Send, 
  Globe, 
  Camera,
  ArrowUpRight
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "#" },
    { label: "Services", path: "#" },
    { label: "Contact", path: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", path: "#" },
    { label: "Terms of Use", path: "#" },
    { label: "Cookie Policy", path: "#" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <footer className="bg-[#d9f0fa] border-t-4 border-[#2e7c9e]">
      {/* Main Footer Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-[#2e7c9e] icon-rectangle-3d flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
                <Diamond className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-black tracking-tighter">
                  GIW
                </span>
                <p className="text-[10px] text-[#2e7c9e] font-bold tracking-[0.2em] uppercase leading-none">
                  Diamond Exchange
                </p>
              </div>
            </Link>
            <p className="text-black/80 text-sm leading-relaxed mb-8">
              The world's most trusted B2B diamond marketplace. Providing secure, 
              transparent, and premium trading solutions for verified dealers globally.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[
                { Icon: Share2, href: "#" },
                { Icon: Send, href: "#" },
                { Icon: Globe, href: "#" },
                { Icon: Camera, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ 
                    y: -4, 
                    scale: 1.05,
                    backgroundColor: "#2e7c9e",
                    color: "#ffffff",
                    boxShadow: "0px 0px 0px rgba(0,0,0,0)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 icon-rectangle-3d bg-white text-[#2e7c9e] flex items-center justify-center transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7c9e] focus-visible:ring-offset-2"
                >
                  <social.Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-black text-black uppercase tracking-widest mb-8 border-b-2 border-[#2e7c9e] inline-block pb-1">
              Navigation
            </h4>
            <ul className="space-y-6">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-black/70 hover:text-[#2e7c9e] text-sm font-extrabold transition-all duration-200 flex items-center gap-3 group focus-visible:outline-none focus-visible:text-[#2e7c9e] focus-visible:translate-x-1"
                  >
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-black text-black uppercase tracking-widest mb-8 border-b-2 border-[#2e7c9e] inline-block pb-1">
              Get In Touch
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 icon-rectangle-3d bg-white text-[#2e7c9e] flex-shrink-0 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-black/80 text-sm leading-relaxed">
                  123 Diamond Tower,
                  <br />
                  Surat, Gujarat 395001
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 icon-rectangle-3d bg-white text-[#2e7c9e] flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Mail className="w-5 h-5" />
                </div>
                <a
                  href="mailto:contact@giw.exchange"
                  className="text-black/80 hover:text-[#2e7c9e] text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2e7c9e] rounded"
                >
                  contact@giw.exchange
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 icon-rectangle-3d bg-white text-[#2e7c9e] flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Phone className="w-5 h-5" />
                </div>
                <a
                  href="tel:+911234567890"
                  className="text-black/80 hover:text-[#2e7c9e] text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2e7c9e] rounded"
                >
                  +91 123 456 7890
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Legal Section */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-black text-black uppercase tracking-widest mb-8 border-b-2 border-[#2e7c9e] inline-block pb-1">
              Legal Desk
            </h4>
            <ul className="space-y-4">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-black/70 hover:text-[#2e7c9e] text-sm font-bold transition-all duration-200 flex items-center gap-3 group focus-visible:outline-none focus-visible:text-[#2e7c9e]"
                  >
                    <div className="w-1.5 h-4 bg-[#2e7c9e] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-[#2e7c9e]/20 bg-[#2e7c9e]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-black/60 text-sm font-medium">
              © {currentYear} GIW Diamond Exchange. Built for Premium Trading.
            </p>
            <div className="flex items-center gap-8">
              <Link
                to="/login"
                className="text-black/60 hover:text-[#2e7c9e] text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2e7c9e] px-2 py-1 rounded"
              >
                Dealer Login
              </Link>
              <Link
                to="/register"
                className="text-black/60 hover:text-[#2e7c9e] text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2e7c9e] px-2 py-1 rounded"
              >
                Join Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
