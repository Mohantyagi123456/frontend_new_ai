import React, { useEffect,useState } from 'react';
import { EuiText } from '@elastic/eui';
import StatusDataGridTable from './Status/StatusDataGridTable';
import axios from 'axios';
// import {getStatus} from "../AllApis"
import {getStatusData } from '../../indexeddb';

const MonthlyStatus = () => {
  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const [userData,setUserData] = useState([])

const headers = {
  'Authorization': `Bearer ${KiteId?.access}`
};
useEffect(() => {
  const fetchUserDataFromDB = async () => {
    const data = await getStatusData();
    setUserData(data);
  };

  fetchUserDataFromDB();
}, []);
  return (
    <EuiText>
      <h2>Monthly Status</h2>
      <div style={{ marginTop: "50px" }}>
        <StatusDataGridTable userData={userData}/>
      </div>
    </EuiText>
  );
};

export default MonthlyStatus;
