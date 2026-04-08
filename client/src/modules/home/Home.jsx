// A. Black + Gold + White
// import { Link } from "react-router-dom";
// import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
// import { useRef, useEffect, useState } from "react";
// import { Diamond, Shield, Globe, BarChart3, ArrowRight, CheckCircle2, Sparkles, TrendingUp, Users, Lock, Eye, FileCheck, Clock } from "lucide-react";

// const Home = () => {
//   const containerRef = useRef(null);
//   const heroRef = useRef(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
//   const { scrollYProgress } = useScroll({ target: containerRef });
//   const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
//   const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   const features = [
//     { Icon: Shield, title: "Verified Dealers Only", desc: "Rigorous KYC process ensures only legitimate diamond traders on our platform", gradient: "from-emerald-500 to-teal-600", bgGlow: "shadow-emerald-500/20" },
//     { Icon: Lock, title: "Secure Transactions", desc: "Escrow-backed payments with bank-grade security for worry-free trading", gradient: "from-blue-500 to-indigo-600", bgGlow: "shadow-blue-500/20" },
//     { Icon: Globe, title: "Global Network", desc: "Connect with certified diamond dealers across 50+ countries worldwide", gradient: "from-violet-500 to-purple-600", bgGlow: "shadow-violet-500/20" },
//     { Icon: BarChart3, title: "Real-time Analytics", desc: "Track market trends, pricing history, and your portfolio performance", gradient: "from-amber-500 to-orange-600", bgGlow: "shadow-amber-500/20" },
//   ];

//   const stats = [
//     { value: "10K+", label: "Verified Dealers", Icon: Users },
//     { value: "$2B+", label: "Annual Volume", Icon: TrendingUp },
//     { value: "150+", label: "Countries", Icon: Globe },
//     { value: "99.9%", label: "Uptime", Icon: CheckCircle2 },
//   ];

//   const steps = [
//     { step: "01", title: "Register & Verify", desc: "Create your dealer account and complete our comprehensive KYC verification process", Icon: FileCheck },
//     { step: "02", title: "Browse & Connect", desc: "Explore certified diamond listings from verified dealers worldwide", Icon: Eye },
//     { step: "03", title: "Trade Securely", desc: "Execute trades with escrow protection and real-time payment settlement", Icon: Lock },
//   ];

//   const securityFeatures = [
//     { label: "256-bit SSL Encryption", Icon: Lock },
//     { label: "Multi-Factor Auth", Icon: CheckCircle2 },
//     { label: "Secure Escrow", Icon: FileCheck },
//     { label: "24/7 Monitoring", Icon: Clock },
//   ];

//   // Animation variants
//   const fadeInUp = {
//     hidden: { opacity: 0, y: 60 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
//   };

//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.6 } }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
//   };

//   const scaleIn = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
//   };

//   const slideInLeft = {
//     hidden: { opacity: 0, x: -100 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
//   };

//   const slideInRight = {
//     hidden: { opacity: 0, x: 100 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
//   };

//   return (
//     <motion.div ref={containerRef} className="min-h-screen bg-white overflow-x-hidden">
//       {/* Hero Section */}
//       <motion.section 
//         ref={heroRef}
//         style={{ opacity: heroOpacity, scale: heroScale }}
//         className="relative min-h-screen flex items-center overflow-hidden"
//       >
//         {/* Animated Background */}
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//           {/* Diamond Pattern */}
//           <motion.div 
//             animate={{ 
//               backgroundPosition: ["0% 0%", "100% 100%"],
//             }}
//             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             className="absolute inset-0 opacity-10"
//             style={{
//               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
//               backgroundSize: "60px 60px",
//             }}
//           />
          
//           {/* Animated Light Orbs */}
//           <motion.div 
//             animate={{ 
//               x: [0, 30, 0], 
//               y: [0, -30, 0],
//               scale: [1, 1.2, 1]
//             }}
//             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//             className="absolute top-1/4 right-1/4 w-96 h-96 bg-slate-600/30 rounded-full blur-3xl" 
//           />
//           <motion.div 
//             animate={{ 
//               x: [0, -20, 0], 
//               y: [0, 20, 0],
//               scale: [1, 1.3, 1]
//             }}
//             transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
//             className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-slate-500/20 rounded-full blur-3xl" 
//           />
//           <motion.div 
//             animate={{ 
//               x: [0, 40, 0], 
//               y: [0, -40, 0],
//             }}
//             transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
//             className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" 
//           />
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             {/* Left Content */}
//             <motion.div 
//               initial="hidden"
//               animate="visible"
//               variants={staggerContainer}
//               className="text-center lg:text-left"
//             >
//               <motion.div 
//                 variants={fadeInUp}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full text-sm font-medium text-slate-300 mb-8 border border-slate-700"
//               >
//                 <motion.span 
//                   animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="w-2 h-2 bg-emerald-500 rounded-full" 
//                 />
//                 Premium Diamond Trading Platform
//               </motion.div>

//               <motion.h1 
//                 variants={fadeInUp}
//                 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
//               >
//                 The World's Most
//                 <br />
//                 <motion.span 
//                   className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500"
//                   animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
//                   transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
//                   style={{ backgroundSize: "200% 200%" }}
//                 >
//                   Trusted Diamond
//                 </motion.span>
//                 <br />
//                 Exchange
//               </motion.h1>

