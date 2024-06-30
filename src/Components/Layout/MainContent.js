import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Project/Dashboard';
import BrokerLogin from '../Project/BrokerLogin';
import MonthlyStatus from '../Project/MonthlyStatus';
import AllUsers from '../Project/AllUsers';
import NestedRoutes from './NestedRoutes';
import NestedRoutesFuture from './NestedRoutesFuture';
import PatchUpdate from '../Project/PatchUpdate';
import WatchList from '../Project/HeaderComponent/WatchList';
import Orders from '../Project/HeaderComponent/Orders';
import Trades from '../Project/HeaderComponent/Trades';
import Portfolio from '../Project/HeaderComponent/Portfolio';
import NetPositions from '../Project/HeaderComponent/NetPositions';
import AboutUs from '../Project/AboutUs';

const MainContent = () => {
  return (
    <main>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/broker-login" element={<BrokerLogin />} />
        <Route path="/monthly-status" element={<MonthlyStatus />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/patch-update" element={<PatchUpdate/>} />
        <Route path="/equity/*" element={<NestedRoutes />} />
        <Route path="/future-options/*" element={<NestedRoutesFuture />} />
        <Route path="/watch-list" element={<WatchList/>} />
        <Route path="/aboutUs" element={<AboutUs/>} />
        <Route path="orders" element={<Orders />} />
            <Route path="trades" element={<Trades />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="net-positions" element={<NetPositions />} />
      </Routes>
    </main>
  );
};

export default MainContent;
