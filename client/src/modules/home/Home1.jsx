// 1. Black + Gold + White
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
} from "lucide-react";

const Home = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.94]);

  const features = [
    {
      Icon: Shield,
      title: "Verified Dealers Only",
      desc: "Strict KYC and business verification ensures only trusted diamond traders join the platform.",
    },
    {
      Icon: Lock,
      title: "Secure Transactions",
      desc: "Protected trading workflow with secure payment handling and enterprise-grade security.",
    },
    {
      Icon: Globe,
      title: "Global Diamond Network",
      desc: "Expand your reach by connecting with premium dealers and buyers across international markets.",
    },
    {
      Icon: BarChart3,
      title: "Market Insights",
      desc: "Track pricing, business activity, and trading performance through elegant analytics dashboards.",
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
      title: "Register & Verify",
      desc: "Create your account and complete the dealer verification process for trusted access.",
      Icon: FileCheck,
    },
    {
      step: "02",
      title: "Explore Listings",
      desc: "Browse premium diamond listings and connect directly with verified industry members.",
      Icon: Eye,
    },
    {
      step: "03",
      title: "Trade With Confidence",
      desc: "Complete secure business transactions with transparency and professional workflow support.",
      Icon: Lock,
    },
  ];

  const securityFeatures = [
    { label: "256-bit SSL Security", Icon: Lock },
    { label: "Multi-Factor Access", Icon: CheckCircle2 },
    { label: "Verified Business Profiles", Icon: FileCheck },
    { label: "24/7 Platform Monitoring", Icon: Clock },
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
    hidden: { opacity: 0, scale: 0.88 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div ref={containerRef} className="min-h-screen bg-[#0B0B0C] overflow-x-hidden text-white">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.10),transparent_25%),linear-gradient(to_bottom_right,#0B0B0C,#111114,#0B0B0C)]" />

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%23D4AF37' fill-opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Glow orbs */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-20 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 25, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 py-28 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#131316]/80 px-4 py-2 text-sm font-medium text-[#F5E6B3] backdrop-blur-xl"
            >
              <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              Premium Diamond Trading Platform
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            >
              Luxury Diamond
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5E6B3] to-[#D4AF37] bg-clip-text text-transparent">
                Trading Experience
              </span>
              <br />
              Built for Trust
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mb-8 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
            >
              A refined B2B platform for diamond businesses to connect, trade, and
              grow with confidence. Elegant interface, secure workflows, and a
              premium digital experience tailored for the diamond industry.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b89221] px-8 py-4 font-semibold text-black shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(212,175,55,0.35)]"
              >
                Start Trading
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-white/5 px-8 py-4 font-semibold text-[#F5E6B3] backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                <Users className="h-5 w-5" />
                Dealer Login
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group rounded-2xl border border-[#D4AF37]/15 bg-[#131316]/85 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-[0_12px_45px_rgba(212,175,55,0.08)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <stat.Icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll */}
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-[#D4AF37]/60 pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <section className="bg-[#0F0F11] px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#131316] px-4 py-1.5 text-sm font-medium text-[#F5E6B3]">
                <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                Platform Features
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold text-white md:text-4xl"
            >
              Built for Modern Diamond Businesses
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-zinc-400"
            >
              Every section is designed to reflect trust, elegance, and premium
              business value for the diamond market.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl border border-[#D4AF37]/15 bg-[#131316] p-8 transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-[0_15px_40px_rgba(212,175,55,0.08)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-black">
                    <feature.Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#0B0B0C] px-4 py-24">
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
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#131316] px-4 py-1.5 text-sm font-medium text-[#F5E6B3]"
            >
              <Clock className="h-4 w-4 text-[#D4AF37]" />
              Process
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold text-white md:text-4xl"
            >
              How the Platform Works
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-zinc-400"
            >
              A seamless trading journey designed to feel professional, secure, and efficient.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="relative grid gap-8 md:grid-cols-3"
          >
            <div className="absolute left-1/4 right-1/4 top-24 hidden h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent md:block" />

            {steps.map((item, index) => (
              <motion.div key={index} variants={fadeInUp} className="group relative">
                <div className="absolute -top-3 left-0 text-7xl font-bold text-[#1D1D21] transition-colors duration-300 group-hover:text-[#2A2A2F]">
                  {item.step}
                </div>

                <div className="relative pt-16">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#b89221] text-black shadow-[0_10px_30px_rgba(212,175,55,0.25)]">
                    <item.Icon className="h-8 w-8" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
                  <p className="leading-relaxed text-zinc-400">{item.desc}</p>

                  <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-[#D4AF37]/80 to-[#F5E6B3]/30" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-[#111114] px-4 py-24 overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeIn}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#131316] px-4 py-1.5 text-sm font-medium text-[#F5E6B3]"
            >
              <Shield className="h-4 w-4 text-[#D4AF37]" />
              Security First
            </motion.span>

            <motion.h2
              variants={slideInLeft}
              className="mb-6 text-3xl font-bold text-white md:text-4xl"
            >
              Premium Protection for Every Business Transaction
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mb-8 leading-relaxed text-zinc-400"
            >
              Your business reputation matters. That’s why the platform is designed
              with trusted access control, secure data handling, and reliable dealer verification.
            </motion.p>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {securityFeatures.map((security, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="flex items-center gap-3 rounded-xl border border-[#D4AF37]/10 bg-[#131316] p-4 transition-all duration-300 hover:border-[#D4AF37]/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                    <security.Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{security.label}</span>
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
              <div className="absolute inset-0 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />
              <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-gradient-to-br from-[#1A1A1D] to-[#111114] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-5 rounded-full border border-dashed border-[#D4AF37]/20"
                />
                <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b89221] shadow-[0_10px_40px_rgba(212,175,55,0.25)]">
                  <Shield className="h-24 w-24 text-black" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B0B0C] px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-[#131316] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-16"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_20%)]" />

            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Diamond className="h-8 w-8" />
                </div>
              </div>

              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Ready to Elevate Your Diamond Business?
              </h2>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
                Join a premium platform crafted for trusted dealers, elegant business presentation, and secure growth.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b89221] px-8 py-4 font-semibold text-black shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(212,175,55,0.35)]"
                >
                  Apply for Membership
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#"
                  className="rounded-xl border border-[#D4AF37]/30 bg-white/5 px-8 py-4 font-semibold text-[#F5E6B3] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
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