//               <motion.p 
//                 variants={fadeInUp}
//                 className="text-lg text-slate-400 max-w-xl mb-8 leading-relaxed"
//               >
//                 Secure B2B marketplace connecting verified diamond dealers worldwide.
//                 Transparent pricing, escrow protection, and real-time market analytics.
//               </motion.p>

//               <motion.div 
//                 variants={fadeInUp}
//                 className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
//               >
//                 <Link
//                   to="/register"
//                   className="group relative px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl
//                     shadow-xl shadow-white/10 hover:shadow-2xl hover:shadow-white/20
//                     transition-all duration-300 hover:-translate-y-1
//                     flex items-center gap-2 overflow-hidden"
//                 >
//                   <motion.span
//                     className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"
//                   />
//                   <span className="relative">Start Trading</span>
//                   <motion.span
//                     className="relative"
//                     whileHover={{ x: 5 }}
//                     transition={{ type: "spring", stiffness: 400 }}
//                   >
//                     <ArrowRight className="w-5 h-5" />
//                   </motion.span>
//                 </Link>
//                 <Link
//                   to="/login"
//                   className="group px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-xl
//                     hover:border-slate-400 hover:bg-slate-800/50
//                     transition-all duration-300
//                     flex items-center gap-2"
//                 >
//                   <Users className="w-5 h-5" />
//                   <span>Dealer Login</span>
//                 </Link>
//               </motion.div>
//             </motion.div>

//             {/* Right Stats with 3D effect */}
//             <motion.div 
//               initial="hidden"
//               animate="visible"
//               variants={staggerContainer}
//               className="hidden lg:grid grid-cols-2 gap-6"
//             >
//               {stats.map((stat, index) => (
//                 <motion.div
//                   key={index}
//                   variants={scaleIn}
//                   whileHover={{ 
//                     scale: 1.05, 
//                     rotateY: 5,
//                     z: 50,
//                     transition: { type: "spring", stiffness: 300 }
//                   }}
//                   className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 text-center cursor-pointer"
//                   style={{ transformStyle: "preserve-3d", perspective: 1000 }}
//                 >
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
//                   />
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                     className="absolute -top-2 -right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <Sparkles className="w-5 h-5 text-emerald-400" />
//                   </motion.div>
//                   <stat.Icon className="w-8 h-8 mx-auto mb-3 text-slate-400 group-hover:text-emerald-400 transition-colors" />
//                   <motion.div 
//                     className="text-3xl font-bold text-white mb-1"
//                     whileHover={{ scale: 1.1 }}
//                   >
//                     {stat.value}
//                   </motion.div>
//                   <div className="text-sm text-slate-400">{stat.label}</div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>

//           {/* Mobile Stats */}
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.8 }}
//             className="lg:hidden grid grid-cols-2 gap-4 mt-12"
//           >
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.02 }}
//                 className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center"
//               >
//                 <stat.Icon className="w-6 h-6 mx-auto mb-2 text-slate-400" />
//                 <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
//                 <div className="text-xs text-slate-400">{stat.label}</div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>

//         {/* Animated Scroll Indicator */}
//         <motion.div 
//           animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
//           transition={{ duration: 2, repeat: Infinity }}
//           className="absolute bottom-8 left-1/2 -translate-x-1/2"
//         >
//           <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center pt-2">
//             <motion.div 
//               animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
//               transition={{ duration: 1.5, repeat: Infinity }}
//               className="w-1.5 h-1.5 bg-emerald-400 rounded-full" 
//             />
//           </div>
//         </motion.div>
//       </motion.section>

//       {/* Features Section */}
//       <section className="py-24 px-4 bg-slate-50">
//         <div className="max-w-7xl mx-auto">
//           <motion.div 
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={staggerContainer}
//             className="text-center mb-16"
//           >
//             <motion.div variants={fadeInUp}>
//               <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-200/50 rounded-full text-sm font-medium text-slate-600 mb-4">
//                 <Sparkles className="w-4 h-4" />
//                 Features
//               </span>
//             </motion.div>
//             <motion.h2 
//               variants={fadeInUp}
//               className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
//             >
//               Why Diamond Dealers Choose GIW
//             </motion.h2>
//             <motion.p 
//               variants={fadeInUp}
//               className="text-slate-500 max-w-2xl mx-auto"
//             >
//               Trusted by thousands of verified dealers worldwide for secure, transparent, and efficient diamond trading
//             </motion.p>
//           </motion.div>

//           <motion.div 
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-50px" }}
//             variants={staggerContainer}
//             className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
//           >
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 variants={fadeInUp}
//                 whileHover={{ 
//                   y: -12, 
//                   scale: 1.02,
//                   transition: { type: "spring", stiffness: 300, damping: 20 }
//                 }}
//                 className={`group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm cursor-pointer overflow-hidden ${feature.bgGlow} hover:shadow-2xl transition-shadow duration-500`}
//               >
//                 {/* Animated gradient background on hover */}
//                 <motion.div
//                   className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
//                 />
                
//                 <motion.div 
//                   whileHover={{ rotate: 360, scale: 1.1 }}
//                   transition={{ duration: 0.6 }}
//                   className={`w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-6 group-hover:from-slate-900 group-hover:to-slate-800 transition-all duration-500`}
//                 >
//                   <feature.Icon className="w-7 h-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
//                 </motion.div>
                
