import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Equity from '../Project/Equity';
import { EuiText } from '@elastic/eui';
import EquityOrderDataGridTable from '../Project/Equity/Orders/EquityOrderDataGridTable';
import { getEquityOrderData, } from '../../indexeddb';
import ModalComponent from '../Project/Equity/RiskManagement/ModalComponent';
import {
    EuiBasicTable,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFieldSearch,
    EuiBadge,
    EuiIcon,
} from '@elastic/eui';

const NestedRoutes = () => {
  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const [orderData, setOrderData] = useState([])

  const headers = {
    'Authorization': `Bearer ${KiteId?.access}`
  };

  useEffect(() => {
    const fetchUserDataFromDB = async () => {
      const data = await getEquityOrderData();
      console.log("dataorder", data)
      setOrderData(data);
    };




    fetchUserDataFromDB();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Equity />} />
      <Route path="/orders" element={<EquityOrders orderData={orderData} />} />
      <Route path="/risk-management" element={<EquityRiskManagement />} />
      {/* <Route path="/" element={<FutureOptions />} /> */}
      {/* <Route path="/future-orders" element={<FutureOptionsOrders />} />
      <Route path="/future-risk-management" element={<FutureOptionsRiskManagement />} /> */}
    </Routes>
  );
};

// Placeholder components for Equity nested routes
const EquityOrders = (orderData) => {

  return (
    <EuiText>
      <h2>Equity Orders Table</h2>
      <div style={{ marginTop: "50px" }}>
        <EquityOrderDataGridTable orderData={orderData?.orderData} />
      </div>
    </EuiText>);
};

const EquityRiskManagement = () => {
  const [data, setData] = useState([]); // Assuming you have data for this table
  const handleDataUpdate = (updatedData) => {
    console.log("updatedData",updatedData)
     setData(updatedData);
};

  const columns = [
      {
          field: 'symbol',
          name: 'Symbol',
          truncateText: true,
          sortable: true,
          mobileOptions: {
              render: (item) => (
                  <a href="#" target="_blank">
                      {item.symbol}
                  </a>
              ),
          },
      },
      {
          field: 'entry_price',
          name: 'entry_price',
          truncateText: true,
          sortable: true,
      },
      {
          field: 'is_monthly',
          name: 'is_monthly',
          truncateText: true,
          sortable: true,
      },
      {
          field: 'qty',
          name: 'qty',
          truncateText: true,
          sortable: true,
      },
     
    
  ];

  const handleAction = (item) => {
      // Handle action for each row
      console.log('Clicked action for item:', item);
  };

  // Format date function (assuming it's the same as in EquityDataGridTable)
  const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  const renderTable = () => (
      <EuiBasicTable
          items={data}
          columns={columns}
          // sorting={true}
          // pagination={true}
          rowHeader="Symbol"
      />
  );

  return (
      <div>
      <EuiText>

      <h2>Risk Management Details</h2>
      </EuiText>
          <div style={{marginTop:"100px"}}>
          <ModalComponent onDataUpdate={handleDataUpdate} /> {/* Assuming ModalComponent is defined elsewhere */}
          </div>
         <div style={{marginTop:"50px"}}>
         {renderTable()}
         </div>
      </div>
  );
};


// Placeholder components for FutureOptions nested routes
const FutureOptionsOrders = () => {
  return <div>Future Options Orders Component</div>;
};

const FutureOptionsRiskManagement = () => {
  return <div>Future Options Risk Management Component</div>;
};

export default NestedRoutes;
