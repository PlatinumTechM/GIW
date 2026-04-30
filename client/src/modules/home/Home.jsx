import { Link } from "react-router-dom";
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
import RateCards from "@/components/dashboard/RateCards";

const Home = () => {
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#E9F1F6] text-[#0F4C5C]">
      {/* Hero Section */}
      <section className="relative flex py-16 items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9F1F6] via-[#B2D5E2] to-white" />

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%234AA6B5' fill-opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "90px 90px",
          }}
        />

        {/* Glow Orbs - Static */}
        <div className="absolute right-16 top-20 h-80 w-80 rounded-full bg-[#4AA6B5]/15 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-[#B2D5E2]/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 pb-8 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left */}
          <div className="text-center lg:text-left">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-[#0F4C5C] sm:text-5xl lg:text-6xl">
              Trust & Clarity in
              <br />
              <span className="bg-gradient-to-r from-[#4AA6B5] to-[#4AA6B5] bg-clip-text text-transparent">
                Diamond Trading
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-base leading-relaxed text-[#0F4C5C]/70 sm:text-lg">
              A premium B2B diamond marketplace built on trust and transparency.
              Connect with verified dealers globally, trade securely, and grow
              your business with confidence.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-[#4AA6B5] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(74,166,181,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#3A93A8]"
              >
                Start Trading
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-[#B2D5E2] bg-white px-8 py-3 text-sm font-semibold text-[#0F4C5C] shadow-sm transition duration-300 hover:border-[#4AA6B5] hover:text-[#4AA6B5]"
              >
                <Users className="h-5 w-5" />
                Dealer Login
              </Link>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-3xl border border-[#D9EBF3] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#4AA6B5]"
              >
                <div className="mb-4 flex h-11 w-14 items-center justify-center rounded-2xl bg-[#B2D5E2]/20 text-[#4AA6B5] shadow-sm">
                  <stat.Icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-3xl font-bold text-[#0F4C5C]">
                  {stat.value}
                </div>
                <div className="text-sm text-[#0F4C5C]/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll - Static */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-[#B2D5E2] pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#4AA6B5]" />
          </div>
        </div>
      </section>

      {/* Live Rates Section */}
      <section className="bg-[#E9F1F6] px-4 py-12 border-y border-[#B2D5E2]/40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F4C5C]">
                Live Market Rates
              </h2>
              <p className="text-sm text-[#0F4C5C]/70">
                Real-time USD/INR and Gold rates for informed trading decisions
              </p>
            </div>
          </div>
          <RateCards />
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#E9F1F6] px-4 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B2D5E2]/40 bg-white px-5 py-2 text-sm font-semibold text-[#4AA6B5]">
              <Sparkles className="h-4 w-4 animate-icon-pulse" />
              Platform Features
            </span>

            <h2 className="mb-4 text-3xl font-bold text-[#0F4C5C] md:text-4xl">
              Designed for Premium Diamond Businesses
            </h2>

            <p className="mx-auto max-w-2xl text-[#0F4C5C]/70">
              Elegant visuals, trusted identity, and professional business tools
              combined into one refined platform experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
             <div
  key={index}
  className="group relative overflow-hidden rounded-3xl 
  border border-[#D9EBF3] 
  bg-white p-8 shadow-sm 
  transition-all duration-300 
  hover:-translate-y-1 hover:shadow-md 
  hover:border-[#4AA6B5] 
  hover:ring-2"
>
                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-16 items-center justify-center rounded-2xl bg-[#B2D5E2]/20 text-[#4AA6B5] transition duration-300 group-hover:bg-[#4AA6B5] group-hover:text-white shadow-sm">
                    <feature.Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-3 text-lg font-bold text-[#0F4C5C]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#0F4C5C]/70">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#E9F1F6] px-4 py-28 border-y border-[#B2D5E2]/40 relative overflow-hidden">
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-20 text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B2D5E2]/40 bg-white px-5 py-2 text-sm font-semibold text-[#4AA6B5]">
              <Clock className="h-4 w-4 animate-spin-slow" />
              How the Platform Works
            </span>

            <h2 className="mb-4 text-3xl font-bold text-[#0F4C5C] md:text-4xl">
              How the Platform Works
            </h2>

            <p className="mx-auto max-w-2xl text-[#0F4C5C]/70">
              A smooth and trusted journey from business registration to secure
              professional trading.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3 pt-10">
            {steps.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-3xl border border-[#D9EBF3] bg-white p-8 pt-16 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#4AA6B5]"
              >
                <div className="absolute top-4 right-6 text-6xl font-black text-[#4AA6B5]/10 transition-colors duration-300 group-hover:text-[#4AA6B5]/20">
                  {item.step}
                </div>

                <div className="relative">
                  <div className="mb-6 flex h-14 w-18 items-center justify-center rounded-2xl bg-[#B2D5E2]/20 text-[#4AA6B5] shadow-sm">
                    <item.Icon className="h-8 w-8" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-[#0F4C5C]">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-[#0F4C5C]/70">{item.desc}</p>

                  <div className="mt-6 h-1 w-full rounded-full bg-[#4AA6B5] opacity-20 group-hover:opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-[#E9F1F6] px-4 py-28 border-y border-[#B2D5E2]/40">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-5 py-2 text-sm font-semibold text-[#4AA6B5] backdrop-blur-xl">
              <Shield className="h-4 w-4 animate-bounce-subtle" />
              Security First
            </span>

            <h2 className="mb-6 text-3xl font-bold text-[#0F4C5C] md:text-4xl">
              Trusted Protection for Every Diamond Transaction
            </h2>

            <p className="mb-8 leading-relaxed text-[#0F4C5C]/70">
              Designed to support premium business trading with secure access,
              verified businesses, and a reliable platform experience.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {securityFeatures.map((security, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-2xl border border-[#D9EBF3] bg-white p-4 shadow-sm transition duration-300 hover:border-[#4AA6B5]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B2D5E2]/20 text-[#4AA6B5] shadow-sm">
                    <security.Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-[#0F4C5C]">
                    {security.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shield Visual */}
          <div className="hidden justify-center lg:flex">
            <div className="relative">
              <div className="absolute inset-0 h-80 w-80 rounded-full bg-[#4AA6B5]/10 blur-3xl" />
              <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-[#B2D5E2] bg-gradient-to-br from-[#E9F1F6] to-white shadow-[0_20px_60px_rgba(74,166,181,0.12)]">
                <div className="absolute inset-5 rounded-full border border-dashed border-[#4AA6B5]/30" />
                <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-[#4AA6B5] to-[#B2D5E2] shadow-[0_10px_40px_rgba(74,166,181,0.25)]">
                  <Shield className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E9F1F6] px-4 py-24 border-t border-[#B2D5E2]/40">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#B2D5E2] bg-white p-10 text-center shadow-[0_20px_60px_rgba(74,166,181,0.14)] md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,124,158,0.08),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(46,124,158,0.05),transparent_20%)]" />

            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-18 items-center justify-center rounded-2xl bg-[#B2D5E2]/20 text-[#4AA6B5] shadow-sm">
                  <Diamond className="h-8 w-8" />
                </div>
              </div>

              <h2 className="mb-4 text-3xl font-bold text-[#0F4C5C] md:text-4xl">
                Ready to Elevate Your Diamond Business?
              </h2>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-[#0F4C5C]/70">
                Join a premium marketplace created for trusted dealers, secure
                transactions, and elegant digital presentation.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#4AA6B5] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(74,166,181,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#3A93A8]"
                >
                  Apply for Membership
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#B2D5E2] bg-white px-8 py-3 text-sm font-semibold text-[#0F4C5C] shadow-sm transition duration-300 hover:border-[#4AA6B5] hover:text-[#4AA6B5]"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