//                 <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">{feature.title}</h3>
//                 <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-600 transition-colors">{feature.desc}</p>
                
//                 {/* Animated corner accent */}
//                 <motion.div
//                   initial={{ scale: 0, opacity: 0 }}
//                   whileHover={{ scale: 1, opacity: 1 }}
//                   className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-20`}
//                 />
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-24 px-4 bg-white overflow-hidden">
//         <div className="max-w-7xl mx-auto">
//           <motion.div 
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={staggerContainer}
//             className="text-center mb-16"
//           >
//             <motion.span 
//               variants={fadeInUp}
//               className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600 mb-4"
//             >
//               <Clock className="w-4 h-4" />
//               Process
//             </motion.span>
//             <motion.h2 
//               variants={fadeInUp}
//               className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
//             >
//               How It Works
//             </motion.h2>
//             <motion.p 
//               variants={fadeInUp}
//               className="text-slate-500 max-w-2xl mx-auto"
//             >
//               Simple, secure, and transparent process for diamond trading
//             </motion.p>
//           </motion.div>

//           <motion.div 
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-50px" }}
//             variants={staggerContainer}
//             className="grid md:grid-cols-3 gap-8 relative"
//           >
//             {/* Connection line */}
//             <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            
//             {steps.map((item, index) => (
//               <motion.div 
//                 key={index} 
//                 variants={fadeInUp}
//                 className="relative group"
//               >
//                 {/* Step number with animation */}
//                 <motion.div 
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.2, duration: 0.5 }}
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   className="absolute -top-4 left-0 select-none text-8xl font-bold text-slate-100 group-hover:text-slate-200 transition-colors"
//                 >
//                   {item.step}
//                 </motion.div>
                
//                 <div className="relative pt-16">
//                   {/* Icon card */}
//                   <motion.div
//                     whileHover={{ y: -5, scale: 1.05 }}
//                     className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20"
//                   >
//                     <item.Icon className="w-8 h-8 text-white" />
//                   </motion.div>
                  
//                   <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">{item.title}</h3>
//                   <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                  
//                   {/* Animated step indicator */}
//                   <motion.div
//                     initial={{ width: 0 }}
//                     whileInView={{ width: "100%" }}
//                     viewport={{ once: true }}
//                     transition={{ delay: index * 0.3 + 0.5, duration: 0.8 }}
//                     className="h-1 bg-gradient-to-r from-slate-400 to-emerald-400 rounded-full mt-6 opacity-30"
//                   />
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Trust Section */}
//       <section className="py-24 px-4 bg-slate-900 overflow-hidden">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, margin: "-100px" }}
//               variants={staggerContainer}
//             >
//               <motion.span 
//                 variants={fadeIn}
//                 className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-800 rounded-full text-sm font-medium text-slate-300 mb-6"
//               >
//                 <Shield className="w-4 h-4 text-emerald-400" />
//                 Security First
//               </motion.span>
              
//               <motion.h2 
//                 variants={slideInLeft}
//                 className="text-3xl md:text-4xl font-bold text-white mb-6"
//               >
//                 Bank-Grade Security for Your Peace of Mind
//               </motion.h2>
              
//               <motion.p 
//                 variants={fadeInUp}
//                 className="text-slate-400 mb-8 leading-relaxed"
//               >
//                 Every transaction on GIW is protected by military-grade encryption, multi-factor authentication, and secure escrow services. Your diamonds and funds are always safe.
//               </motion.p>
              
//               <motion.div 
//                 variants={staggerContainer}
//                 className="grid grid-cols-2 gap-6"
//               >
//                 {securityFeatures.map((security, index) => (
//                   <motion.div 
//                     key={index} 
//                     variants={scaleIn}
//                     whileHover={{ scale: 1.05, x: 5 }}
//                     className="flex items-center gap-3 group cursor-pointer"
//                   >
//                     <motion.div 
//                       whileHover={{ rotate: 360 }}
//                       transition={{ duration: 0.5 }}
//                       className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl flex items-center justify-center group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300"
//                     >
//                       <security.Icon className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
//                     </motion.div>
//                     <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{security.label}</span>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </motion.div>
            
//             {/* Animated Security Shield */}
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.5 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//               className="hidden lg:flex justify-center"
//             >
//               <motion.div 
//                 animate={{ 
//                   rotateY: [0, 10, 0, -10, 0],
//                 }}
//                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//                 className="relative"
//                 style={{ transformStyle: "preserve-3d", perspective: 1000 }}
//               >
//                 {/* Outer ring with pulse */}
//                 <motion.div
//                   animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
//                   transition={{ duration: 3, repeat: Infinity }}
//                   className="absolute inset-0 w-80 h-80 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-full blur-xl"
//                 />
                
//                 <div className="relative w-80 h-80 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-2xl">
//                   <motion.div 
//                     animate={{ rotateZ: 360 }}
//                     transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
//                     className="absolute inset-4 border-2 border-dashed border-slate-600/50 rounded-full"
//                   />
                  
//                   <motion.div 
//                     whileHover={{ scale: 1.1 }}
//                     className="w-64 h-64 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-xl"
//                   >
//                     <motion.div 
//                       whileHover={{ rotate: 15 }}
//                       className="w-48 h-48 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center shadow-lg"
//                     >
//                       <Shield className="w-24 h-24 text-white" />
//                     </motion.div>
//                   </motion.div>
//                 </div>
                
