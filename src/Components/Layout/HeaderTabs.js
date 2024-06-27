import React, { Fragment } from 'react';
import { EuiIcon, EuiTabbedContent, EuiText, EuiSpacer } from '@elastic/eui';
import { useNavigate } from 'react-router-dom';

const HeaderTabs = () => {
    const navigate = useNavigate()
  const tabs = [
    {
      id: 'watch-list',
      path: '/watch-list',
      name: 'Watchlist',
      
    },
    {
        id: 'orders',
        path: '/orders',
        name: 'Orders',
        
      },
      {
        id: 'trades',
        path: '/trades',
        name: 'Trades',
        
      },
      {
        id: 'portfolio',
        path: '/portfolio',
        name: 'Portfolio',
       
      },
      {
        id: 'net-positions',
        path: '/net-positions',
        name: 'Net-Positions',
        
      },
   
  ];

  return (
    <EuiTabbedContent
      tabs={tabs}
      initialSelectedTab={tabs[1]}
      autoFocus="selected"
      onTabClick={(tab) => {
        navigate(tab.path)
        console.log('clicked tab', tab);
      }}
    />
  );
};

export default HeaderTabs;
