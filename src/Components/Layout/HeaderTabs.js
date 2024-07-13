import React, { useEffect, useState } from 'react';
import { EuiTabbedContent } from '@elastic/eui';
import { useNavigate, useLocation } from 'react-router-dom';

const HeaderTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(null);

  console.log("location.pathname",location.pathname)
  
  const tabs = [
    {
      id: 'watch-list',
      path: '/watch-list',
      name: <div  className={`${location.pathname == "/watch-list"  ?"activeness":""}`}>Watchlist</div>,
    },
   
    {
      id: 'portfolio',
      path: '/portfolio',
      name: <div  className={`${ location.pathname == "/portfolio" ?"activeness":""}`}>Portfolio</div>,

    },
    {
      id: 'net-positions',
      path: '/net-positions',
      name: <div  className={`${location.pathname == "/net-positions" ?"activeness":""}`}>Net-Positions</div>,

    },
    {
      id: 'orders',
      path: '/orders-list',
      name: <div  className={`${location.pathname == "/orders-list"  ?"activeness":""}`}>Orders</div>,
    },
    {
      id: 'holdings',
      path: '/holding-list',
      name: <div  className={`${location.pathname == "/holding-list"  ?"activeness":""}`}>Holdings</div>,
    },
    // {
    //   id: 'bids',
    //   path: '/bids-list',
    //   name: <div  className={`${location.pathname == "/bids-list"  ?"activeness":""}`}>Bids</div>,
    // },
    {
      id: 'funds',
      path: '/fund-list',
      name: <div  className={`${location.pathname == "/fund-list"  ?"activeness":""}`}>Funds</div>,
    },
  ];

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    setSelectedTab(currentTab);
  }, []);
console.log("selectedTab",selectedTab?.path)
  return (
    <EuiTabbedContent
      tabs={tabs}
       initialSelectedTab={selectedTab}
      //  selectedTab={selectedTab}
       
      autoFocus="selected"
      onTabClick={(tab) => {
        navigate(tab.path);
        console.log('clicked tab', tab);
      }}
    />
  );
};

export default HeaderTabs;