//                 {/* Floating orbs */}
//                 <motion.div 
//                   animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
//                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
//                   className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/30 rounded-full blur-xl" 
//                 />
//                 <motion.div 
//                   animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
//                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//                   className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-500/30 rounded-full blur-xl" 
//                 />
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 px-4 bg-slate-50 overflow-hidden">
//         <div className="max-w-4xl mx-auto">
//           <motion.div 
//             initial={{ opacity: 0, y: 50, scale: 0.95 }}
//             whileInView={{ opacity: 1, y: 0, scale: 1 }}
//             viewport={{ once: true, margin: "-100px" }}
//             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//             whileHover={{ y: -5 }}
//             className="relative bg-white rounded-3xl p-10 md:p-16 text-center border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden group"
//           >
//             {/* Animated background gradient */}
//             <motion.div
//               animate={{ 
//                 background: [
//                   "linear-gradient(135deg, rgba(16,185,129,0.03) 0%, rgba(59,130,246,0.03) 100%)",
//                   "linear-gradient(225deg, rgba(16,185,129,0.03) 0%, rgba(59,130,246,0.03) 100%)",
//                   "linear-gradient(135deg, rgba(16,185,129,0.03) 0%, rgba(59,130,246,0.03) 100%)",
//                 ]
//               }}
//               transition={{ duration: 5, repeat: Infinity }}
//               className="absolute inset-0"
//             />
            
//             {/* Floating shapes */}
//             <motion.div
//               animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [0, 180, 360] }}
//               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//               className="absolute top-10 right-10 w-20 h-20 bg-slate-100 rounded-full opacity-50 blur-xl"
//             />
//             <motion.div
//               animate={{ y: [20, -20, 20], x: [10, -10, 10], rotate: [0, -180, -360] }}
//               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
//               className="absolute bottom-10 left-10 w-16 h-16 bg-slate-200 rounded-full opacity-50 blur-xl"
//             />
            
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={staggerContainer}
//               className="relative z-10"
//             >
//               <motion.div variants={scaleIn} className="mb-4">
//                 <Diamond className="w-12 h-12 mx-auto text-slate-900" />
//               </motion.div>
              
//               <motion.h2 
//                 variants={fadeInUp}
//                 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
//               >
//                 Ready to Join the Elite?
//               </motion.h2>
              
//               <motion.p 
//                 variants={fadeInUp}
//                 className="text-slate-500 text-lg mb-8 max-w-xl mx-auto"
//               >
//                 Join thousands of verified diamond dealers already trading securely on GIW
//               </motion.p>
              
//               <motion.div 
//                 variants={fadeInUp}
//                 className="flex flex-col sm:flex-row items-center justify-center gap-4"
//               >
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
//                   <Link
//                     to="/register"
//                     className="group/btn relative px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl
//                       shadow-lg shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30
//                       transition-all duration-300
//                       flex items-center gap-2 overflow-hidden"
//                   >
//                     <motion.span
//                       className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
//                     />
//                     <span className="relative">Apply for Membership</span>
//                     <motion.span
//                       className="relative"
//                       animate={{ x: [0, 5, 0] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                     >
//                       <ArrowRight className="w-5 h-5" />
//                     </motion.span>
//                   </Link>
//                 </motion.div>
                
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
//                   <a
//                     href="#"
//                     className="group px-8 py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl
//                       hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900
//                       transition-all duration-300"
//                   >
//                     Learn More
//                   </a>
//                 </motion.div>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//     </motion.div>
//   );
// };

// export default Home;





// B. Charcoal + Champagne Gold

// import { Link } from "react-router-dom";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef } from "react";
// import {
//   Diamond,
//   Shield,
//   Globe,
//   BarChart3,
//   ArrowRight,
//   CheckCircle2,
//   Sparkles,
//   TrendingUp,
//   Users,
//   Lock,
//   Eye,
//   FileCheck,
//   Clock,
// } from "lucide-react";

// const Home = () => {
//   const containerRef = useRef(null);
//   const heroRef = useRef(null);

//   const { scrollYProgress } = useScroll({ target: containerRef });
//   const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
//   const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.94]);

//   const features = [
//     {
//       Icon: Shield,
//       title: "Verified Dealers Only",
//       desc: "Strict KYC and business verification ensures only trusted diamond traders join the platform.",
//     },
//     {
//       Icon: Lock,
//       title: "Secure Transactions",
//       desc: "Protected trading workflow with secure payment handling and enterprise-grade security.",
//     },
//     {
//       Icon: Globe,
//       title: "Global Diamond Network",
//       desc: "Expand your reach by connecting with premium dealers and buyers across international markets.",
//     },
//     {
//       Icon: BarChart3,
//       title: "Market Insights",
//       desc: "Track pricing, business activity, and trading performance through elegant analytics dashboards.",
//     },
//   ];

//   const stats = [
//     { value: "10K+", label: "Verified Dealers", Icon: Users },
//     { value: "$2B+", label: "Annual Volume", Icon: TrendingUp },
//     { value: "150+", label: "Countries", Icon: Globe },
//     { value: "99.9%", label: "Platform Uptime", Icon: CheckCircle2 },
//   ];

