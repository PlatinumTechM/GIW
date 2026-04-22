import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  Building2,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Diamond,
  Star,
  Zap,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const floatingShapeVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 180, 360],
    scale: [1, 1.1, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const offices = [
    {
      country: "USA",
      city: "New York",
      address: "World Headquarters",
      email: "info@giwdiamonds.com",
      phone: "+1 (212) 221-0975",
    },
    {
      country: "India",
      city: "Mumbai | Surat | Delhi",
      address: "Regional Office",
      email: "india@giwdiamonds.com",
      phone: "+91 98201 11198",
    },
    {
      country: "UAE",
      city: "Dubai",
      address: "DMCC Business Centre",
      email: "uae@giwdiamonds.com",
      phone: "+971 4 123 4567",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Shapes */}
        <motion.div
          variants={floatingShapeVariants}
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-[#3B82F6]/10 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingShapeVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
          className="absolute top-40 right-20 w-32 h-32 bg-[#1E3A8A]/10 rounded-full blur-2xl"
        />
        <motion.div
          variants={floatingShapeVariants}
          animate="animate"
          style={{ animationDelay: "4s" }}
          className="absolute bottom-40 left-1/4 w-24 h-24 bg-[#3B82F6]/15 rounded-full blur-xl"
        />

        {/* Diamond Icons */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[10%]"
        >
          <Diamond className="w-8 h-8 text-[#3B82F6]/50" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 10, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-60 right-[15%]"
        >
          <Diamond className="w-6 h-6 text-[#1E3A8A]/40" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, 20, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-60 left-[20%]"
        >
          <Sparkles className="w-10 h-10 text-[#3B82F6]/40" />
        </motion.div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#1E3A8A 1px, transparent 1px), linear-gradient(90deg, #1E3A8A 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main Content - Text + Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left Side - Hero Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 pt-8"
          >
            {/* Animated Heading */}
            <motion.div variants={itemVariants}>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#DBEAFE]/50 rounded-full text-[#1E3A8A] text-sm font-medium mb-4 shadow-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Get in Touch</span>
              </motion.span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight"
            >
              Ready To Grow Your{" "}
              <span className="text-[#1E3A8A]">Diamond Business?</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-[#64748B] leading-relaxed max-w-xl"
            >
              Get in touch with GIW for more information on our B2B solutions
              for the diamond and jewelry industry. We are here to assist you.
            </motion.p>

            {/* Contact Info with hover effects */}
            <motion.div variants={containerVariants} className="pt-8 space-y-6">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/10 group-hover:shadow-[#1E3A8A]/20 transition-all"
                >
                  <Mail className="w-6 h-6 text-[#1E3A8A]" />
                </motion.div>
                <div>
                  <p className="text-sm text-[#64748B] uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-[#1E3A8A] font-semibold text-lg group-hover:text-[#3B82F6] transition-colors">
                    info@giwdiamonds.com
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ rotate: -360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/10 group-hover:shadow-[#1E3A8A]/20 transition-all"
                >
                  <Phone className="w-6 h-6 text-[#1E3A8A]" />
                </motion.div>
                <div>
                  <p className="text-sm text-[#64748B] uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-[#1E3A8A] font-semibold text-lg group-hover:text-[#3B82F6] transition-colors">
                    +1 (212) 221-0975
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-xl shadow-[#0F172A]/5 border border-[#E2E8F0]"
              whileHover={{
                boxShadow: "0 25px 50px -12px rgba(30, 58, 138, 0.12)",
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <motion.h2
                  className="text-2xl font-bold text-[#0F172A] flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <Star className="w-6 h-6 text-[#3B82F6]" />
                  Send us a message
                </motion.h2>
                <p className="text-[#64748B] mt-2">
                  We&apos;ll get back to you within 24 hours
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Full Name */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[#0F172A] text-sm font-medium flex items-center gap-1">
                    Full Name
                    <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </motion.div>

                {/* Contact Row */}
                <motion.div
                  variants={itemVariants}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label className="text-[#0F172A] text-sm font-medium flex items-center gap-1">
                      Email
                      <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      className="input-field"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#0F172A] text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      className="input-field"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </motion.div>

                {/* Company */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[#0F172A] text-sm font-medium flex items-center gap-1">
                    Company
                    <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company Ltd"
                  />
                </motion.div>

                {/* Subject */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[#0F172A] text-sm font-medium flex items-center gap-1">
                    Subject
                    <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                  />
                </motion.div>

                {/* Message */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[#0F172A] text-sm font-medium flex items-center gap-1">
                    Message
                    <span className="text-[#EF4444]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements..."
                    rows={4}
                    className="w-full input-field resize-none"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px -10px rgba(30, 58, 138, 0.35)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full py-4 px-6 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-semibold rounded-xl shadow-lg shadow-[#1E3A8A]/25 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 overflow-hidden group hover:shadow-xl hover:shadow-[#1E3A8A]/30"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />

                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Send className="w-5 h-5" />
                        </motion.span>
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="text-center text-[#64748B] text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-[#10B981]" />
                  <span>Your information is securely encrypted</span>
                </motion.p>
              </motion.form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
