import React from 'react';
import { EuiText } from '@elastic/eui';
import TextArea from './common/TextArea';
import MyFilePickerComponent from './common/MyFilePickerComponent';

const Dashboard = () => {
  return (
    <EuiText>
      <h2>Dashboard</h2>
      <div style={{display:"flex",marginTop:"80px"}}>
        <div style={{marginLeft:"10px"}}>
          <MyFilePickerComponent/>
        </div>
        <div style={{marginLeft:"100px"}}>
        <TextArea/>
        </div>
      </div>
    </EuiText>
  );
};

export default Dashboard;
