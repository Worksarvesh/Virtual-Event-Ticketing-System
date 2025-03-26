/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UserAccountPage from './pages/UserAccountPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AddEvent from './pages/AddEvent';
import EventPage from './pages/EventPage';
import CalendarView from './pages/CalendarView';
import OrderSummary from './pages/OrderSummary';
import PaymentSummary from './pages/PaymentSummary';
import TicketPage from './pages/TicketPage';
import Analytics from './pages/Analytics';
import CreatorDashboard from './pages/CreatorDashboard';
import { UserContextProvider } from './UserContext';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/useraccount" element={<UserAccountPage />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/create-event" element={<AddEvent />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/wallet" element={<TicketPage />} />
            <Route path="/event/:id/ordersummary" element={<OrderSummary />} />
            <Route path="/event/:id/ordersummary/paymentsummary" element={<PaymentSummary />} />
            <Route path="/events/:id/analytics" element={<Analytics />} />
            <Route path="/dashboard" element={<CreatorDashboard />} />
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
