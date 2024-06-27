import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { EuiText } from '@elastic/eui';
import { getFutureData } from '../../indexeddb';
import FutureDataGridTable from './Future/FutureDataGridTable';
import FutureStrategyGenerate from './Future/FutureStrategyGenerate';

const FutureOptionsMain = (userData) => {
  return (
    <EuiText>
      <h2>F&O Data Table</h2>
      <FutureStrategyGenerate/>
      <div style={{ marginTop: "50px" }}><FutureDataGridTable userData={userData?.userData} /></div>

    </EuiText>
  )

}

const FutureOptions = () => {
  const [userData, setUserData] = useState([])
  console.log("userDatauserData12345", userData)

  useEffect(() => {
    const fetchUserDataFromDB = async () => {
      const data = await getFutureData();
      setUserData(data ? data[0] : "");
    };

    fetchUserDataFromDB();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<FutureOptionsMain userData={userData} />} />
    </Routes>
  );
};

export default FutureOptions;
