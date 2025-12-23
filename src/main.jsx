import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './auth/Login.jsx'
import LoginAdmin from './auth/LoginAdmin.jsx'
import VerifyOtp from './auth/VerifyOtp.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminProducts from './pages/AdminProducts.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import Katalog from './pages/Katalog.jsx'
import Pesanan from './pages/Pesanan.jsx'
import UserProfile from './pages/UserProfile.jsx'
import Keranjang from './pages/Keranjang.jsx'
import Wishlist from './pages/Wishlist.jsx'
import KeranjangPage from './pages/KeranjangPage.jsx'
import PaymentStatus from './pages/PaymentStatus.jsx'
import Checkout from './pages/Checkout.jsx'
import Payment from './pages/Payment.jsx'
import PaymentHistory from './pages/PaymentHistory.jsx'
import Tentang from './pages/Tentang.jsx'
import Kontak from './pages/Kontak.jsx'
import { StrictMode } from 'react'
import ScrollToTop from './components/ScrollToTop'
import DetailPesanan from './pages/DetailPesanan'
import UserHome from './pages/UserHome'
import AdminCustomers from './pages/AdminCustomers'
import AdminReports from './pages/AdminReports'
import AdminChat from './pages/AdminChat'
import UserChat from './pages/UserChat'
import UserPresenceProvider from './components/UserPresenceProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserPresenceProvider>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<UserHome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin/login' element={<LoginAdmin />} />
          <Route path='/admin/verify-otp' element={<VerifyOtp />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/products' element={<AdminProducts />} />
          <Route path='/admin/orders' element={<AdminOrders />} />
          <Route path='/katalog' element={<Katalog />} />
          <Route path='/keranjang' element={<KeranjangPage />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/payment-history' element={<PaymentHistory />} />
          <Route path='/payment-status/:externalId' element={<PaymentStatus />} />
          <Route path='/pesanan' element={<Pesanan />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path="/pesanan/:id" element={<DetailPesanan />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/chat" element={<UserChat />} />
          <Route path="/admin/pelanggan" element={<AdminCustomers />} />
          <Route path="/admin/laporan" element={<AdminReports />} />
          <Route path="/admin/chat" element={<AdminChat />} />
        </Routes>
      </UserPresenceProvider>
    </BrowserRouter>
  </StrictMode >,
)
