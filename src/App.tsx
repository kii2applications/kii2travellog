
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import { ProfilePage } from '@/pages/ProfilePage';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { AddFlightPage } from '@/pages/AddFlightPage';
import { FlightsPage } from '@/pages/FlightsPage';
import { Header } from '@/components/Header';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { Auth } from '@/components/auth/Auth';
import { useAuth } from '@/hooks/useAuth';

import './App.css';

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-system">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth component if user is not logged in
  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-system">
      <Header />
      
      {/* PWA Install Button - Mobile optimized */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-end">
          <PWAInstallButton />
        </div>
      </div>

      <div className="min-h-screen pb-20 md:pb-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/add-flight" element={<AddFlightPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>

      <MobileNavigation />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
