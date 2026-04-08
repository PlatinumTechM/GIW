// 2. Charcoal + Champagne Gold
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
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const features = [
    {
      Icon: Shield,
      title: "Verified Dealers Only",
      desc: "Every dealer goes through strict business verification to maintain a trusted diamond ecosystem.",
    },
    {
      Icon: Lock,
      title: "Secure Transactions",
      desc: "Advanced security layers and protected trade workflows help your business operate with confidence.",
    },
    {
      Icon: Globe,
      title: "Worldwide Reach",
      desc: "Connect with trusted diamond buyers and sellers across international markets from one platform.",
    },
    {
      Icon: BarChart3,
      title: "Smart Insights",
      desc: "Track market trends, pricing movement, and performance through elegant analytics experiences.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Verified Dealers", Icon: Users },
    { value: "$2B+", label: "Annual Volume", Icon: TrendingUp },
    { value: "150+", label: "Countries", Icon: Globe },
    { value: "99.9%", label: "Secure Uptime", Icon: CheckCircle2 },
  ];

  const steps = [
    {
      step: "01",
      title: "Register Account",
      desc: "Create your business account and submit the required company and dealer details.",
      Icon: FileCheck,
    },
    {
      step: "02",
      title: "Get Verified",
      desc: "Complete profile verification to unlock trusted access and premium platform features.",
      Icon: Eye,
    },
    {
      step: "03",
      title: "Trade Confidently",
      desc: "Start building connections, exploring listings, and transacting in a secure environment.",
      Icon: Lock,
    },
  ];

  const securityFeatures = [
    { label: "SSL Protection", Icon: Lock },
    { label: "Verified Access", Icon: CheckCircle2 },
    { label: "Business KYC", Icon: FileCheck },
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
      className="min-h-screen overflow-x-hidden bg-[#111827] text-[#F9FAFB]"
    >
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,199,123,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(230,199,123,0.08),transparent_24%),linear-gradient(to_bottom_right,#111827,#0f172a,#111827)]" />

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%23E6C77B' fill-opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "90px 90px",
          }}
        />

        {/* Glows */}
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-16 top-20 h-80 w-80 rounded-full bg-[#E6C77B]/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-[#E6C77B]/10 blur-3xl"
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
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E6C77B]/25 bg-[#1F2937]/80 px-4 py-2 text-sm font-medium text-[#F3E7C2] backdrop-blur-xl"
            >
              <span className="h-2 w-2 rounded-full bg-[#E6C77B]" />
              Premium Diamond Platform
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            >
              Elegant Diamond
              <br />
              <span className="bg-gradient-to-r from-[#E6C77B] via-[#F3E7C2] to-[#E6C77B] bg-clip-text text-transparent">
                Business Experience
              </span>
              <br />
              For Trusted Dealers
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mb-8 max-w-2xl text-base leading-relaxed text-[#9CA3AF] sm:text-lg"
            >
              A premium B2B diamond marketplace built with trust, security, and
              refined digital design. Connect with verified dealers, explore
              professional listings, and grow your business globally.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E6C77B] to-[#d4b25f] px-8 py-4 font-semibold text-[#111827] shadow-[0_10px_30px_rgba(230,199,123,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(230,199,123,0.35)]"
              >
                Start Trading
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E6C77B]/30 bg-white/5 px-8 py-4 font-semibold text-[#F3E7C2] backdrop-blur-xl transition-all duration-300 hover:border-[#E6C77B] hover:bg-[#E6C77B]/10"
              >
                <Users className="h-5 w-5" />
                Dealer Login
              </Link>
            </motion.div>
          </motion.div>

          {/* Right */}
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
                className="rounded-2xl border border-[#E6C77B]/12 bg-[#1F2937]/85 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-[#E6C77B]/35 hover:shadow-[0_12px_45px_rgba(230,199,123,0.08)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6C77B]/10 text-[#E6C77B]">
                  <stat.Icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-3xl font-bold text-[#F9FAFB]">
                  {stat.value}
                </div>
                <div className="text-sm text-[#9CA3AF]">{stat.label}</div>
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
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-[#E6C77B]/60 pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-[#E6C77B]"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <section className="bg-[#0F172A] px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E6C77B]/20 bg-[#1F2937] px-4 py-1.5 text-sm font-medium text-[#F3E7C2]">
                <Sparkles className="h-4 w-4 text-[#E6C77B]" />
                Platform Features
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold text-[#F9FAFB] md:text-4xl"
            >
              Built for Modern Diamond Businesses
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-[#9CA3AF]"
            >
              A polished trading experience with luxury visuals, clear trust
              signals, and professional business-focused design.
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
                className="group relative overflow-hidden rounded-2xl border border-[#E6C77B]/12 bg-[#1F2937] p-8 transition-all duration-300 hover:border-[#E6C77B]/40 hover:shadow-[0_15px_40px_rgba(230,199,123,0.08)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6C77B]/0 via-[#E6C77B]/0 to-[#E6C77B]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E6C77B]/10 text-[#E6C77B] transition-all duration-300 group-hover:bg-[#E6C77B] group-hover:text-[#111827]">
                    <feature.Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-[#F9FAFB]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9CA3AF]">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#111827] px-4 py-24">
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
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E6C77B]/20 bg-[#1F2937] px-4 py-1.5 text-sm font-medium text-[#F3E7C2]"
            >
              <Clock className="h-4 w-4 text-[#E6C77B]" />
              Process
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold text-[#F9FAFB] md:text-4xl"
            >
              How the Platform Works
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-[#9CA3AF]"
            >
              A smooth, trustworthy, and professional flow from registration to
              secure trading.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="relative grid gap-8 md:grid-cols-3"
          >
            <div className="absolute left-1/4 right-1/4 top-24 hidden h-px bg-gradient-to-r from-transparent via-[#E6C77B]/30 to-transparent md:block" />

            {steps.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
              >
                <div className="absolute -top-3 left-0 text-7xl font-bold text-[#273244] transition-colors duration-300 group-hover:text-[#374151]">
                  {item.step}
                </div>

                <div className="relative pt-16">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E6C77B] to-[#d4b25f] text-[#111827] shadow-[0_10px_30px_rgba(230,199,123,0.25)]">
                    <item.Icon className="h-8 w-8" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-[#F9FAFB]">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-[#9CA3AF]">{item.desc}</p>

                  <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-[#E6C77B]/80 to-[#F3E7C2]/30" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security */}
      <section className="overflow-hidden bg-[#0F172A] px-4 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeIn}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E6C77B]/20 bg-[#1F2937] px-4 py-1.5 text-sm font-medium text-[#F3E7C2]"
            >
              <Shield className="h-4 w-4 text-[#E6C77B]" />
              Security First
            </motion.span>

            <motion.h2
              variants={slideInLeft}
              className="mb-6 text-3xl font-bold text-[#F9FAFB] md:text-4xl"
            >
              Trusted Protection for Every Diamond Transaction
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mb-8 leading-relaxed text-[#9CA3AF]"
            >
              Built for reliability and trust with protected access, verified
              businesses, and a premium environment for professional trade.
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
                  className="flex items-center gap-3 rounded-xl border border-[#E6C77B]/10 bg-[#1F2937] p-4 transition-all duration-300 hover:border-[#E6C77B]/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6C77B]/10 text-[#E6C77B]">
                    <security.Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-[#F9FAFB]">
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
              <div className="absolute inset-0 h-80 w-80 rounded-full bg-[#E6C77B]/10 blur-3xl" />
              <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-[#E6C77B]/20 bg-gradient-to-br from-[#1F2937] to-[#111827] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-5 rounded-full border border-dashed border-[#E6C77B]/20"
                />
                <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-[#E6C77B] to-[#d4b25f] shadow-[0_10px_40px_rgba(230,199,123,0.25)]">
                  <Shield className="h-24 w-24 text-[#111827]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111827] px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[#E6C77B]/20 bg-[#1F2937] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-16"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,199,123,0.12),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(230,199,123,0.08),transparent_20%)]" />

            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6C77B]/10 text-[#E6C77B]">
                  <Diamond className="h-8 w-8" />
                </div>
              </div>

              <h2 className="mb-4 text-3xl font-bold text-[#F9FAFB] md:text-4xl">
                Ready to Elevate Your Diamond Business?
              </h2>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-[#9CA3AF]">
                Join a premium platform crafted for elegant presentation,
                verified trust, and secure business growth.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E6C77B] to-[#d4b25f] px-8 py-4 font-semibold text-[#111827] shadow-[0_10px_30px_rgba(230,199,123,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(230,199,123,0.35)]"
                >
                  Apply for Membership
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#"
                  className="rounded-xl border border-[#E6C77B]/30 bg-white/5 px-8 py-4 font-semibold text-[#F3E7C2] transition-all duration-300 hover:border-[#E6C77B] hover:bg-[#E6C77B]/10"
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