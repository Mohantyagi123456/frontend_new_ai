import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EuiSelect, EuiButton, EuiBasicTable, EuiText } from '@elastic/eui';
import swal from 'sweetalert';

const PatchUpdate = () => {
  const [patchValue, setPatchValue] = useState('');
  const [selectedSymbols, setSelectedSymbols] = useState({});
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedExcludeSymbols, setSelectedExcludeSymbols] = useState({});

  console.log("selectedSymbols", selectedSymbols);
  console.log("selectedExcludeSymbols", selectedExcludeSymbols);

  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const headers = {
    'Authorization': `Bearer ${KiteId?.access}`
  };

  const navigate = useNavigate();

  const handleSubmit = async (ee) => {
    console.log("action", ee);
    setPatchValue(ee.name === "Monthly Status" ? "FUT" : ee.name === "Equity" ? "EQ" : "");

    const lastDate = JSON.parse(localStorage.getItem('kiteDetails'));
    const dateFromLast = new Date(lastDate?.last_used);

    let dayLast = dateFromLast.getDate();
    let monthLast = dateFromLast.getMonth() + 1;
    const yearLast = dateFromLast.getFullYear();

    if (dayLast < 10) {
      dayLast = `0${dayLast}`;
    }
    if (monthLast < 10) {
      monthLast = `0${monthLast}`;
    }

    const lastUsedDate = `${dayLast}/${monthLast}/${yearLast}`;
    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const presentDate = `${day}/${month}/${year}`;
    console.log("patchValue", patchValue)
    if (ee.name != '' || ee.name != 'undefined') {
      const hh = ee.name === "Monthly Status" ? "FUT" : ee.name === "Equity" ? "EQ" : ""
      if (lastUsedDate !== presentDate) {
       
        const body = {
          update_column: hh,
          symbols: "",
          exclude: "",
          _range: ""
        };
        try {
          const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/status/current/update/`, body, {
            headers
          });

          console.log('Data patched successfully:', response.data);
          await swal("Updated!", "Updated successfully!", "success");
          localStorage.setItem('donotCallApi', true);
          navigate("/");
          window.location.reload();
        } catch (error) {
          console.error('Error patching data:', error);
        }
      } else {
        navigate('/broker-login');
      }
    }
  };

  const users = [
    {
      name: "Monthly Status",
      action: "Action for Monthly Status"
    },
    {
      name: "Equity",
      action: "Action for Equity"
    }
  ];

  const columns = [
    {
      field: 'name',
      name: 'Options',
      render: (name) => name,
    },
    {
      field: '',
      name: 'Action',
      render: (name) => <EuiButton size="xs" onClick={() => handleSubmit(name)}>Update</EuiButton>,
    },
  ];

  const names = [
    { title: "SOB4d" },
    { title: "SOB4d" },
    { title: "SOB2d4d" },
    { title: "SOS2d4d" },
    { title: "NiftyFuture1d2d" },
    { title: "NiftyFuture2d2d" },
    { title: "BankNiftyFuture1d2d" },
    { title: "BankNiftyFuture2d2d" },
    { title: "StocksFuture2d3d" },
    { title: "StocksFuture3d3d" },
    { title: "StocksFuture4dWeekly" },
    { title: "GoldMiniFuture2d3d" },
    { title: "GoldMiniFuture3d3d" },
    { title: "SilverMiniFuture2d3d" },
    { title: "SilverMiniFuture3d3d" }
  ];

  const symbols = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" }
  ];

  const excludeSymbol = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" }
  ];

  const strategyItems = [
    {
      name: 'Strategy',
      title: '',
      symbols: [],
      excludeSymbol: [],
    }
  ];

  const Strategycolumns = [
    {
      field: 'name',
      name: 'Strategy Name',
      render: () => (
        <EuiSelect
          className="patchselect"
          value={selectedTitle}
          onChange={(e) => setSelectedTitle(e.target.value)}
          options={names.map(n => ({ text: n.title, value: n.title }))}
        />
      ),
    },
    {
      field: 'symbols',
      name: 'Symbols',
      render: () => (
        <EuiSelect
          className="patchselect"
          options={symbols}
          selectedOptions={selectedSymbols[selectedTitle] || []}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedSymbols({ [selectedTitle]: selectedOptions });
          }}
          isClearable={false}
        />
      ),
    },
    {
      field: 'excludeSymbol',
      name: 'Exclude Symbols',
      render: () => (
        <EuiSelect
          className="patchselect"
          options={excludeSymbol}
          selectedOptions={selectedExcludeSymbols[selectedTitle] || []}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedExcludeSymbols({ [selectedTitle]: selectedOptions });
          }}
          isClearable={false}
        />
      ),
    },
    {
      field: '',
      name: 'Action',
      render: () => <EuiButton size="xs">Update</EuiButton>,
    },
  ];

  return (
    <div className="patch-update-select">
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "50px" }}>
          <EuiText style={{ marginLeft: "15px" }}> <h3>Patch Update</h3></EuiText>
          <EuiBasicTable
            style={{ maxWidth: "270px", marginLeft: "10px", marginTop: "20px" }}
            items={users}
            columns={columns}
          />
        </div>
        <div className="vertical-divider"></div>
        <div style={{ marginTop: "50px", marginLeft: "60px" }}>
          <EuiText style={{ marginLeft: "15px" }}> <h3>Generate Strategy</h3></EuiText>
          <EuiBasicTable
            style={{ maxWidth: "500px", marginLeft: "10px", marginTop: "20px" }}
            items={strategyItems}
            columns={Strategycolumns}
          />
        </div>
      </div>
    </div>
  );
};

export default PatchUpdate;