//   const steps = [
//     {
//       step: "01",
//       title: "Register & Verify",
//       desc: "Create your account and complete the dealer verification process for trusted access.",
//       Icon: FileCheck,
//     },
//     {
//       step: "02",
//       title: "Explore Listings",
//       desc: "Browse premium diamond listings and connect directly with verified industry members.",
//       Icon: Eye,
//     },
//     {
//       step: "03",
//       title: "Trade With Confidence",
//       desc: "Complete secure business transactions with transparency and professional workflow support.",
//       Icon: Lock,
//     },
//   ];

//   const securityFeatures = [
//     { label: "256-bit SSL Security", Icon: Lock },
//     { label: "Multi-Factor Access", Icon: CheckCircle2 },
//     { label: "Verified Business Profiles", Icon: FileCheck },
//     { label: "24/7 Platform Monitoring", Icon: Clock },
//   ];

//   const fadeInUp = {
//     hidden: { opacity: 0, y: 60 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
//     },
//   };

//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.6 } },
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.12, delayChildren: 0.1 },
//     },
//   };

//   const scaleIn = {
//     hidden: { opacity: 0, scale: 0.88 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
//     },
//   };

//   const slideInLeft = {
//     hidden: { opacity: 0, x: -100 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
//     },
//   };

//   return (
//     <motion.div ref={containerRef} className="min-h-screen bg-[#0B0B0C] overflow-x-hidden text-white">
//       {/* Hero Section */}
//       <motion.section
//         ref={heroRef}
//         style={{ opacity: heroOpacity, scale: heroScale }}
//         className="relative min-h-screen flex items-center overflow-hidden"
//       >
//         {/* Background */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.10),transparent_25%),linear-gradient(to_bottom_right,#0B0B0C,#111114,#0B0B0C)]" />

//         {/* Pattern */}
//         <div
//           className="absolute inset-0 opacity-[0.06]"
//           style={{
//             backgroundImage:
//               "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%23D4AF37' fill-opacity='1'/%3E%3C/svg%3E\")",
//             backgroundSize: "80px 80px",
//           }}
//         />

//         {/* Glow orbs */}
//         <motion.div
//           animate={{ x: [0, 20, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
//           transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute top-24 right-20 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl"
//         />
//         <motion.div
//           animate={{ x: [0, -20, 0], y: [0, 25, 0], scale: [1, 1.2, 1] }}
//           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl"
//         />

//         <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 py-28 sm:px-6 lg:grid-cols-2 lg:px-8">
//           {/* Left Content */}
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={staggerContainer}
//             className="text-center lg:text-left"
//           >
//             <motion.div
//               variants={fadeInUp}
//               className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#131316]/80 px-4 py-2 text-sm font-medium text-[#F5E6B3] backdrop-blur-xl"
//             >
//               <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
//               Premium Diamond Trading Platform
//             </motion.div>

//             <motion.h1
//               variants={fadeInUp}
//               className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
//             >
//               Luxury Diamond
//               <br />
//               <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5E6B3] to-[#D4AF37] bg-clip-text text-transparent">
//                 Trading Experience
//               </span>
//               <br />
//               Built for Trust
//             </motion.h1>

//             <motion.p
//               variants={fadeInUp}
//               className="mb-8 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
//             >
//               A refined B2B platform for diamond businesses to connect, trade, and
//               grow with confidence. Elegant interface, secure workflows, and a
//               premium digital experience tailored for the diamond industry.
//             </motion.p>

//             <motion.div
//               variants={fadeInUp}
//               className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
//             >
//               <Link
//                 to="/register"
//                 className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b89221] px-8 py-4 font-semibold text-black shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(212,175,55,0.35)]"
//               >
//                 Start Trading
//                 <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
//               </Link>

//               <Link
//                 to="/login"
//                 className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-white/5 px-8 py-4 font-semibold text-[#F5E6B3] backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
//               >
//                 <Users className="h-5 w-5" />
//                 Dealer Login
//               </Link>
//             </motion.div>
//           </motion.div>

//           {/* Right Side Stats */}
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={staggerContainer}
//             className="grid grid-cols-2 gap-5"
//           >
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 variants={scaleIn}
//                 whileHover={{ y: -8, scale: 1.03 }}
//                 className="group rounded-2xl border border-[#D4AF37]/15 bg-[#131316]/85 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-[0_12px_45px_rgba(212,175,55,0.08)]"
//               >
//                 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
//                   <stat.Icon className="h-6 w-6" />
//                 </div>
//                 <div className="mb-1 text-3xl font-bold text-white">{stat.value}</div>
//                 <div className="text-sm text-zinc-400">{stat.label}</div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>

//         {/* Scroll */}
//         <motion.div
//           animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
//           transition={{ duration: 2, repeat: Infinity }}
//           className="absolute bottom-8 left-1/2 -translate-x-1/2"
//         >
//           <div className="flex h-10 w-6 justify-center rounded-full border-2 border-[#D4AF37]/60 pt-2">
//             <motion.div
//               animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
//               transition={{ duration: 1.5, repeat: Infinity }}
//               className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]"
//             />
//           </div>
//         </motion.div>
//       </motion.section>

//       {/* Features */}
//       <section className="bg-[#0F0F11] px-4 py-24">
//         <div className="mx-auto max-w-7xl">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={staggerContainer}
//             className="mb-16 text-center"
//           >
//             <motion.div variants={fadeInUp}>
//               <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#131316] px-4 py-1.5 text-sm font-medium text-[#F5E6B3]">
//                 <Sparkles className="h-4 w-4 text-[#D4AF37]" />
//                 Platform Features
//               </span>
//             </motion.div>

