// 7. Deep Purple & Rose (Elegant Aesthetics)
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
  Crown,
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
      className="min-h-screen overflow-x-hidden bg-[#FDF2F8] text-[#4C1D95]"
    >
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#4C1D95]" />

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%23FB7185' fill-opacity='0.3'/%3E%3C/svg%3E\")",
            backgroundSize: "90px 90px",
          }}
        />

        {/* Glow Orbs */}
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-16 top-20 h-80 w-80 rounded-full bg-[#DDD6FE]/30 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-[#FB7185]/20 blur-3xl"
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
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE]/50 bg-[#4C1D95]/80 px-4 py-2 text-sm font-medium text-[#FFFFFF] backdrop-blur-xl"
            >
              <Crown className="h-4 w-4 text-[#FB7185]" />
              Luxury Diamond Trading Platform
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-4xl font-bold leading-tight text-[#FFFFFF] sm:text-5xl lg:text-6xl"
            >
              Elegance & Trust in
              <br />
              <span className="bg-gradient-to-r from-[#FB7185] via-[#DDD6FE] to-[#FB7185] bg-clip-text text-transparent">
                Precious Stones
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mb-8 max-w-2xl text-base leading-relaxed text-[#FFFFFF]/80 sm:text-lg"
            >
              An exclusive B2B marketplace for luxury jewelry and high-value gemstones.
              Connect with verified dealers worldwide, trade with confidence,
              and elevate your business to new heights.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#FB7185] px-8 py-4 font-semibold text-[#FFFFFF] shadow-[0_10px_30px_rgba(251,113,133,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F43F5E] hover:shadow-[0_14px_40px_rgba(251,113,133,0.4)]"
              >
                Start Trading
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[#FFFFFF]/30 bg-[#4C1D95]/50 px-8 py-4 font-semibold text-[#FFFFFF] transition-all duration-300 hover:border-[#DDD6FE] hover:bg-[#4C1D95]/70"
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
                className="rounded-2xl border border-[#DDD6FE]/30 bg-[#4C1D95]/90 p-6 shadow-[0_8px_40px_rgba(76,29,149,0.2)] backdrop-blur-xl transition-all duration-300 hover:border-[#DDD6FE]/60 hover:shadow-[0_12px_45px_rgba(76,29,149,0.3)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFFFFF]/10 text-[#FB7185]">
                  <stat.Icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-3xl font-bold text-[#FFFFFF]">
                  {stat.value}
                </div>
                <div className="text-sm text-[#DDD6FE]">{stat.label}</div>
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
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-[#DDD6FE]/50 pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-[#FB7185]"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <section className="bg-[#FDF2F8] px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/20 bg-[#DDD6FE] px-4 py-1.5 text-sm font-medium text-[#4C1D95]">
                <Sparkles className="h-4 w-4 text-[#FB7185]" />
                Platform Features
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold text-[#4C1D95] md:text-4xl"
            >
              Designed for Luxury Jewelry Businesses
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-[#4C1D95]/70"
            >
              Sophisticated aesthetics, trusted verification, and premium business tools
              combined into one exclusive platform experience.
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
                className="group relative overflow-hidden rounded-2xl border border-[#4C1D95]/10 bg-white p-8 shadow-[0_4px_20px_rgba(76,29,149,0.08)] transition-all duration-300 hover:border-[#FB7185]/40 hover:shadow-[0_15px_40px_rgba(251,113,133,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#DDD6FE]/0 via-[#DDD6FE]/0 to-[#DDD6FE]/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#4C1D95]/5 text-[#FB7185] transition-all duration-300 group-hover:bg-[#FB7185] group-hover:text-[#FFFFFF]">
                    <feature.Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-[#4C1D95]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4C1D95]/60">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#FDF2F8] px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.span
              variants={fadeIn}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4C1D95]/20 bg-[#4C1D95] px-4 py-1.5 text-sm font-medium text-[#FFFFFF]"
            >
              <Clock className="h-4 w-4 text-[#FB7185]" />
              Process
            </motion.span>

            <motion.h2
              variants={slideInLeft}
              className="mb-4 text-3xl font-bold text-[#4C1D95] md:text-4xl"
            >
              How the Platform Works
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-[#4C1D95]/70"
            >
              A refined and secure journey from business registration to exclusive
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
            <div className="absolute left-1/4 right-1/4 top-24 hidden h-px bg-gradient-to-r from-transparent via-[#FB7185]/50 to-transparent md:block" />

            {steps.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
              >
                <div className="absolute -top-3 left-0 text-7xl font-bold text-[#4C1D95]/10 transition-colors duration-300 group-hover:text-[#4C1D95]/20">
                  {item.step}
                </div>

                <div className="relative pt-16">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4C1D95] text-[#FFFFFF] shadow-[0_10px_30px_rgba(76,29,149,0.3)]">
                    <item.Icon className="h-8 w-8" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-[#4C1D95]">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-[#4C1D95]/60">{item.desc}</p>

                  <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-[#4C1D95] to-[#4C1D95]/30" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security */}
      <section className="overflow-hidden bg-[#4C1D95] px-4 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeIn}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFFFFF]/20 bg-[#6D28D9] px-4 py-1.5 text-sm font-medium text-[#FFFFFF]"
            >
              <Shield className="h-4 w-4 text-[#FB7185]" />
              Security First
            </motion.span>

            <motion.h2
              variants={slideInLeft}
              className="mb-6 text-3xl font-bold text-[#FFFFFF] md:text-4xl"
            >
              Trusted Protection for Every Precious Transaction
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mb-8 leading-relaxed text-[#FFFFFF]/80"
            >
              Engineered to support luxury business trading with secure access,
              verified enterprises, and an exclusive platform experience.
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
                  className="flex items-center gap-3 rounded-xl border border-[#FFFFFF]/10 bg-[#6D28D9] p-4 shadow-[0_2px_10px_rgba(76,29,149,0.2)] transition-all duration-300 hover:border-[#DDD6FE]/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFFFFF]/10 text-[#FB7185]">
                    <security.Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-[#FFFFFF]">
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
              <div className="absolute inset-0 h-80 w-80 rounded-full bg-[#DDD6FE]/10 blur-3xl" />
              <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-[#DDD6FE]/30 bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] shadow-[0_20px_60px_rgba(76,29,149,0.4)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-5 rounded-full border border-dashed border-[#DDD6FE]/40"
                />
                <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] shadow-[0_10px_40px_rgba(251,113,133,0.2)]">
                  <Shield className="h-24 w-24 text-[#FB7185]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FDF2F8] px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[#DDD6FE]/30 bg-gradient-to-br from-[#4C1D95] to-[#6D28D9] p-10 text-center shadow-[0_20px_60px_rgba(76,29,149,0.3)] md:p-16"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(221,214,254,0.1),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(251,113,133,0.05),transparent_20%)]" />

            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFFFFF]/10 text-[#FB7185]">
                  <Crown className="h-8 w-8" />
                </div>
              </div>

              <h2 className="mb-4 text-3xl font-bold text-[#FFFFFF] md:text-4xl">
                Ready to Elevate Your Jewelry Business?
              </h2>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-[#FFFFFF]/80">
                Join an exclusive marketplace crafted for trusted dealers, secure
                transactions, and sophisticated digital presentation.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#FB7185] px-8 py-4 font-semibold text-[#FFFFFF] shadow-[0_10px_30px_rgba(251,113,133,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F43F5E] hover:shadow-[0_14px_40px_rgba(251,113,133,0.4)]"
                >
                  Apply for Membership
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#"
                  className="rounded-xl border border-[#FFFFFF]/20 bg-[#6D28D9] px-8 py-4 font-semibold text-[#FFFFFF] transition-all duration-300 hover:border-[#DDD6FE] hover:bg-[#7C3AED]"
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