// client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Home, 
  Target, 
  BookOpen, 
  Trophy, 
  Calendar,
  Users,
  BarChart3,
  MessageCircle,
  Settings,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Play,
  Heart,
  Share2,
  Plus,
  Bell
} from 'lucide-react';

// Import our custom hook
import useAuth from './hooks/useAuth';

// Import Dashboard component
import Dashboard from './components/dashboard/CommunityDashboard';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Login Component
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back to Prometheus! 🔥');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '28rem', position: 'relative', zIndex: 10 }}
      >
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{
              backgroundColor: '#f97316',
              color: '#fff',
              width: '3rem',
              height: '3rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginRight: '0.75rem'
            }}>
              <Zap />
            </div>
            <h1 style={{ color: '#fff', fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>PROMETHEUS</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>AI-Powered Strength Training Community</p>
        </div>

        {/* Login Form */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '0.75rem',
          border: '1px solid #374151',
          padding: '2rem'
        }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ position: 'relative' }}>
                <Mail style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  color: '#9ca3af' 
                }} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  color: '#9ca3af' 
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Remember me</span>
              </label>
              <button 
                type="button" 
                style={{ 
                  fontSize: '0.875rem', 
                  color: '#f97316', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#c2410c' : '#f97316',
                color: '#fff',
                fontWeight: 'bold',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
            <strong>Demo:</strong> Use any email/password to access the community
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Simple Dashboard Component (temporary)
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      {/* Simple Header */}
      <nav style={{ 
        backgroundColor: '#1f2937', 
        borderBottom: '1px solid #374151', 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            backgroundColor: '#f97316',
            color: '#fff',
            width: '2rem',
            height: '2rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem'
          }}>
            <Zap />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Prometheus</span>
          <span style={{ color: '#f97316', marginLeft: '0.5rem', fontSize: '0.875rem' }}>COMMUNITY</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Welcome, {user?.name}</span>
          <button
            onClick={logout}
            style={{
              backgroundColor: '#f97316',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Simple Content */}
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 Community Dashboard</h1>
        <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '2rem' }}>
          Welcome to the Prometheus Community! Your profile is ready.
        </p>
        
        <div style={{
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '0.5rem',
          padding: '2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '6rem',
            height: '6rem',
            backgroundColor: '#f97316',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 auto 1rem auto'
          }}>
            {user?.avatar}
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user?.name}</h2>
          <p style={{ color: '#f97316', fontSize: '1.125rem', marginBottom: '1rem' }}>{user?.title}</p>
          <p style={{ color: '#9ca3af' }}>
            🚀 Dashboard components are being built step by step!<br/>
            Next: Feed, Profile, Navigation, and more...
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            backgroundColor: '#f97316',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Zap style={{ color: '#fff' }} />
          </div>
          <p style={{ color: '#9ca3af' }}>Loading Prometheus...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#111111',
                color: '#ffffff',
                border: '1px solid #333333',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#ff6600',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          
          <Routes>
            <Route
              path="/"
              element={user ? <Dashboard /> : <Login />}
            />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;// Backup der ursprünglichen App.js vor Reparatur
