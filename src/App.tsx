/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryProvider } from './context/QueryContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingApplyButton } from './components/FloatingApplyButton';
import { Home } from './pages/Home';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AssemblyPage } from './pages/AssemblyPage';
import { CurricularActivitiesPage } from './pages/CurricularActivitiesPage';
import { HouseSystemPage } from './pages/HouseSystemPage';
import { WorkshopPage } from './pages/WorkshopPage';
import { PublicDisclosurePage } from './pages/PublicDisclosurePage';
import { ImportantLinksPage } from './pages/ImportantLinksPage';
import { NewsletterPage } from './pages/NewsletterPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { PdfViewerModal } from './components/PdfViewerModal';

// Layout manager that conditionally renders the global header and footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <div className="flex-grow">{children}</div>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <FloatingApplyButton />}
      <PdfViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <QueryProvider>
      <ToastProvider>
      <Router>
        <MainLayout>
          <Routes>
            {/* Main School Portal */}
            <Route path="/" element={<Home />} />
            
            {/* Co-Curricular Activities Pages */}
            <Route path="/assembly" element={<AssemblyPage />} />
            <Route path="/activities/assembly" element={<AssemblyPage />} />

            <Route path="/curricular-activities" element={<CurricularActivitiesPage />} />
            <Route path="/activities/curricular" element={<CurricularActivitiesPage />} />

            <Route path="/house-system" element={<HouseSystemPage />} />
            <Route path="/activities/house-system" element={<HouseSystemPage />} />

            <Route path="/workshops" element={<WorkshopPage />} />
            <Route path="/workshop" element={<WorkshopPage />} />
            <Route path="/activities/workshop" element={<WorkshopPage />} />

            {/* Mandatory Public Disclosure Page */}
            <Route path="/public-disclosure" element={<PublicDisclosurePage />} />
            <Route path="/public-disclosures" element={<PublicDisclosurePage />} />
            <Route path="/mandatory-disclosure" element={<PublicDisclosurePage />} />

            {/* Downloads Page */}
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/download" element={<DownloadsPage />} />

            {/* Important Links Page */}
            <Route path="/important-links" element={<ImportantLinksPage />} />
            <Route path="/important-link" element={<ImportantLinksPage />} />

            {/* School Newsletter Archive Page */}
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/newsletters" element={<NewsletterPage />} />

            {/* Staff Management Portal */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Catch-all Fallback Redirect */}
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </Router>
          </ToastProvider>
    </QueryProvider>
  );
}
