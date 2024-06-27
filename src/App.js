import React, { useState, useEffect } from 'react';
import '@elastic/eui/dist/eui_theme_light.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import '@elastic/eui/dist/eui_theme_dark.css'; // Import dark theme CSS
import { EuiProvider, EuiIcon, EuiSideNav } from '@elastic/eui';
import HeaderUpdates from './Components/Layout/HeaderUpdates';
import Sidebar from './Components/Layout/Sidebar';
import './App.css';
import LoginForm from './Components/Auth/LoginForm';
import axios from 'axios';
import { setStatusData, setEquityData, setEquityOrderData, clearAllStores, setUsersData, setFutureData, setFutureOrderData } from './indexeddb';
import SignupForm from './Components/Auth/SignupForm';

const App = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const headers = {
    'Authorization': `Bearer ${KiteId?.access}`
  };

  console.log("hjkhjhkhk", window.location.pathname)
  const protectedroute = JSON.parse(localStorage.getItem('login'));
  const doNotCall = JSON.parse(localStorage.getItem('donotCallApi'));
  const [colorMode, setColorMode] = useState('light');
  const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);
  const pathname = window.location.pathname === "/dashboard" ? "Dashboard" :
    window.location.pathname === "/broker-login" ? "Login with your broker" :
      window.location.pathname === "/monthly-status" ? "Monthly status" :
        window.location.pathname === "/all-users" ? "All users" :
          window.location.pathname === "/equity" ? "BlinkTrade Equity" : "Dashboard";

  const [selectedItemName, setSelectedItemName] = useState(pathname); // Default selected item
  const navigate = useNavigate();

  const toggleOpenOnMobile = () => {
    setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);
  };

  const handleItemClick = (name, path) => {
    setSelectedItemName(name);
    navigate(path);
  };

  const sideNav = [
    {
      name: 'Quantrade - AI',
      id: 'kibana',
      icon: <EuiIcon type="logoKibana" />,
      items: [
        {
          name: 'Dashboard',
          id: 'dashboard',
          onClick: () => handleItemClick('Dashboard', '/dashboard'),
          className: 'custom-margin',
          icon: <EuiIcon type="layers" />,
          isSelected: selectedItemName === 'Dashboard',
        },
        {
          name: 'Login with your broker',
          id: 'broker-login',
          onClick: () => handleItemClick('Login with your broker', '/broker-login'),
          className: 'custom-margin',
          icon: <EuiIcon type="indexPatternApp" />,
          isSelected: selectedItemName === 'Login with your broker',
        },
        {
          name: 'Monthly status',
          id: 'monthly-status',
          onClick: () => handleItemClick('Monthly status', '/monthly-status'),
          className: 'custom-margin',
          icon: <EuiIcon type="esqlVis" />,
          isSelected: selectedItemName === 'Monthly status',
        },
        {
          name: 'All users',
          id: 'all-users',
          onClick: () => handleItemClick('All users', '/all-users'),
          className: 'custom-margin',
          icon: <EuiIcon type="user" />,
          isSelected: selectedItemName === 'All users',
        },
        {
          name: 'Equity',
          id: 'equity',
          onClick: () => handleItemClick('Equity', '/equity'),
          className: 'custom-margin',
          icon: <EuiIcon type="stats" />,
          isSelected: selectedItemName === 'Equity',
          items: [
            {
              name: 'Equity',
              id: 'blinktrade-equity',
              icon: <EuiIcon type="stats" />,
              onClick: () => handleItemClick('BlinkTrade Equity', '/equity'),
              className: 'custom-margin',
              isSelected: selectedItemName === 'BlinkTrade Equity',
            },
            {
              name: 'Orders',
              id: 'equity-orders',
              onClick: () => handleItemClick('Orders', '/equity/orders'),
              className: 'custom-margin',
              icon: <EuiIcon type="package" />,
              isSelected: selectedItemName === 'Orders',
            },
            {
              name: 'Risk Management',
              id: 'equity-risk-management',
              onClick: () => handleItemClick('Risk Management', '/equity/risk-management'),
              className: 'custom-margin',
              icon: <EuiIcon type="visArea" />,
              isSelected: selectedItemName === 'Risk Management',
            },
          ],
        },
        {
          name: 'Future and Options',
          id: 'future-options',
          onClick: () => handleItemClick('Future and Options', '/future-options'),
          className: 'custom-margin',
          icon: <EuiIcon type="visBarVerticalStacked" />,
          isSelected: selectedItemName === 'Future and Options',
          items: [
            {
              name: 'F&O',
              id: 'future-options-fo',
              onClick: () => handleItemClick('F&O', '/future-options'),
              className: 'custom-margin',
              icon: <EuiIcon type="visBarVerticalStacked" />,
              isSelected: selectedItemName === 'F&O',
            },
            {
              name: 'Orders',
              id: 'future-options-orders',
              onClick: () => handleItemClick('Future Orders', '/future-options/orders'),
              className: 'custom-margin',
              icon: <EuiIcon type="package" />,
              isSelected: selectedItemName === 'Future Orders',
            },
            {
              name: 'Risk Management',
              id: 'future-options-risk-management',
              onClick: () => handleItemClick('Future Risk Management', '/future-options/risk-management'),
              className: 'custom-margin',
              icon: <EuiIcon type="visArea" />,
              isSelected: selectedItemName === 'Future Risk Management',
            },
          ],
        },
        {
          name: 'Patch Update',
          id: 'patch-update',
          onClick: () => handleItemClick('Patch Update', '/patch-update'),
          className: 'custom-margin',
          icon: <EuiIcon type="refresh" />,
          isSelected: selectedItemName === 'Patch Update',
        },
      ],
    },
  ];
  console.log("protectedroute", protectedroute)

  useEffect(() => {
    const fetchData = async () => {
      clearAllStores();
      try {
        // Fetch status data
        const statusRes = await axios.get(`${baseUrl}/status/current/?paginate=false&clear_cache=false`, { headers });
        if (statusRes.status === 200) {
          const formattedStatusData = statusRes.data.data;
          await setStatusData(formattedStatusData);
          localStorage.setItem('donotCallApi', false);
        } else {
          throw new Error(`Failed to fetch status data. Status: ${statusRes.status}`);
        }


        // Fetch equity data
        const equityRes = await axios.get(`${baseUrl}/strategy/bt/equity/search/?paginate=false&clear_cache=false`, { headers });
        if (equityRes.status === 200) {
          const formattedEquityData = equityRes.data.data;
          await setEquityData(formattedEquityData);
          localStorage.setItem('donotCallApi', false);
        } else {
          throw new Error(`Failed to fetch equity data. Status: ${equityRes.status}`);
        }

        // Fetch equity order data
        const equityOrderRes = await axios.get(`${baseUrl}/strategy/bt/orders/search/?paginate=false&?clear_cache=true`, { headers });
        if (equityOrderRes.status === 200) {
          const formattedEquityOrderData = equityOrderRes.data.data;
          await setEquityOrderData(formattedEquityOrderData);
          localStorage.setItem('donotCallApi', false);
        } else {
          throw new Error(`Failed to fetch equity order data. Status: ${equityOrderRes.status}`);
        }

        // Fetch users data
        const usersRes = await axios.get(`${baseUrl}/user/profiles/?paginate=false&?clear_cache=false`, { headers });
        if (usersRes.status === 200) {
          await setUsersData(usersRes.data.data);
          localStorage.setItem('donotCallApi', false);
        } else {
          throw new Error(`Failed to fetch users data. Status: ${usersRes.status}`);
        }
        // Fetch Future data
        const futureRes = await axios.get(`${baseUrl}/strategy/fno/analysis/search/?paginate=false&?clear_cache=false`, { headers });
        if (futureRes.status === 200) {
          
          await setFutureData(futureRes.data);
          localStorage.setItem('donotCallApi', false);
        } else {
          throw new Error(`Failed to fetch future data. Status: ${futureRes.status}`);
        }

        // Fetch future order data
        const futureOrderRes = await axios.get(`${baseUrl}/strategy/orders/?paginate=false&?clear_cache=true`, { headers });
        if (futureOrderRes.status === 200) {
          console.log("futureOrderRes", futureOrderRes?.data?.data?.results)
          await setFutureOrderData(futureOrderRes?.data?.data?.results);
          localStorage.setItem('donotCallApi', false);
        } else {
          throw new Error(`Failed to fetch future order data. Status: ${futureOrderRes.status}`);
        }





        localStorage.setItem('donotCallApi', false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (doNotCall) {
      fetchData();
    }
  }, [doNotCall])


  return (
    <EuiProvider colorMode={colorMode}>
      {protectedroute ? (
        <>
          <HeaderUpdates />
          <Sidebar
            button={<button onClick={toggleOpenOnMobile}>Toggle Sidebar</button>}
            sidebar={
              <EuiSideNav
                aria-label="Sidebar navigation"
                mobileTitle="Navigate"
                toggleOpenOnMobile={toggleOpenOnMobile}
                isOpenOnMobile={isSideNavOpenOnMobile}
                items={sideNav}
              />
            }
            emptyPrompt={<div>Empty Prompt Content</div>}
            header={{ pageTitle: 'Page Title' }}
            panelled={true}
            sidebarSticky={true}
            offset={10}
            grow={true}
          />
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/Signup" element={<SignupForm/>} />
        </Routes>
      )}
    </EuiProvider>
  );
};

export default App;
