// 3.The Royal Blue (Classic & Trustworthy)
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
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]">
      {/* Hero Section */}
      <section className="relative flex py-10 items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DBEAFE]/30 via-[#F8FAFC] to-[#F1F5F9]" />

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%231E3A8A' fill-opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "90px 90px",
          }}
        />

        {/* Glow Orbs - Static */}
        <div className="absolute right-16 top-20 h-80 w-80 rounded-full bg-[#3B82F6]/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-[#1E3A8A]/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 pb-8 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left */}
          <div className="text-center lg:text-left">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
              Trust & Clarity in
              <br />
              <span className="bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#1E3A8A] bg-clip-text text-transparent">
                Diamond Trading
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-base leading-relaxed text-[#475569] sm:text-lg">
              A premium B2B diamond marketplace built on trust and transparency.
              Connect with verified dealers globally, trade securely, and grow
              your business with confidence.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-8 py-4 font-semibold text-white shadow-lg shadow-[#1E3A8A]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1E40AF] hover:shadow-xl hover:shadow-[#1E3A8A]/30"
              >
                Start Trading
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#E2E8F0] bg-white px-8 py-4 font-semibold text-[#1E3A8A] transition-all duration-300 hover:border-[#1E3A8A] hover:bg-[#F8FAFC]"
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
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-[#3B82F6]/30 hover:shadow-[0_8px_30px_rgba(30,58,138,0.12)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] text-[#1E3A8A]">
                  <stat.Icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-3xl font-bold text-[#0F172A]">
                  {stat.value}
                </div>
                <div className="text-sm text-[#64748B]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll - Static */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-[#CBD5E1] pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#F1F5F9]/70 px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-sm font-medium text-[#1E3A8A] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#3B82F6]" />
              Platform Features
            </span>

            <h2 className="mb-4 text-3xl font-bold text-[#0F172A] md:text-4xl">
              Designed for Premium Diamond Businesses
            </h2>

            <p className="mx-auto max-w-2xl text-[#475569]">
              Elegant visuals, trusted identity, and professional business tools
              combined into one refined platform experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-[#3B82F6]/30 hover:shadow-[0_12px_40px_rgba(30,58,138,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#DBEAFE]/0 via-[#DBEAFE]/0 to-[#EFF6FF]/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] text-[#1E3A8A] transition-all duration-300 group-hover:from-[#1E3A8A] group-hover:to-[#3B82F6] group-hover:text-white">
                    <feature.Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-[#0F172A]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#64748B]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white px-4 py-24 border-y border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-1.5 text-sm font-medium text-[#1E3A8A]">
              <Clock className="h-4 w-4 text-[#3B82F6]" />
              Process
            </span>

            <h2 className="mb-4 text-3xl font-bold text-[#0F172A] md:text-4xl">
              How the Platform Works
            </h2>

            <p className="mx-auto max-w-2xl text-[#475569]">
              A smooth and trusted journey from business registration to secure
              professional trading.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute left-1/4 right-1/4 top-24 hidden h-px bg-gradient-to-r from-transparent via-[#CBD5E1] to-transparent md:block" />

            {steps.map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute -top-3 left-0 text-7xl font-bold text-[#DBEAFE]/60 transition-colors duration-300 group-hover:text-[#DBEAFE]">
                  {item.step}
                </div>

                <div className="relative pt-16">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white shadow-lg shadow-[#1E3A8A]/25">
                    <item.Icon className="h-8 w-8" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-[#64748B]">{item.desc}</p>

                  <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#DBEAFE]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="overflow-hidden bg-[#F1F5F9]/70 px-4 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-sm font-medium text-[#1E3A8A] shadow-sm">
              <Shield className="h-4 w-4 text-[#3B82F6]" />
              Security First
            </span>

            <h2 className="mb-6 text-3xl font-bold text-[#0F172A] md:text-4xl">
              Trusted Protection for Every Diamond Transaction
            </h2>

            <p className="mb-8 leading-relaxed text-[#475569]">
              Designed to support premium business trading with secure access,
              verified businesses, and a reliable platform experience.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {securityFeatures.map((security, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-all duration-300 hover:border-[#3B82F6]/30 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] text-[#1E3A8A]">
                    <security.Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-[#0F172A]">
                    {security.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shield Visual */}
          <div className="hidden justify-center lg:flex">
            <div className="relative">
              <div className="absolute inset-0 h-80 w-80 rounded-full bg-[#1E3A8A]/10 blur-3xl" />
              <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-[#E2E8F0] bg-gradient-to-br from-[#DBEAFE] to-white shadow-[0_20px_60px_rgba(30,58,138,0.12)]">
                <div className="absolute inset-5 rounded-full border border-dashed border-[#3B82F6]/30" />
                <div className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] shadow-[0_10px_40px_rgba(30,58,138,0.25)]">
                  <Shield className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8FAFC] px-4 py-24 border-t border-[#E2E8F0]">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-gradient-to-br from-[#EFF6FF] to-white p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.05),transparent_20%)]" />

            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] text-[#1E3A8A]">
                  <Diamond className="h-8 w-8" />
                </div>
              </div>

              <h2 className="mb-4 text-3xl font-bold text-[#0F172A] md:text-4xl">
                Ready to Elevate Your Diamond Business?
              </h2>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-[#475569]">
                Join a premium marketplace created for trusted dealers, secure
                transactions, and elegant digital presentation.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-8 py-4 font-semibold text-white shadow-lg shadow-[#1E3A8A]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1E40AF] hover:shadow-xl hover:shadow-[#1E3A8A]/30"
                >
                  Apply for Membership
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#"
                  className="rounded-xl border-2 border-[#E2E8F0] bg-white px-8 py-4 font-semibold text-[#1E3A8A] transition-all duration-300 hover:border-[#1E3A8A] hover:bg-[#F8FAFC]"
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
