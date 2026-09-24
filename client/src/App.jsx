import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import Layout from './components/layout/Layout.jsx';

import HomePage from './pages/HomePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import DestinationDetailPage from './pages/DestinationDetailPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AuthPage from './pages/AuthPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/destination/:id" element={<DestinationDetailPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
