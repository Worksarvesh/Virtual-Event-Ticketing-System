/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/IndexPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import UserAccountPage from './pages/UserAccountPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AddEvent from './pages/AddEvent';
import EventPage from './pages/EventPage';
import CalendarView from './pages/CalendarView';
import OrderSummary from './pages/OrderSummary';
import PaymentSummary from './pages/PaymentSummary';
import TicketPage from './pages/TicketPage';
import CreatEvent from './pages/CreateEvent';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import Analytics from './pages/Analytics';
import CreatorDashboard from './pages/CreatorDashboard';

axios.defaults.baseURL = 'http://localhost:4000/';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/events/:id/analytics" element={<Analytics />} />
            <Route path="/dashboard" element={<CreatorDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </UserContextProvider>
  );
}

export default App;
