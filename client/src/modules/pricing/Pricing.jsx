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
} from "lucide-react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currency, setCurrency] = useState("USD");

  const exchangeRate = 83; // 1 USD = 83 INR

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
      description: "Perfect for individuals and small businesses getting started.",
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: [
        "Up to 5 projects",
        "Basic analytics",
        "Email support",
        "1GB secure storage",
        "Standard API access",
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
      badge: "For Individuals",
    },
    {
      name: "Professional",
      icon: Sparkles,
      description: "Best for scaling teams that need better collaboration and insights.",
      monthlyPrice: 79,
      yearlyPrice: 66,
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "50GB secure storage",
        "Full API access",
        "Custom integrations",
        "Team collaboration",
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
      description: "Enterprise-grade solution for large organizations with custom needs.",
      monthlyPrice: 199,
      yearlyPrice: 166,
      features: [
        "Unlimited everything",
        "Custom analytics",
        "24/7 phone & email support",
        "Unlimited storage",
        "Advanced API access",
        "Custom integrations",
        "Team collaboration",
        "Dedicated account manager",
        "SLA guarantee",
      ],
      notIncluded: [],
      popular: false,
      cta: "Contact Sales",
      ctaLink: "/register",
      badge: "For Enterprises",
    },
  ];

  const faqs = [
    {
      q: "Can I change my plan later?",
      a: "Yes. You can upgrade or downgrade your plan anytime. Changes are applied smoothly without losing your data.",
      icon: Diamond,
    },
    {
      q: "Do you offer a free trial?",
      a: "Yes, every paid plan includes a 14-day free trial so you can explore the platform before committing.",
      icon: Sparkles,
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all major credit cards, debit cards, and custom invoicing options for enterprise customers.",
      icon: Building2,
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. We use secure infrastructure, encrypted storage practices, and enterprise-ready access controls.",
      icon: HelpCircle,
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Simple Header with Toggle */}
      <section className="relative py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Simple, transparent pricing
              </h1>
              <p className="text-slate-600 max-w-xl mx-auto mb-8">
                Choose the perfect plan for your needs. All plans include a 14-day free trial.
              </p>
            </motion.div>

            {/* Currency Toggle */}
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center gap-2 p-1 bg-slate-200 rounded-lg">
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    currency === "USD"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    currency === "INR"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  INR (₹)
                </button>
              </div>
            </motion.div>

            {/* Billing Toggle */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-4 p-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    billingCycle === "monthly"
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    billingCycle === "yearly"
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Yearly
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="relative py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const price = getPrice(usdPrice);

              return (
                <motion.div
                  key={plan.name}
                  variants={fadeInUp}
                  whileHover={{
                    y: -12,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  className={`group relative rounded-3xl border transition-all duration-500 ${
                    plan.popular
                      ? "border-slate-200 bg-slate-900 text-white shadow-2xl shadow-slate-900/20 md:-mt-8 md:mb-8"
                      : "border-slate-200 bg-white shadow-xl shadow-slate-900/5 hover:shadow-2xl"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
                      <motion.span
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg"
                      >
                        <Star className="h-4 w-4 fill-current" />
                        Most Popular
                      </motion.span>
                    </div>
                  )}

                  <div className="relative overflow-hidden rounded-3xl p-8">
                    {/* Hover gradient effect */}
                    <div className={`absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 ${
                      plan.popular ? "hidden" : "bg-gradient-to-br from-emerald-50 to-teal-50"
                    }`} />

                    <div className="relative z-10">
                      <div className="mb-6">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-4 ${
                            plan.popular
                              ? "bg-white/15"
                              : "bg-slate-100 group-hover:bg-slate-200 transition-colors"
                          }`}
                        >
                          <Icon className={`h-7 w-7 ${plan.popular ? "text-emerald-400" : "text-slate-900"}`} />
                        </motion.div>

                        <h3 className={`text-2xl font-bold ${plan.popular ? "text-white" : "text-slate-900"}`}>
                          {plan.name}
                        </h3>
                        <p className={`mt-2 text-sm leading-6 ${plan.popular ? "text-slate-300" : "text-slate-600"}`}>
                          {plan.description}
                        </p>
                      </div>

                      <div className="mt-8">
                        <div className="flex items-end gap-2">
                          <span className={`text-lg ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>{getCurrencySymbol()}</span>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={billingCycle + currency + plan.name}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12 }}
                              transition={{ duration: 0.25 }}
                              className={`text-5xl font-bold tracking-tight ${plan.popular ? "text-white" : "text-slate-900"}`}
                            >
                              {price.toLocaleString()}
                            </motion.span>
                          </AnimatePresence>
                          <span className={`pb-1 ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>/month</span>
                        </div>

                        {billingCycle === "yearly" && (
                          <p className={`mt-2 text-sm ${plan.popular ? "text-emerald-400" : "text-emerald-600"}`}>
                            Billed annually at {getCurrencySymbol()}{price.toLocaleString()}/year
                          </p>
                        )}
                      </div>

                      <div className="mt-8">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            to={plan.ctaLink}
                            className={`group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 overflow-hidden relative ${
                              plan.popular
                                ? "bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
                                : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20"
                            }`}
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              {plan.cta}
                              <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.span>
                            </span>
                          </Link>
                        </motion.div>
                      </div>

                      <div className={`mt-8 border-t pt-6 ${plan.popular ? "border-slate-700" : "border-slate-200"}`}>
                        <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.18em] ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                          Included features
                        </p>

                        <ul className="space-y-3">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${plan.popular ? "bg-emerald-500/20" : "bg-emerald-100"}`}>
                                <Check className={`h-3.5 w-3.5 ${plan.popular ? "text-emerald-400" : "text-emerald-600"}`} />
                              </span>
                              <span className={`text-sm ${plan.popular ? "text-slate-300" : "text-slate-700"}`}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {plan.notIncluded.length > 0 && (
                          <>
                            <div className={`my-6 border-t ${plan.popular ? "border-slate-700" : "border-slate-200"}`} />
                            <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.18em] ${plan.popular ? "text-slate-500" : "text-slate-400"}`}>
                              Not included
                            </p>

                            <ul className="space-y-3">
                              {plan.notIncluded.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                  <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${plan.popular ? "bg-white/5" : "bg-slate-100"}`}>
                                    <X className={`h-3.5 w-3.5 ${plan.popular ? "text-slate-500" : "text-slate-400"}`} />
                                  </span>
                                  <span className={`text-sm ${plan.popular ? "text-slate-500" : "text-slate-400"}`}>
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

      {/* FAQ - Light section */}
      <section className="relative py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeInUp} className="mb-14 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                <HelpCircle className="h-4 w-4 text-emerald-600" />
                FAQ
              </span>

              <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-500">
                Everything you need to know before choosing your plan.
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
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:bg-slate-100 transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow"
                    >
                      <Icon className="h-5 w-5 text-slate-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-900">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA - Dark section like Home page Trust/CTA section */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        {/* Animated background */}
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(16,185,129,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />

        {/* Floating shapes */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [0, -180, -360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5 }}
            className="relative bg-slate-800 rounded-3xl p-10 md:p-16 text-center border border-slate-700 shadow-2xl overflow-hidden"
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="relative z-10"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="mb-4"
              >
                <Diamond className="w-12 h-12 mx-auto text-emerald-400" />
              </motion.div>

              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                Ready to get started?
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-slate-400 text-lg mb-8 max-w-xl mx-auto"
              >
                Join thousands of satisfied customers and start your journey today.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="group/btn relative px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2 overflow-hidden"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                    />
                    <span className="relative">Get Started Free</span>
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
                  <Link
                    to="/contact"
                    className="px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-xl hover:border-slate-400 hover:bg-slate-700/50 transition-all duration-300"
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