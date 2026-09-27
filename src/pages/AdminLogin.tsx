/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueries } from '../context/QueryContext';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useQueries();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, skip login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both credentials.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      setIsLoading(false);
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid Email or Password.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Authentication failed due to connection issues.');
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-primary relative px-6 py-12 overflow-hidden">
      {/* Visual glowing bubbles mimicking luxury modern glass aesthetics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-on-tertiary-container/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary-container/30 blur-[150px] pointer-events-none" />

      {/* Floating brand background back button */}
      <div className="absolute top-8 left-8 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back To School Website
        </Link>
      </div>

      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="glass-card p-8 sm:p-10 rounded-3xl border border-white/20 shadow-2xl space-y-8 backdrop-blur-xl bg-white/10"
        >
          {/* Header branding */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-white/20 flex items-center justify-center mx-auto shadow-inner">
              <img src="/src/assets/images/school_logo_1784036754445.jpg" alt="Professor Global School Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Staff Portal Login</h2>
              <p className="text-white/60 text-xs mt-1">
                Enter your administrative credentials to manage enquiries
              </p>
            </div>
          </div>

          {/* Form error feedback */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/20 border border-red-500/30 p-4 rounded-xl flex items-start gap-2.5 text-red-200 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-white uppercase tracking-widest" htmlFor="email">
                Registry Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4.5 h-4.5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:border-white focus:bg-white/15 focus:outline-none transition-all duration-300 font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-white uppercase tracking-widest" htmlFor="password">
                Secret Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4.5 h-4.5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:border-white focus:bg-white/15 focus:outline-none transition-all duration-300 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-on-tertiary-container text-on-tertiary font-bold py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Authorize & Enter Dashboard'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
};