//             <motion.h2
//               variants={fadeInUp}
//               className="mb-4 text-3xl font-bold text-white md:text-4xl"
//             >
//               Built for Modern Diamond Businesses
//             </motion.h2>

//             <motion.p
//               variants={fadeInUp}
//               className="mx-auto max-w-2xl text-zinc-400"
//             >
//               Every section is designed to reflect trust, elegance, and premium
//               business value for the diamond market.
//             </motion.p>
//           </motion.div>

//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-50px" }}
//             variants={staggerContainer}
//             className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
//           >
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 variants={fadeInUp}
//                 whileHover={{ y: -10 }}
//                 className="group relative overflow-hidden rounded-2xl border border-[#D4AF37]/15 bg-[#131316] p-8 transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-[0_15px_40px_rgba(212,175,55,0.08)]"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

//                 <div className="relative z-10">
//                   <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-black">
//                     <feature.Icon className="h-7 w-7" />
//                   </div>

//                   <h3 className="mb-3 text-lg font-semibold text-white">
//                     {feature.title}
//                   </h3>
//                   <p className="text-sm leading-relaxed text-zinc-400">
//                     {feature.desc}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Process */}
//       <section className="bg-[#0B0B0C] px-4 py-24">
//         <div className="mx-auto max-w-7xl">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={staggerContainer}
//             className="mb-16 text-center"
//           >
//             <motion.span
//               variants={fadeInUp}
//               className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#131316] px-4 py-1.5 text-sm font-medium text-[#F5E6B3]"
//             >
//               <Clock className="h-4 w-4 text-[#D4AF37]" />
//               Process
//             </motion.span>

//             <motion.h2
//               variants={fadeInUp}
//               className="mb-4 text-3xl font-bold text-white md:text-4xl"
//             >
//               How the Platform Works
//             </motion.h2>

//             <motion.p
//               variants={fadeInUp}
//               className="mx-auto max-w-2xl text-zinc-400"
//             >
//               A seamless trading journey designed to feel professional, secure, and efficient.
//             </motion.p>
//           </motion.div>

//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-50px" }}
//             variants={staggerContainer}
//             className="relative grid gap-8 md:grid-cols-3"
//           >
//             <div className="absolute left-1/4 right-1/4 top-24 hidden h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent md:block" />

//             {steps.map((item, index) => (
//               <motion.div key={index} variants={fadeInUp} className="group relative">
//                 <div className="absolute -top-3 left-0 text-7xl font-bold text-[#1D1D21] transition-colors duration-300 group-hover:text-[#2A2A2F]">
//                   {item.step}
//                 </div>

//                 <div className="relative pt-16">
//                   <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#b89221] text-black shadow-[0_10px_30px_rgba(212,175,55,0.25)]">
//                     <item.Icon className="h-8 w-8" />
//                   </div>

//                   <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
//                   <p className="leading-relaxed text-zinc-400">{item.desc}</p>

//                   <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-[#D4AF37]/80 to-[#F5E6B3]/30" />
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Security Section */}
//       <section className="bg-[#111114] px-4 py-24 overflow-hidden">
//         <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={staggerContainer}
//           >
//             <motion.span
//               variants={fadeIn}
//               className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#131316] px-4 py-1.5 text-sm font-medium text-[#F5E6B3]"
//             >
//               <Shield className="h-4 w-4 text-[#D4AF37]" />
//               Security First
//             </motion.span>

//             <motion.h2
//               variants={slideInLeft}
//               className="mb-6 text-3xl font-bold text-white md:text-4xl"
//             >
//               Premium Protection for Every Business Transaction
//             </motion.h2>

//             <motion.p
//               variants={fadeInUp}
//               className="mb-8 leading-relaxed text-zinc-400"
//             >
//               Your business reputation matters. That’s why the platform is designed
//               with trusted access control, secure data handling, and reliable dealer verification.
//             </motion.p>

//             <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {securityFeatures.map((security, index) => (
//                 <motion.div
//                   key={index}
//                   variants={scaleIn}
//                   whileHover={{ x: 5, scale: 1.02 }}
//                   className="flex items-center gap-3 rounded-xl border border-[#D4AF37]/10 bg-[#131316] p-4 transition-all duration-300 hover:border-[#D4AF37]/30"
//                 >
//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
//                     <security.Icon className="h-5 w-5" />
//                   </div>
//                   <span className="text-sm font-medium text-zinc-200">{security.label}</span>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>

//           {/* Shield Visual */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.75 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="hidden justify-center lg:flex"
//           >
//             <motion.div
//               animate={{ rotateY: [0, 10, 0, -10, 0] }}
//               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//               className="relative"
//               style={{ transformStyle: "preserve-3d", perspective: 1000 }}
//             >
//               <div className="absolute inset-0 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />
//               <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-gradient-to-br from-[#1A1A1D] to-[#111114] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
//                   className="absolute inset-5 rounded-full border border-dashed border-[#D4AF37]/20"
//                 />
//                 <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b89221] shadow-[0_10px_40px_rgba(212,175,55,0.25)]">
//                   <Shield className="h-24 w-24 text-black" />
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-[#0B0B0C] px-4 py-24">
//         <div className="mx-auto max-w-5xl">
//           <motion.div
//             initial={{ opacity: 0, y: 50, scale: 0.96 }}
//             whileInView={{ opacity: 1, y: 0, scale: 1 }}
//             viewport={{ once: true, margin: "-100px" }}
//             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//             className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-[#131316] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-16"
//           >
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_20%)]" />

