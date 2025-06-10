
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { CreatePage } from '@/pages/CreatePage';
import { ReelsPage } from '@/pages/ReelsPage';
import { ProfilePage } from '@/pages/ProfilePage';
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
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/reels" element={<ReelsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
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
