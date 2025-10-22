import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "../pages/user/HomePage.jsx";
import Plan from "../pages/user/PlanPage.jsx";
import Book from "../pages/user/BookPage.jsx";
import Trips from "../pages/user/TripsPage.jsx";
import Profile from "../pages/user/ProfilePage.jsx";

import DestinationDetailPage from "../pages/user/DestinationDetailPage";
import DetailPage from "../pages/user/DetailPage";

import Footer from "../components/user/Footer.jsx";
import Navbar from "../components/user/Navbar.jsx";
import LoginPage from "../pages/user/LoginPage.jsx";
import SignUp from "../pages/user/SignUpPage.jsx";
import ForgotPasswordPage from "../pages/user/ForgotPasswordPage.jsx";
import PaymentPage from "../pages/user/PaymentPage.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutPage from "../pages/user/AboutPage.jsx";
import FavoritePage from "../pages/user/FavoritePage.jsx";

import AdminLogin from "../components/admin/AdminLogin.jsx";
import AdminSignup from "../components/admin/AdminSignup.jsx";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminTrips from "../pages/admin/AdminTrips.jsx";
import AdminEvents from "../pages/admin/AdminEvents.jsx";
import AdminPayments from "../pages/admin/AdminPayments.jsx";
import AdminPassengers from "../pages/admin/AdminPassengers.jsx";
import AdminEnquiries from "../pages/admin/AdminEnquiries.jsx";
import AdminProfile from "../pages/admin/AdminProfile.jsx";

// Layout
import AdminLayout from "../Layout/Layout.jsx";
import Events from "../pages/user/Event.jsx";
import EventDetailPage from "../components/user/EventDetailPage.jsx";
import ScrollToTop from "../components/user/ScrollToTop.jsx";
import BottomNav from "../components/user/BottomNav.jsx";
import CustomItineraryPayment from "../pages/user/CustomItineraryPayment.jsx";
import AdminVectorImage from "../pages/admin/AdminVectorImage.jsx";
import AdminCategories from "../pages/admin/AdminCategories.jsx";

const AppContent = () => {
  const location = useLocation();

  // check karo agar current path admin route hai
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {/* <TestimonialCarousel /> */}
      <Routes >
        {/* ================= User Routes ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/book" element={<Book />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/profile" element={<Profile />} />


        <Route path="/event" element={<Events />} />
        <Route path="/event-detail/:id" element={<EventDetailPage />} />

        <Route path="/destination" element={<DestinationDetailPage />} />
        <Route path="/detail-page/:tripId" element={<DetailPage />} />

        <Route path="/favorites" element={<FavoritePage />} />
        <Route path="/payment/:tripId" element={<PaymentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/custom-itinerary-payment" element={<CustomItineraryPayment />} />
        {/* ================= Admin Auth Routes ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* ================= Admin Protected Layout ================= */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/trips" element={<AdminTrips />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/passengers" element={<AdminPassengers />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          <Route path="/admin/vector-image" element={<AdminVectorImage />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
      <BottomNav/>
      {/* {!isAdminRoute && <Footer />} */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop/>
      <AppContent />
    </Router>
  );
};

export default AppRoutes;

