// File: formAI/frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ReactTyped as Typed } from "react-typed";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 pt-20">
             {/* Hero Section with Clear Value Proposition */}
       <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24 px-4 text-center">
         <div className="max-w-5xl mx-auto">
           <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
             Create AI-Powered Forms in <span className="text-yellow-400">Seconds</span>
           </h1>
           <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
             Transform your data collection with intelligent forms that adapt, analyze, and protect. 
             No coding required.
           </p>
           <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
             <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
               Get Started Free
             </Link>
             <Link to="/login" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
               Sign In
             </Link>
           </div>
           <div className="mt-12 flex justify-center">
             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl">
               <p className="text-blue-100 text-sm mb-2">✨ Live Demo</p>
               <p className="text-white font-medium">"Create a customer feedback form for a restaurant"</p>
             </div>
           </div>
         </div>
       </section>

             {/* Features Section with Enhanced Card Design */}
       <section className="py-20 px-4 bg-white">
         <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-bold mb-4 text-gray-900">Everything you need to create amazing forms</h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">From AI-powered generation to intelligent analytics, FormAI has you covered</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* AI Form Generation */}
             <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
               <div className="p-8">
                 <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                   <span className="text-2xl">🤖</span>
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">AI-Powered Generation</h3>
                 <p className="text-gray-600 leading-relaxed mb-6">Describe your form in plain English and watch AI create the perfect structure with smart question types.</p>
                 <div className="text-sm text-blue-600 font-medium">Try: "Create a customer feedback form"</div>
               </div>
             </div>

             {/* Conversational Forms */}
             <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
               <div className="p-8">
                 <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                   <span className="text-2xl">💬</span>
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Conversational Experience</h3>
                 <p className="text-gray-600 leading-relaxed mb-6">Forms that adapt in real-time, rephrasing questions conversationally for better engagement.</p>
                 <div className="text-sm text-purple-600 font-medium">Dynamic question flow</div>
               </div>
             </div>

             {/* AI Insights */}
             <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
               <div className="p-8">
                 <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                   <span className="text-2xl">📊</span>
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Intelligent Analytics</h3>
                 <p className="text-gray-600 leading-relaxed mb-6">Get AI-powered insights on responses, sentiment analysis, and trend identification automatically.</p>
                 <div className="text-sm text-green-600 font-medium">No manual analysis needed</div>
               </div>
             </div>

             {/* Spam Protection */}
             <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
               <div className="p-8">
                 <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors">
                   <span className="text-2xl">🛡️</span>
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Spam Protection</h3>
                 <p className="text-gray-600 leading-relaxed mb-6">AI detects and blocks suspicious submissions, keeping your data clean and reliable.</p>
                 <div className="text-sm text-red-600 font-medium">Built-in security</div>
               </div>
             </div>

             {/* Custom Themes */}
             <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
               <div className="p-8">
                 <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-200 transition-colors">
                   <span className="text-2xl">🎨</span>
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Beautiful Themes</h3>
                 <p className="text-gray-600 leading-relaxed mb-6">Customize colors, logos, and branding to match your company's visual identity.</p>
                 <div className="text-sm text-yellow-600 font-medium">Drag & drop builder</div>
               </div>
             </div>

             {/* Data Security */}
             <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
               <div className="p-8">
                 <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                   <span className="text-2xl">🔒</span>
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Enterprise Security</h3>
                 <p className="text-gray-600 leading-relaxed mb-6">JWT authentication, rate limiting, and customizable data retention policies.</p>
                 <div className="text-sm text-indigo-600 font-medium">GDPR compliant</div>
               </div>
             </div>
           </div>
         </div>
       </section>

             {/* Enhanced Footer */}
       <footer className="bg-gray-900 text-white py-16 px-4">
         <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="col-span-1 md:col-span-2">
               <h3 className="text-2xl font-bold text-blue-400 mb-4">FormAI</h3>
               <p className="text-gray-300 mb-6 max-w-md">
                 Transform your data collection with AI-powered forms that adapt, analyze, and protect your data.
               </p>
               <div className="flex space-x-4">
                 <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                   <span className="text-white font-bold">F</span>
                 </div>
                 <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                   <span className="text-white font-bold">A</span>
                 </div>
                 <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                   <span className="text-white font-bold">I</span>
                 </div>
               </div>
             </div>
             
             <div>
               <h4 className="text-lg font-semibold mb-4">Product</h4>
               <ul className="space-y-2 text-gray-300">
                 <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
               </ul>
             </div>
             
             <div>
               <h4 className="text-lg font-semibold mb-4">Company</h4>
               <ul className="space-y-2 text-gray-300">
                 <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
               </ul>
             </div>
           </div>
           
           <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
             <p className="text-gray-400">&copy; 2025 FormAI. All rights reserved.</p>
             <div className="flex space-x-6 mt-4 md:mt-0">
               <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
               <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
             </div>
           </div>
         </div>
       </footer>
    </div>
  );
};

export default Home;
