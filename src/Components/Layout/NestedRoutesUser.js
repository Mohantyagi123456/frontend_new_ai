import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EuiText } from '@elastic/eui';
import UserDetails from '../Project/Users/UserDetails/UserDetails';
import AllUsers from '../Project/AllUsers';

const NestedRoutesUser = () => {

    return (
        <Routes>
            <Route path="/" element={<AllUsers />} />
            <Route path="/details/:id" element={<UserdetailData />} />
        </Routes>
    );
};
const UserdetailData = () => {

    return (
      <EuiText>
        <h2>User Details</h2>
        <div style={{ marginTop: "50px" }}>
          <UserDetails />
        </div>
      </EuiText>);
  };
  


export default NestedRoutesUser;
