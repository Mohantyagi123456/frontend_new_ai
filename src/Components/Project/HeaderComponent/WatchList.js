import React from 'react'
import EquityOrderDataGridTable from './WatchlistOrder/Orders/EquityOrderDataGridTable';
import {
  EuiTitle,
} from '@elastic/eui';
import { useNavigate, useLocation } from 'react-router-dom';
import FutureOrderDataGridTable from '../HeaderComponent/WatchlistOrder/FutureOrders/FutureOrderDataGridTable';
import EquityDataGridTable from './AnalysisData/EquityDataGridTable';

const WatchList = () => {
  const location = useLocation();
  const tableName = location?.state?.form
  const orderData = location?.state?.selectedItems

  console.log("equityAnalysis",orderData)
  return (
    <>
      {tableName == "equityOrders" ? <EuiTitle ><h1>Equity Orders</h1></EuiTitle> : tableName == "futureOrders"?<EuiTitle ><h1>Future Orders</h1></EuiTitle>:
        tableName == "equityAnalysis"?<EuiTitle ><h1>Equity Analysis</h1></EuiTitle>:""}
     <div style={{marginTop:"50px"}}>
     {tableName == "equityOrders" ? <EquityOrderDataGridTable orderData={orderData} /> : 
     tableName == "futureOrders"?<FutureOrderDataGridTable orderData={orderData}/>:
     tableName == "equityAnalysis"?<EquityDataGridTable userData={orderData}/>:""}
     </div>

    </>

  )
}

export default WatchList