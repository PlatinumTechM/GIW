// 17. Galactic Violet & Silver (The Tech-Diamond)
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Diamond, Shield, Globe, BarChart3, ArrowRight, CheckCircle2, Sparkles, TrendingUp, Users, Lock, Eye, FileCheck, Clock, Gem } from "lucide-react";

const Home = () => {
  // Galactic Violet & Silver Theme (The Tech-Diamond)
  const theme = {
    primary: "#020617",
    secondary: "#1E1B4B",
    accent: "#C084FC",
    accentSilver: "#94A3B8",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    border: "#C084FC"
  };
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    { Icon: Shield, title: "Verified Dealers Only", desc: "Rigorous KYC process ensures only legitimate diamond traders on our platform", gradient: "from-emerald-500 to-teal-600", bgGlow: "shadow-emerald-500/20" },
    { Icon: Lock, title: "Secure Transactions", desc: "Escrow-backed payments with bank-grade security for worry-free trading", gradient: "from-blue-500 to-indigo-600", bgGlow: "shadow-blue-500/20" },
    { Icon: Globe, title: "Global Network", desc: "Connect with certified diamond dealers across 50+ countries worldwide", gradient: "from-violet-500 to-purple-600", bgGlow: "shadow-violet-500/20" },
    { Icon: BarChart3, title: "Real-time Analytics", desc: "Track market trends, pricing history, and your portfolio performance", gradient: "from-amber-500 to-orange-600", bgGlow: "shadow-amber-500/20" },
  ];

  const stats = [
    { value: "10K+", label: "Verified Dealers", Icon: Users },
    { value: "$2B+", label: "Annual Volume", Icon: TrendingUp },
    { value: "150+", label: "Countries", Icon: Globe },
    { value: "99.9%", label: "Uptime", Icon: CheckCircle2 },
  ];

  const steps = [
    { step: "01", title: "Register & Verify", desc: "Create your dealer account and complete our comprehensive KYC verification process", Icon: FileCheck },
    { step: "02", title: "Browse & Connect", desc: "Explore certified diamond listings from verified dealers worldwide", Icon: Eye },
    { step: "03", title: "Trade Securely", desc: "Execute trades with escrow protection and real-time payment settlement", Icon: Lock },
  ];

  const securityFeatures = [
    { label: "256-bit SSL Encryption", Icon: Lock },
    { label: "Multi-Factor Auth", Icon: CheckCircle2 },
    { label: "Secure Escrow", Icon: FileCheck },
    { label: "24/7 Monitoring", Icon: Clock },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div ref={containerRef} className="min-h-screen bg-[#020617] overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#1E1B4B] to-[#020617]">
          {/* Diamond Pattern */}
          <motion.div 
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%23C084FC' fill-opacity='0.15'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
          
          {/* Animated Light Orbs */}
          <motion.div 
            animate={{ 
              x: [0, 30, 0], 
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C084FC]/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, -20, 0], 
              y: [0, 20, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#94A3B8]/15 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, 40, 0], 
              y: [0, -40, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#1E1B4B]/40 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full text-sm font-medium text-[#C084FC] mb-8 border border-[#C084FC]/30"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-[#C084FC] rounded-full"
                />
                Premium Diamond Trading Platform
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F8FAFC] mb-6 leading-tight"
              >
                The World's Most
                <br />
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] via-[#94A3B8] to-[#C084FC]"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Trusted Diamond
                </motion.span>
                <br />
                Exchange
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-[#94A3B8] max-w-xl mb-8 leading-relaxed"
              >
                Secure B2B marketplace connecting verified diamond dealers worldwide.
                Transparent pricing, escrow protection, and real-time market analytics.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/register"
                  className="group relative px-8 py-4 bg-[#C084FC] text-[#020617] font-semibold rounded-xl
                    shadow-xl shadow-[#C084FC]/20 hover:shadow-2xl hover:shadow-[#C084FC]/30
                    transition-all duration-300 hover:-translate-y-1
                    flex items-center gap-2 overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-[#94A3B8] to-[#C084FC] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="relative">Start Trading</span>
                  <motion.span
                    className="relative"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
                <Link
                  to="/login"
                  className="group px-8 py-4 border-2 border-[#C084FC]/50 text-[#C084FC] font-semibold rounded-xl
                    hover:border-[#C084FC] hover:bg-[#C084FC]/10
                    transition-all duration-300
                    flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Dealer Login</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Stats with 3D effect */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="hidden lg:grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    z: 50,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="group relative bg-white/5 backdrop-blur-md border border-[#C084FC]/20 rounded-2xl p-6 text-center cursor-pointer shadow-lg shadow-[#C084FC]/10"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#C084FC]/10 to-[#1E1B4B]/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Sparkles className="w-5 h-5 text-[#C084FC]" />
                  </motion.div>
                  <stat.Icon className="w-8 h-8 mx-auto mb-3 text-[#C084FC] group-hover:text-[#94A3B8] transition-colors" />
                  <motion.div
                    className="text-3xl font-bold text-[#F8FAFC] mb-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-[#94A3B8]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#C084FC] rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#C084FC] rounded-full"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-sm font-medium text-[#C084FC] mb-4 border border-[#C084FC]/30">
                <Sparkles className="w-4 h-4" />
                Features
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4"
            >
              Why Diamond Dealers Choose GIW
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[#94A3B8] max-w-2xl mx-auto"
            >
              Trusted by thousands of verified dealers worldwide for secure, transparent, and efficient diamond trading
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -12, 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className={`group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-[#C084FC]/20 shadow-sm cursor-pointer overflow-hidden ${feature.bgGlow} hover:shadow-[#C084FC]/20 hover:shadow-2xl transition-shadow duration-500`}
              >
                {/* Animated gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 bg-gradient-to-br from-[#1E1B4B] to-[#020617] rounded-xl flex items-center justify-center mb-6 group-hover:from-[#C084FC] group-hover:to-[#94A3B8] transition-all duration-500 border border-[#C084FC]/30`}
                >
                  <feature.Icon className="w-7 h-7 text-[#C084FC] group-hover:text-[#020617] transition-colors duration-300" />
                </motion.div>

                <h3 className="text-lg font-semibold text-[#F8FAFC] mb-3 group-hover:text-[#C084FC] transition-colors">{feature.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed group-hover:text-[#F8FAFC] transition-colors">{feature.desc}</p>
                
                {/* Animated corner accent */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-20`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#020617] to-[#1E1B4B] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-sm font-medium text-[#C084FC] mb-4 border border-[#C084FC]/30"
            >
              <Clock className="w-4 h-4" />
              Process
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[#94A3B8] max-w-2xl mx-auto"
            >
              Simple, secure, and transparent process for diamond trading
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-[#C084FC]/30 to-transparent" />
            
            {steps.map((item, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="relative group"
              >
                {/* Step number with animation */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="absolute -top-4 left-0 select-none text-8xl font-bold text-[#C084FC]/10 group-hover:text-[#C084FC]/30 transition-colors"
                >
                  {item.step}
                </motion.div>
                
                <div className="relative pt-16">
                  {/* Icon card */}
                  <motion.div
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="w-16 h-16 bg-gradient-to-br from-[#1E1B4B] to-[#020617] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#C084FC]/20 border border-[#C084FC]/30"
                  >
                    <item.Icon className="w-8 h-8 text-[#C084FC]" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-3 group-hover:text-[#C084FC] transition-colors">{item.title}</h3>
                  <p className="text-[#94A3B8] leading-relaxed">{item.desc}</p>

                  {/* Animated step indicator */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.3 + 0.5, duration: 0.8 }}
                    className="h-1 bg-gradient-to-r from-[#1E1B4B] to-[#C084FC] rounded-full mt-6 opacity-40"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4 bg-[#0f0a1e] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.span
                variants={fadeIn}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-sm font-medium text-[#C084FC] mb-6 border border-[#C084FC]/30"
              >
                <Shield className="w-4 h-4 text-[#C084FC]" />
                Security First
              </motion.span>

              <motion.h2
                variants={slideInLeft}
                className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-6"
              >
                Bank-Grade Security for Your Peace of Mind
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-[#94A3B8] mb-8 leading-relaxed"
              >
                Every transaction on GIW is protected by military-grade encryption, multi-factor authentication, and secure escrow services. Your diamonds and funds are always safe.
              </motion.p>
              
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-2 gap-6"
              >
                {securityFeatures.map((security, index) => (
                  <motion.div 
                    key={index} 
                    variants={scaleIn}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-gradient-to-br from-[#1E1B4B] to-[#020617] rounded-xl flex items-center justify-center group-hover:from-[#C084FC] group-hover:to-[#94A3B8] transition-all duration-300 border border-[#C084FC]/30"
                    >
                      <security.Icon className="w-6 h-6 text-[#C084FC] group-hover:text-[#020617] transition-colors" />
                    </motion.div>
                    <span className="text-sm text-[#94A3B8] font-medium group-hover:text-[#C084FC] transition-colors">{security.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Animated Security Shield */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex justify-center"
            >
              <motion.div 
                animate={{ 
                  rotateY: [0, 10, 0, -10, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              >
                {/* Outer ring with pulse */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 w-80 h-80 bg-gradient-to-br from-[#C084FC]/20 to-[#94A3B8]/10 rounded-full blur-xl"
                />

                <div className="relative w-80 h-80 bg-gradient-to-br from-[#1E1B4B] to-[#020617] rounded-full flex items-center justify-center shadow-2xl border border-[#C084FC]/30">
                  <motion.div
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-2 border-dashed border-[#C084FC]/40 rounded-full"
                  />

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-64 h-64 bg-gradient-to-br from-[#1E1B4B] to-[#020617] rounded-full flex items-center justify-center shadow-xl border border-[#94A3B8]/30"
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="w-48 h-48 bg-gradient-to-br from-[#020617] to-[#1E1B4B] rounded-full flex items-center justify-center shadow-lg border border-[#C084FC]/30"
                    >
                      <Shield className="w-24 h-24 text-[#C084FC]" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Floating orbs */}
                <motion.div
                  animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-20 h-20 bg-[#C084FC]/30 rounded-full blur-xl"
                />
                <motion.div
                  animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#94A3B8]/20 rounded-full blur-xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-[#020617] overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5 }}
            className="relative bg-gradient-to-br from-[#1E1B4B] to-[#020617] rounded-3xl p-10 md:p-16 text-center border border-[#C084FC]/30 shadow-2xl shadow-[#C084FC]/20 overflow-hidden group"
          >
            {/* Animated background gradient */}
            <motion.div
              animate={{
                background: [
                  "linear-gradient(135deg, rgba(192,132,252,0.2) 0%, rgba(2,6,23,0.1) 100%)",
                  "linear-gradient(225deg, rgba(148,163,184,0.2) 0%, rgba(30,27,75,0.1) 100%)",
                  "linear-gradient(135deg, rgba(192,132,252,0.2) 0%, rgba(2,6,23,0.1) 100%)",
                ]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0"
            />
            
            {/* Floating shapes */}
            <motion.div
              animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-20 h-20 bg-[#C084FC]/30 rounded-full opacity-50 blur-xl"
            />
            <motion.div
              animate={{ y: [20, -20, 20], x: [10, -10, 10], rotate: [0, -180, -360] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-10 left-10 w-16 h-16 bg-[#94A3B8]/20 rounded-full opacity-50 blur-xl"
            />
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="relative z-10"
            >
              <motion.div variants={scaleIn} className="mb-4">
                <Diamond className="w-12 h-12 mx-auto text-[#C084FC]" />
              </motion.div>

              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4"
              >
                Ready to Join the Elite?
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-[#94A3B8] text-lg mb-8 max-w-xl mx-auto"
              >
                Join thousands of verified diamond dealers already trading securely on GIW
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="group/btn relative px-8 py-4 bg-[#C084FC] text-[#020617] font-semibold rounded-xl
                      shadow-lg shadow-[#C084FC]/30 hover:shadow-2xl hover:shadow-[#C084FC]/40
                      transition-all duration-300
                      flex items-center gap-2 overflow-hidden"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-[#94A3B8] to-[#C084FC] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                    />
                    <span className="relative">Apply for Membership</span>
                    <motion.span
                      className="relative"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="#"
                    className="group px-8 py-4 border-2 border-[#94A3B8]/50 text-[#94A3B8] font-semibold rounded-xl
                      hover:border-[#C084FC] hover:bg-[#C084FC]/10 hover:text-[#C084FC]
                      transition-all duration-300"
                  >
                    Learn More
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default Home;
