
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import { FlightsPage } from '@/pages/FlightsPage';
import { AddFlightPage } from '@/pages/AddFlightPage';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { TopHeader } from '@/components/TopHeader';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground font-system">
            {/* Top Header */}
            <TopHeader />
            
            {/* Main Content */}
            <main className="pb-16 pt-14">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/flights" element={<FlightsPage />} />
                <Route path="/add-flight" element={<AddFlightPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation />
            
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
