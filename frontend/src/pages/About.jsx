import React from "react";
import UiCard from "../components/ui/UiCard";
import Logo from "../assets/NextGen.png";

import { FaUsers, FaAward, FaShippingFast, FaHeadset, FaShieldAlt, FaRocket, FaGlobe, FaHeart, FaLightbulb, FaCog } from "react-icons/fa";

export default function About() {
  const features = [
    {
      icon: <FaRocket className="w-8 h-8 text-blue-400" />,
      title: "Innovation First",
      description: "We stay ahead of the curve with the latest technology and cutting-edge electronics.",
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-green-400" />,
      title: "Quality Assurance",
      description: "Every product undergoes rigorous testing to ensure the highest quality standards.",
    },
    {
      icon: <FaShippingFast className="w-8 h-8 text-purple-400" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to get your products to you as soon as possible.",
    },
    {
      icon: <FaHeadset className="w-8 h-8 text-orange-400" />,
      title: "24/7 Support",
      description: "Our dedicated support team is always here to help you with any questions.",
    },
    {
      icon: <FaAward className="w-8 h-8 text-yellow-400" />,
      title: "Award Winning",
      description: "Recognized for excellence in customer service and product quality.",
    },
    {
      icon: <FaHeart className="w-8 h-8 text-red-400" />,
      title: "Customer Focused",
      description: "Your satisfaction is our priority. We build lasting relationships with our customers.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "10K+", label: "Products Sold" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Customer Support" },
  ];

  const team = [
    {
      name: "Nizam Muhammed",
      role: "CEO & Founder",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQH2vADKxW151w/profile-displayphoto-crop_800_800/B56ZlLVJNcJsAI-/0/1757905459068?e=1761177600&v=beta&t=OXF2n8TSq_D-pd__oFTtK4m4_ecxId4XQ5s0JtHcnws",
      description: "Visionary leader, versatile full stack developer, and tech lead with over 5 years of experience in the technology industry.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Technology expert passionate about innovation",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Customer Experience",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Customer advocate ensuring exceptional service",
    },
    {
      name: "David Kim",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Full-stack developer building amazing experiences",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-glass mb-6 heading-glass-xl">About NextGen Electronics</h1>
          <p className="text-xl text-glass-muted max-w-3xl mx-auto leading-relaxed">
            We're passionate about bringing you the latest and greatest in electronics technology. From smartphones to smart home devices, we curate the best products for the modern lifestyle.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <UiCard key={index} className="text-center p-6 glass-hover">
              <div className="text-3xl font-bold text-glass mb-2">{stat.number}</div>
              <div className="text-glass-muted">{stat.label}</div>
            </UiCard>
          ))}
        </div>

        {/* Our Story */}
        <UiCard className="mb-16 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-glass mb-6 heading-glass">Our Story</h2>
              <div className="space-y-4 text-glass-muted leading-relaxed">
                <p>Founded in 2020, NextGen Electronics started as a small team of tech enthusiasts who believed that everyone should have access to the latest technology at affordable prices.</p>
                <p>
                  What began as a passion project has grown into a trusted platform serving thousands of customers worldwide. We've built our reputation on quality, reliability, and exceptional
                  customer service.
                </p>
                <p>Today, we continue to innovate and expand our product range, always staying true to our mission of making cutting-edge technology accessible to everyone.</p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 flex items-center justify-center">
                <img src={Logo} alt="NextGen Electronics" className="w-full h-full text-blue-400/50" />
              </div>
            </div>
          </div>
        </UiCard>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-glass text-center mb-12 heading-glass">Why Choose NextGen Electronics?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <UiCard key={index} className="p-6 text-center glass-hover">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-glass mb-3">{feature.title}</h3>
                <p className="text-glass-muted leading-relaxed">{feature.description}</p>
              </UiCard>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <UiCard className="p-8 glass-hover">
            <div className="flex items-center mb-6">
              <FaLightbulb className="w-8 h-8 text-yellow-400 mr-4" />
              <h3 className="text-2xl font-bold text-glass heading-glass">Our Mission</h3>
            </div>
            <p className="text-glass-muted leading-relaxed">
              To democratize access to cutting-edge technology by providing high-quality electronics at competitive prices, backed by exceptional customer service and support.
            </p>
          </UiCard>

          <UiCard className="p-8 glass-hover">
            <div className="flex items-center mb-6">
              <FaCog className="w-8 h-8 text-blue-400 mr-4" />
              <h3 className="text-2xl font-bold text-glass heading-glass">Our Vision</h3>
            </div>
            <p className="text-glass-muted leading-relaxed">
              To become the world's most trusted electronics platform, where technology meets accessibility, and every customer feels valued and supported in their tech journey.
            </p>
          </UiCard>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-glass text-center mb-12 heading-glass">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <UiCard key={index} className="p-6 text-center glass-hover">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/20">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-glass mb-1">{member.name}</h3>
                <p className="text-blue-400 mb-2 font-medium">{member.role}</p>
                <p className="text-glass-muted text-sm leading-relaxed">{member.description}</p>
              </UiCard>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <UiCard className="text-center p-8 glass-hover">
          <h2 className="text-3xl font-bold text-glass mb-4 heading-glass">Ready to Experience NextGen?</h2>
          <p className="text-glass-muted mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust NextGen Electronics for their technology needs. Start shopping today and discover the difference quality makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-glass-primary px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">Shop Now</button>
            <button className="btn-glass px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">Contact Us</button>
          </div>
        </UiCard>
      </div>
    </div>
  );
}
