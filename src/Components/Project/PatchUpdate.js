import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EuiFormRow, EuiSelect, EuiButton, EuiBasicTable, EuiText, EuiComboBox } from '@elastic/eui';

const PatchUpdate = () => {
  const [patchValue, setPatchValue] = useState('');
  const [selectedSymbols, setSelectedSymbols] = useState({});
  const [selectedExcludeSymbols, setSelectedExcludeSymbols] = useState({});

  console.log("selectedSymbols", selectedSymbols);
  console.log("selectedExcludeSymbols", selectedExcludeSymbols);

  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const headers = {
    'Authorization': `Bearer ${KiteId?.access}`
  };

  const navigate = useNavigate();

  // const handlePatchUpdateChange = (e) => {
  //   setPatchValue(e.target.value);
  // };

  const handleSubmit = async (ee) => {
    console.log("action",)
    setPatchValue(ee.name == "Monthly Status" ?"FUT":ee.name == "Equity" ?"EQ":"")
    
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

    // Get the current date
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
    const year = currentDate.getFullYear();
    const presentDate = `${day}/${month}/${year}`;

    if (patchValue !== '') {
      if (lastUsedDate !== presentDate) {
        const body = {
          update_column: patchValue,
          symbols:"",
          exclude:"",
          _range:""
          // symbols: Object.values(selectedSymbols).flat(),
          // excludeSymbols: Object.values(selectedExcludeSymbols).flat()
        };

        try {
          const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/status/current/update/`, body, {
            headers
          });

          console.log('Data patched successfully:', response.data);
          localStorage.setItem('donotCallApi', true);
          navigate("/");
          window.location.reload();
        } catch (error) {
          console.error('Error patching data:', error);
          // Handle error state if needed
        }
      } else {
        navigate('/broker-login'); // Redirect to broker login page if dates don't match
      }
    }
  };

  const users = [{
    name: "Monthly Status",
    action: "Action for Monthly Status"
  },
  {
    name: "Equity",
    action: "Action for Equity"
  }];

  const names = [
    'SOB4d', 'SOB2d4d', 'SOS2d4d', 'SOS4d', 'NiftyFuture1d2d', 'NiftyFuture2d2d', 
    'BankNiftyFuture1d2d', 'BankNiftyFuture2d2d', 'StocksFuture2d3d', 'StocksFuture3d3d', 
    'StocksFuture4dWeekly', 'GoldMiniFuture2d3d', 'GoldMiniFuture3d3d', 
    'SilverMiniFuture2d3d', 'SilverMiniFuture3d3d'
  ];
  
  const Strategy = names.map(name => ({
    name: name,
    symbols: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      // Add more options as needed
    ],
    excludeSymbol: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      // Add more options as needed
    ],
  }));

  const columns = [
    {
      field: 'name',
      name: 'Options',
      render: (name) => name,
    },
    {
      field: '',
      name: 'Action',
      render: (name) => <EuiButton onClick={()=>handleSubmit(name)}>Update</EuiButton>,
    },
  ];

  const Strategycolumns = [
    {
      field: 'name',
      name: 'Strategy Name',
      render: (name) => name,
    },
    {
      field: 'symbols',
      name: 'Symbols',
      render: (item, record) => {
        return (
          <EuiComboBox
            options={item}
            selectedOptions={selectedSymbols[record.name] || []}
            onChange={(selectedOptions) => {
              setSelectedSymbols(prev => ({ ...prev, [record.name]: selectedOptions }));
            }}
            isClearable={false}
          />
        );
      },
    },  
    {
      field: 'excludeSymbol',
      name: 'Exclude Symbols',
      render: (item, record) => (
        <EuiComboBox
        //  className="adddddd"
        // style={{background:"white",border:"1px solid black"}}
          options={item}
          selectedOptions={selectedExcludeSymbols[record.name] || []}
          onChange={(selectedOptions) => {
            setSelectedExcludeSymbols(prev => ({ ...prev, [record.name]: selectedOptions }));
          }}
          isClearable={false}
        />
      ),
    },
    {
      field: 'action',
      name: 'Action',
      render: (action) => action,
    },
  ];

  return (
    <div className="patch-update-select">
      {/* Your other UI components */}
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "50px" }}>
          <EuiText style={{ marginLeft: "15px" }}> <h3>Patch Update</h3></EuiText>

          <EuiBasicTable
            style={{ maxWidth: "270px", marginLeft: "10px", marginTop: "20px" }}
            items={users}
            columns={columns}
          />
        </div>
        <div style={{ marginTop: "50px", marginLeft: "60px" }}>
          <EuiText style={{ marginLeft: "15px" }}> <h3>Generate Strategy</h3></EuiText>

          <EuiBasicTable
            style={{ maxWidth: "500px", marginLeft: "10px", marginTop: "20px" }}
            items={Strategy}
            columns={Strategycolumns}
          />
        </div>
      </div>
      
    </div>
  );
};

export default PatchUpdate;