import React,{useState,useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import { EuiText } from '@elastic/eui';
import axios from 'axios';
import EquityDataGridTable from './Equity/EquityDataGridTable';
import EquityOrderDataGridTable from './Equity/Orders/EquityOrderDataGridTable';
import { setStatusData, setUsersData, getEquityData, setEquityOrderData, setFutureData, setFutureOrderData,getStatusData } from '../../indexeddb';


const EquityMain = (userData) => {
  console.log("userDatajhkjl",userData?.userData)
  return(
    <EuiText>
    <h2>Equity Analysis</h2>
    <div style={{ marginTop: "50px" }}><EquityDataGridTable userData={userData?.userData}/></div>
   
  </EuiText>
  )
}

const BlinkTradeEquity = (userData) => (
  <EuiText>
  <h2>Equity Analysis</h2>
   <div style={{ marginTop: "50px" }}><EquityDataGridTable userData={userData?.userData}/></div>
  </EuiText>
);

const Equity = () => {
  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const [userData,setUserData] = useState([])

const headers = {
  'Authorization': `Bearer ${KiteId?.access}`
};
useEffect(() => {
  const fetchUserDataFromDB = async () => {
    const data = await getEquityData();
    console.log("data",data)
    setUserData(data);
  };

  fetchUserDataFromDB();
}, []);

return (
    <Routes>
      <Route path="/" element={<EquityMain userData={userData}/>} />
      <Route path="/blinktrade" element={<BlinkTradeEquity userData={userData}/>} />
    </Routes>
  );
};

export default Equity;
