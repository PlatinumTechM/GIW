import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  Building2,
  HelpCircle,
  ArrowRight,
  Star,
  Diamond,
  X,
  ShieldCheck,
  Globe,
  BadgeDollarSign,
} from "lucide-react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currency, setCurrency] = useState("USD");

  const exchangeRate = 83;

  const getPrice = (usdPrice) => {
    return currency === "USD" ? usdPrice : Math.round(usdPrice * exchangeRate);
  };

  const getCurrencySymbol = () => {
    return currency === "USD" ? "$" : "₹";
  };

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      description:
        "Perfect for small diamond businesses and new dealers entering the marketplace.",
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: [
        "Up to 5 active listings",
        "Basic dealer analytics",
        "Email support",
        "1GB secure storage",
        "Standard marketplace access",
      ],
      notIncluded: [
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated manager",
      ],
      popular: false,
      cta: "Get Started",
      ctaLink: "/register",
      badge: "For Small Businesses",
    },
    {
      name: "Professional",
      icon: Sparkles,
      description:
        "Built for growing diamond trading teams that need advanced visibility and trusted operations.",
      monthlyPrice: 79,
      yearlyPrice: 66,
      features: [
        "Unlimited active listings",
        "Advanced analytics",
        "Priority support",
        "50GB secure storage",
        "Full API access",
        "Custom integrations",
        "Team collaboration tools",
      ],
      notIncluded: ["Dedicated account manager"],
      popular: true,
      cta: "Start Free Trial",
      ctaLink: "/register",
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      icon: Crown,
      description:
        "Enterprise-grade infrastructure for large diamond companies with global trade requirements.",
      monthlyPrice: 199,
      yearlyPrice: 166,
      features: [
        "Unlimited everything",
        "Custom enterprise analytics",
        "24/7 phone & email support",
        "Unlimited storage",
        "Advanced API access",
        "Custom integrations",
        "Full team collaboration",
        "Dedicated account manager",
        "SLA guarantee",
      ],
      notIncluded: [],
      popular: false,
      cta: "Contact Sales",
      ctaLink: "/contact",
      badge: "For Enterprises",
    },
  ];

  const faqs = [
    {
      q: "Can I upgrade my plan later?",
      a: "Yes, you can upgrade or downgrade your subscription anytime without losing your dealer data or listings.",
      icon: Diamond,
    },
    {
      q: "Is there a trial available?",
      a: "Yes, all premium plans come with a 14-day free trial so you can explore the platform confidently.",
      icon: Sparkles,
    },
    {
      q: "Do you support enterprise invoicing?",
      a: "Yes, enterprise customers can access custom billing, invoicing, and account-based payment support.",
      icon: Building2,
    },
    {
      q: "How secure is my trading data?",
      a: "Your business data is protected with secure infrastructure, encrypted storage, and role-based access controls.",
      icon: ShieldCheck,
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      {/* Header with Title and Toggles */}
      <section className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F1F5F9] to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-[#0F172A]"
            >
              Simple, transparent pricing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-[#475569] max-w-xl"
            >
              Choose the perfect plan for your needs. All plans include a 14-day free trial.
            </motion.p>

            <div className="flex flex-col items-center gap-4 mt-10">
              {/* Currency Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-1 rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-sm">
                  {["USD", "INR"].map((curr) => (
                    <motion.button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                        currency === curr
                          ? "bg-[#1E3A8A] text-white shadow-sm"
                          : "text-[#64748B] hover:text-[#1E3A8A]"
                      }`}
                    >
                      {curr} ({curr === "USD" ? "$" : "₹"})
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Billing Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <motion.span
                  animate={{
                    color: billingCycle === "monthly" ? "#1E3A8A" : "#94A3B8",
                  }}
                  className="text-sm font-semibold"
                >
                  Monthly
                </motion.span>

                <motion.button
                  onClick={() =>
                    setBillingCycle(
                      billingCycle === "monthly" ? "yearly" : "monthly"
                    )
                  }
                  whileTap={{ scale: 0.95 }}
                  className="relative h-7 w-14 rounded-full bg-[#1E3A8A] shadow-inner"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      x: billingCycle === "monthly" ? 2 : 28,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#BFDBFE] shadow-md"
                  >
                    <Star className="h-3 w-3 text-[#1E3A8A] fill-[#1E3A8A]" />
                  </motion.div>
                </motion.button>

                <motion.span
                  animate={{
                    color: billingCycle === "yearly" ? "#1E3A8A" : "#94A3B8",
                  }}
                  className="text-sm font-semibold"
                >
                  Yearly
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="ml-1 rounded-full bg-[#DBEAFE] px-2 py-0.5 text-xs font-semibold text-[#1E3A8A]"
                >
                  Save more yearly
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-b border-[#E2E8F0] bg-white py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { icon: Globe, title: "150+ Countries" },
            { icon: ShieldCheck, title: "Trusted Security" },
            { icon: BadgeDollarSign, title: "Transparent Plans" },
            { icon: Diamond, title: "Premium Experience" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 text-[#0F172A]"
              >
                <Icon className="h-5 w-5 text-[#3B82F6]" />
                <span className="text-sm font-semibold">{item.title}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative bg-gradient-to-b from-[#F1F5F9] to-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {plans.map((plan) => {
              const Icon = plan.icon;
              const usdPrice =
                billingCycle === "monthly"
                  ? plan.monthlyPrice
                  : plan.yearlyPrice;
              const price = getPrice(usdPrice);

              return (
                <motion.div
                  key={plan.name}
                  variants={fadeInUp}
                  whileHover={{
                    y: -12,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  className={`group relative rounded-[30px] border transition-all duration-500 ${
                    plan.popular
                      ? "border-[#3B82F6]/30 bg-gradient-to-b from-[#1E3A8A] to-[#2563EB] text-white shadow-[0_25px_80px_rgba(30,58,138,0.25)] md:-mt-6 md:mb-6"
                      : "border-[#E2E8F0] bg-white shadow-[0_15px_50px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_60px_rgba(30,58,138,0.12)] hover:border-[#3B82F6]/20"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
                      <motion.span
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#1E3A8A] shadow-lg"
                      >
                        <Star className="h-4 w-4 fill-current" />
                        Most Popular
                      </motion.span>
                    </div>
                  )}

                  <div className="relative overflow-hidden rounded-[30px] p-8">
                    {!plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    )}

                    <div className="relative z-10">
                      <div className="mb-6">
                        <div
                          className={`mb-4 inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${
                            plan.popular
                              ? "bg-white/15 text-[#DBEAFE]"
                              : "bg-[#DBEAFE] text-[#1E3A8A]"
                          }`}
                        >
                          {plan.badge}
                        </div>

                        <motion.div
                          whileHover={{ rotate: 6, scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                            plan.popular
                              ? "bg-white/15"
                              : "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] group-hover:from-[#DBEAFE] group-hover:to-[#BFDBFE]"
                          }`}
                        >
                          <Icon
                            className={`h-7 w-7 ${
                              plan.popular ? "text-white" : "text-[#1E3A8A]"
                            }`}
                          />
                        </motion.div>

                        <h3
                          className={`text-2xl font-bold ${
                            plan.popular ? "text-white" : "text-[#0F172A]"
                          }`}
                        >
                          {plan.name}
                        </h3>

                        <p
                          className={`mt-2 text-sm leading-6 ${
                            plan.popular
                              ? "text-[#DBEAFE]/90"
                              : "text-[#64748B]"
                          }`}
                        >
                          {plan.description}
                        </p>
                      </div>

                      <div className="mt-8">
                        <div className="flex items-end gap-2">
                          <span
                            className={`text-lg ${
                              plan.popular
                                ? "text-[#93C5FD]"
                                : "text-[#1E3A8A]"
                            }`}
                          >
                            {getCurrencySymbol()}
                          </span>

                          <AnimatePresence mode="wait">
                            <motion.span
                              key={billingCycle + currency + plan.name}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12 }}
                              transition={{ duration: 0.25 }}
                              className={`text-5xl font-bold tracking-tight ${
                                plan.popular
                                  ? "text-white"
                                  : "text-[#0F172A]"
                              }`}
                            >
                              {price.toLocaleString()}
                            </motion.span>
                          </AnimatePresence>

                          <span
                            className={`pb-1 ${
                              plan.popular
                                ? "text-[#93C5FD]"
                                : "text-[#64748B]"
                            }`}
                          >
                            /month
                          </span>
                        </div>

                        {billingCycle === "yearly" && (
                          <p
                            className={`mt-2 text-sm ${
                              plan.popular
                                ? "text-[#93C5FD]"
                                : "text-[#3B82F6]"
                            }`}
                          >
                            Billed annually at {getCurrencySymbol()}
                            {price.toLocaleString()}/year
                          </p>
                        )}
                      </div>

                      <div className="mt-8">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            to={plan.ctaLink}
                            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                              plan.popular
                                ? "bg-white text-[#1E3A8A] shadow-lg hover:bg-[#F8FAFC]"
                                : "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/25 hover:bg-[#1E40AF] hover:shadow-xl"
                            }`}
                          >
                            <span>{plan.cta}</span>
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </motion.span>
                          </Link>
                        </motion.div>
                      </div>

                      <div
                        className={`mt-8 border-t pt-6 ${
                          plan.popular
                            ? "border-white/15"
                            : "border-[#E2E8F0]"
                        }`}
                      >
                        <p
                          className={`mb-4 text-xs font-semibold uppercase tracking-[0.18em] ${
                            plan.popular
                              ? "text-[#93C5FD]"
                              : "text-[#1E3A8A]"
                          }`}
                        >
                          Included features
                        </p>

                        <ul className="space-y-3">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <span
                                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                                  plan.popular
                                    ? "bg-white/15"
                                    : "bg-[#DBEAFE]"
                                }`}
                              >
                                <Check
                                  className={`h-3.5 w-3.5 ${
                                    plan.popular
                                      ? "text-white"
                                      : "text-[#2563EB]"
                                  }`}
                                />
                              </span>
                              <span
                                className={`text-sm ${
                                  plan.popular
                                    ? "text-white/90"
                                    : "text-[#475569]"
                                }`}
                              >
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {plan.notIncluded.length > 0 && (
                          <>
                            <div
                              className={`my-6 border-t ${
                                plan.popular
                                  ? "border-white/15"
                                  : "border-[#E2E8F0]"
                              }`}
                            />
                            <p
                              className={`mb-4 text-xs font-semibold uppercase tracking-[0.18em] ${
                                plan.popular
                                  ? "text-[#93C5FD]/80"
                                  : "text-[#94A3B8]"
                              }`}
                            >
                              Not included
                            </p>

                            <ul className="space-y-3">
                              {plan.notIncluded.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                  <span
                                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                                      plan.popular
                                        ? "bg-white/10"
                                        : "bg-[#EFF6FF]"
                                    }`}
                                  >
                                    <X
                                      className={`h-3.5 w-3.5 ${
                                        plan.popular
                                          ? "text-[#BFDBFE]"
                                          : "text-[#93C5FD]"
                                      }`}
                                    />
                                  </span>
                                  <span
                                    className={`text-sm ${
                                      plan.popular
                                        ? "text-[#93C5FD]/80"
                                        : "text-[#94A3B8]"
                                    }`}
                                  >
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-[#F8FAFC] py-24 border-t border-[#E2E8F0]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeInUp} className="mb-14 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm text-[#1E3A8A] shadow-sm">
                <HelpCircle className="h-4 w-4 text-[#3B82F6]" />
                FAQ
              </span>

              <h2 className="mt-6 text-3xl font-bold text-[#0F172A] sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[#64748B]">
                Everything you need to know before selecting the right pricing
                plan for your diamond business.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {faqs.map((faq, index) => {
                const Icon = faq.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{
                      y: -5,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                    className="group rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[#3B82F6]/20"
                  >
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] shadow-sm"
                    >
                      <Icon className="h-5 w-5 text-[#1E3A8A]" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-[#0F172A]">
                      {faq.q}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">
                      {faq.a}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] bg-[length:140px_140px]" />
        </div>

        <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-[#93C5FD]/20 blur-3xl" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[32px] border border-white/15 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-xl md:p-16"
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="relative z-10"
            >
              <motion.div variants={fadeInUp} className="mb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                  <Diamond className="h-8 w-8 text-white" />
                </div>
              </motion.div>

              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold text-white md:text-4xl"
              >
                Ready to grow your diamond business?
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="mx-auto mt-4 max-w-2xl text-lg text-[#93C5FD]"
              >
                Join trusted dealers and start trading with confidence on a
                secure, transparent, and premium diamond exchange platform.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-[#1E3A8A] shadow-lg transition-all duration-300 hover:bg-[#EFF6FF]"
                  >
                    Get Started Free
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="rounded-2xl border border-white/30 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/10"
                  >
                    Contact Sales
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;