//             <div className="relative z-10">
//               <div className="mb-4 flex justify-center">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
//                   <Diamond className="h-8 w-8" />
//                 </div>
//               </div>

//               <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
//                 Ready to Elevate Your Diamond Business?
//               </h2>

//               <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
//                 Join a premium platform crafted for trusted dealers, elegant business presentation, and secure growth.
//               </p>

//               <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
//                 <Link
//                   to="/register"
//                   className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b89221] px-8 py-4 font-semibold text-black shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(212,175,55,0.35)]"
//                 >
//                   Apply for Membership
//                   <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
//                 </Link>

//                 <a
//                   href="#"
//                   className="rounded-xl border border-[#D4AF37]/30 bg-white/5 px-8 py-4 font-semibold text-[#F5E6B3] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
//                 >
//                   Learn More
//                 </a>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </motion.div>
//   );
// };

// export default Home;

// c.The Royal Blue (Classic & Trustworthy)
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Diamond,
  Shield,
  Globe,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
  Lock,
  Eye,
  FileCheck,
  Clock,
  Gem,
  Award,
} from "lucide-react";

const Home = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const features = [
    {
      Icon: Shield,
      title: "Verified Dealers Only",
      desc: "Only trusted and verified diamond businesses get access to maintain a premium and secure ecosystem.",
    },
    {
      Icon: Lock,
      title: "Secure Transactions",
      desc: "Enterprise-grade security and protected trading workflows help your business operate safely.",
    },
    {
      Icon: Globe,
      title: "Global Reach",
      desc: "Connect with premium buyers and sellers from different countries through one refined marketplace.",
    },
    {
      Icon: BarChart3,
      title: "Market Intelligence",
      desc: "Analyze trends, business activity, and pricing insights through elegant reporting tools.",
    },
    {
      Icon: Gem,
      title: "Premium Quality",
      desc: "Access certified diamonds with guaranteed authenticity and highest quality standards.",
    },
    {
      Icon: Award,
      title: "Trusted Partners",
      desc: "Partner with industry-leading dealers who have proven track records and expertise.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Verified Dealers", Icon: Users },
    { value: "$2B+", label: "Annual Volume", Icon: TrendingUp },
    { value: "150+", label: "Countries", Icon: Globe },
    { value: "99.9%", label: "Platform Uptime", Icon: CheckCircle2 },
  ];

  const steps = [
    {
      step: "01",
      title: "Create Account",
      desc: "Register your business profile with all the necessary company and dealer details.",
      Icon: FileCheck,
    },
    {
      step: "02",
      title: "Complete Verification",
      desc: "Verify your business identity to unlock trusted access and premium marketplace benefits.",
      Icon: Eye,
    },
    {
      step: "03",
      title: "Start Trading",
      desc: "Connect, explore listings, and perform secure business transactions with confidence.",
      Icon: Lock,
    },
  ];

  const securityFeatures = [
    { label: "SSL Security", Icon: Lock },
    { label: "Trusted Access", Icon: CheckCircle2 },
    { label: "Business Verification", Icon: FileCheck },
    { label: "24/7 Monitoring", Icon: Clock },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen overflow-x-hidden bg-[#FFFFFF] text-[#1E3A8A]"
    >
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DBEAFE]/50 via-[#FFFFFF] to-[#DBEAFE]/30" />

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%231E3A8A' fill-opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "90px 90px",
          }}
        />

        {/* Glow Orbs */}
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-16 top-20 h-80 w-80 rounded-full bg-[#1E3A8A]/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-[#DBEAFE]/50 blur-3xl"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 py-28 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#1E3A8A]/20 bg-[#DBEAFE]/80 px-4 py-2 text-sm font-medium text-[#1E3A8A] backdrop-blur-xl"
            >
              <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />
              Premium Diamond Trading Platform
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-4xl font-bold leading-tight text-[#1E3A8A] sm:text-5xl lg:text-6xl"
            >
              Trust & Clarity in
              <br />
              <span className="bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#1E3A8A] bg-clip-text text-transparent">
                Diamond Trading
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mb-8 max-w-2xl text-base leading-relaxed text-[#1E3A8A]/70 sm:text-lg"
            >
              A premium B2B diamond marketplace built on trust and transparency.
              Connect with verified dealers globally, trade securely, and grow
              your business with confidence.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(30,58,138,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1E3A8A]/90 hover:shadow-[0_14px_40px_rgba(30,58,138,0.35)]"
              >
                Start Trading
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1E3A8A]/30 bg-white px-8 py-4 font-semibold text-[#1E3A8A] backdrop-blur-xl transition-all duration-300 hover:border-[#1E3A8A] hover:bg-[#DBEAFE]/50"
              >
                <Users className="h-5 w-5" />
                Dealer Login
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.03 }}
                className="rounded-2xl border border-[#1E3A8A]/10 bg-white p-6 shadow-[0_8px_40px_rgba(30,58,138,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-[#FBBF24]/50 hover:shadow-[0_12px_45px_rgba(30,58,138,0.12)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE] text-[#1E3A8A]">
                  <stat.Icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-3xl font-bold text-[#1E3A8A]">
                  {stat.value}
                </div>
                <div className="text-sm text-[#1E3A8A]/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll */}
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
        >
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-[#1E3A8A]/40 pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-[#1E3A8A]"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <section className="bg-[#DBEAFE]/30 px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1E3A8A]/20 bg-white px-4 py-1.5 text-sm font-medium text-[#1E3A8A]">
                <Sparkles className="h-4 w-4 text-[#FBBF24]" />
                Platform Features
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold text-[#1E3A8A] md:text-4xl"
            >
              Designed for Premium Diamond Businesses
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-[#1E3A8A]/70"
            >
              Elegant visuals, trusted identity, and professional business tools
              combined into one refined platform experience.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl border border-[#1E3A8A]/10 bg-white p-8 shadow-[0_4px_20px_rgba(30,58,138,0.05)] transition-all duration-300 hover:border-[#FBBF24]/40 hover:shadow-[0_15px_40px_rgba(30,58,138,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#DBEAFE]/0 via-[#DBEAFE]/0 to-[#DBEAFE]/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#DBEAFE] text-[#1E3A8A] transition-all duration-300 group-hover:bg-[#1E3A8A] group-hover:text-white">
                    <feature.Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-[#1E3A8A]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#1E3A8A]/60">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.span
              variants={fadeInUp}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1E3A8A]/20 bg-[#DBEAFE]/50 px-4 py-1.5 text-sm font-medium text-[#1E3A8A]"
            >
              <Clock className="h-4 w-4 text-[#FBBF24]" />
              Process
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold text-[#1E3A8A] md:text-4xl"
            >
              How the Platform Works
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-[#1E3A8A]/70"
            >
              A smooth and trusted journey from business registration to secure
              professional trading.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="relative grid gap-8 md:grid-cols-3"
          >
            <div className="absolute left-1/4 right-1/4 top-24 hidden h-px bg-gradient-to-r from-transparent via-[#FBBF24]/50 to-transparent md:block" />

            {steps.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
              >
                <div className="absolute -top-3 left-0 text-7xl font-bold text-[#DBEAFE] transition-colors duration-300 group-hover:text-[#DBEAFE]/70">
                  {item.step}
                </div>

                <div className="relative pt-16">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E3A8A] text-white shadow-[0_10px_30px_rgba(30,58,138,0.25)]">
                    <item.Icon className="h-8 w-8" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-[#1E3A8A]">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-[#1E3A8A]/60">{item.desc}</p>

                  <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-[#FBBF24] to-[#FBBF24]/30" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security */}
      <section className="overflow-hidden bg-[#DBEAFE]/30 px-4 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeIn}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1E3A8A]/20 bg-white px-4 py-1.5 text-sm font-medium text-[#1E3A8A]"
            >
              <Shield className="h-4 w-4 text-[#FBBF24]" />
              Security First
            </motion.span>

            <motion.h2
              variants={slideInLeft}
              className="mb-6 text-3xl font-bold text-[#1E3A8A] md:text-4xl"
            >
              Trusted Protection for Every Diamond Transaction
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mb-8 leading-relaxed text-[#1E3A8A]/70"
            >
              Designed to support premium business trading with secure access,
              verified businesses, and a reliable platform experience.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {securityFeatures.map((security, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="flex items-center gap-3 rounded-xl border border-[#1E3A8A]/10 bg-white p-4 shadow-[0_2px_10px_rgba(30,58,138,0.05)] transition-all duration-300 hover:border-[#FBBF24]/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DBEAFE] text-[#1E3A8A]">
                    <security.Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-[#1E3A8A]">
                    {security.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Shield Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden justify-center lg:flex"
          >
            <motion.div
              animate={{ rotateY: [0, 10, 0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              <div className="absolute inset-0 h-80 w-80 rounded-full bg-[#1E3A8A]/10 blur-3xl" />
              <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-[#1E3A8A]/20 bg-gradient-to-br from-[#DBEAFE] to-white shadow-[0_20px_60px_rgba(30,58,138,0.15)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-5 rounded-full border border-dashed border-[#FBBF24]/40"
                />
                <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] shadow-[0_10px_40px_rgba(30,58,138,0.25)]">
                  <Shield className="h-24 w-24 text-white" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[#1E3A8A]/10 bg-gradient-to-br from-[#DBEAFE]/50 to-white p-10 text-center shadow-[0_20px_60px_rgba(30,58,138,0.12)] md:p-16"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.08),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.08),transparent_20%)]" />

            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E3A8A]/10 text-[#1E3A8A]">
                  <Diamond className="h-8 w-8" />
                </div>
              </div>

              <h2 className="mb-4 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
                Ready to Elevate Your Diamond Business?
              </h2>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-[#1E3A8A]/70">
                Join a premium marketplace created for trusted dealers, secure
                transactions, and elegant digital presentation.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-8 py-4 font-semibold text-white shadow-[0_10px_30px_rgba(30,58,138,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1E3A8A]/90 hover:shadow-[0_14px_40px_rgba(30,58,138,0.35)]"
                >
                  Apply for Membership
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#"
                  className="rounded-xl border border-[#1E3A8A]/30 bg-white px-8 py-4 font-semibold text-[#1E3A8A] transition-all duration-300 hover:border-[#FBBF24] hover:bg-[#FBBF24]/10"
                >
                  Learn More
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;