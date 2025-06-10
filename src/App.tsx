
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import { FlightsPage } from '@/pages/FlightsPage';
import { AddFlightPage } from '@/pages/AddFlightPage';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { TopHeader } from '@/components/TopHeader';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-black text-white font-system">
          {/* Top Header */}
          <TopHeader />
          
          {/* Main Content */}
          <main className="pb-16 pt-14">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/add-flight" element={<AddFlightPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
            </Routes>
          </main>

          {/* Bottom Navigation */}
          <BottomNavigation />
          
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
