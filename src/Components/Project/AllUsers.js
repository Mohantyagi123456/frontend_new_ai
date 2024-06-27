import React,{useState,useEffect} from 'react';
import { EuiText } from '@elastic/eui';
import UsersDataGridTable from './Users/UsersDataGridTable';
import axios from 'axios';
import {getUsersData } from '../../indexeddb';

const AllUsers = () => {
  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const [userData,setUserData] = useState([])

const headers = {
  'Authorization': `Bearer ${KiteId?.access}`
};
useEffect(() => {
  const fetchUserDataFromDB = async () => {
    const data = await getUsersData();
    setUserData(data);
  };

  fetchUserDataFromDB();
}, []);

  return (
    <EuiText>
       <h2>All Users Data Table</h2>
      <div style={{ marginTop: "50px" }}>
        <UsersDataGridTable userData={userData}/>
      </div>
    </EuiText>
  );
};

export default AllUsers;
