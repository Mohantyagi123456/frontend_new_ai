import React,{useState,useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import FutureOptions from '../Project/FutureOptions';
import { EuiText,EuiBasicTable } from '@elastic/eui';
import FutureInternalDataGridTable from '../Project/Future/InternalDetails/FutureInternalDataGridTable';
import {  getFutureOrderData } from '../../indexeddb';
import FutureOrderDataGridTable from '../Project/Future/Orders/FutureOrderDataGridTable';
import ModalComponent from '../Project/Future/RiskManagement/ModalComponent';

const NestedRoutesFuture = () => {
  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const [orderData, setOrderData] = useState([])

  const headers = {
    'Authorization': `Bearer ${KiteId?.access}`
  };

  useEffect(() => {

    const fetchFutureOrderDataFromDB = async () => {
      const data = await getFutureOrderData();

      setOrderData(data);
    };


    fetchFutureOrderDataFromDB()
  }, []);

  return (
    <Routes>
      <Route path="/" element={<FutureOptions />} />
      <Route path="/strategy" element={<FutureInternalDataGridTable/>} />
      <Route path="/orders" element={<FutureOptionsOrders orderData={orderData} />} />
      <Route path="/risk-management" element={<FutureOptionsRiskManagement />} />
    </Routes>
  );
};

const FutureOptionsOrders = (orderData) => {
  return (
    <EuiText>
      <h2>F&O Orders Table</h2>
      <div style={{ marginTop: "50px" }}>
        <FutureOrderDataGridTable orderData={orderData?.orderData} />
      </div>
    </EuiText>);
};


const FutureOptionsRiskManagement = () => {
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
         
          <ModalComponent onDataUpdate={handleDataUpdate} /> 
          </div>
         <div style={{marginTop:"50px"}}>
         {renderTable()}
         </div>
      </div>
  );
};

export default NestedRoutesFuture;
