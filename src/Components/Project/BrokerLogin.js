import React, { useState, useEffect } from 'react';
import {
  EuiPortal,
  EuiFlyout,
  EuiFieldText,
  EuiCheckbox,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiIcon
} from '@elastic/eui';
import swal from 'sweetalert';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import CardNodes from './cardNodes'; // Adjust the import path as per your project structure

const BrokerLogin = () => {
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const KiteId = JSON.parse(localStorage.getItem('userData'));
  const headers = {
    'Authorization': `Bearer ${KiteId?.access}`
  };

  const initialData = {
    api_key: '',
    api_secret: '',
    user_id: '',
    user_password: '',
    totp_key: '',
    access_token: "",
    request_token: "",
    consent_to_use: false,
  };

  const TotpData = {
    TOTP: "",
    login_url: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [formTotpData, setFormTotpData] = useState(TotpData);
  const [isOpen, setIsOpen] = useState(false);
  const [showChild, setShowChild] = useState(false);
  const [timer, setTimer] = useState(0);
  const [kiteData, setKiteData] = useState({});
  const [showKiteDetails, setShowKiteDetails] = useState(false);
  const [requestToken, setRequestToken] = useState('');
  const [backward, setBackward] = useState();

  const fieldLabels = {
    kite_username: 'Kite Username',
    kite_password: 'Kite Password',
    consent_to_use: 'Consent to Use',
    // Add more key-label pairs as needed
  };

  useEffect(() => {
    let interval;
    if (showChild) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer === 30 ? 0 : prevTimer + 1)); // Increment timer every second and reset to 0 after 30 seconds
      }, 1000); // Update timer every second
    } else {
      clearInterval(interval); // Clear interval when showChild is false
    }

    return () => clearInterval(interval); // Cleanup interval on unmount or when showChild changes
  }, [showChild]);

  const closeFlyout = () => {
    setIsFlyoutVisible(false);
  };

  const showFlyout = () => {
    setIsFlyoutVisible(!isFlyoutVisible);
    if (showChild) {
      setShowChild(false);
    }
    setTimer(0);
  };

  const Kite = async () => {
    try {
      if (KiteId?.user?.kite) {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/main/kite/${KiteId?.user?.kite}`, { headers });
        if (res.status === 200) {
          setKiteData(res.data.data);
          localStorage.setItem("kiteDetails", JSON.stringify(res.data.data));
        } else {
          console.error('Unexpected status code:', res.status);
        }
      }
    } catch (error) {
      console.error('Error fetching Kite data:', error);
    }
  };

  useEffect(() => {
    Kite();
  }, [KiteId?.user?.kite]);

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    copy(value);
    swal("Copied!","success");
  };

  const handleInputChange = (key, value) => {
    setKiteData((prevData) => ({
      ...prevData,
      [key]: value
    }));
  };

  const handleCheckboxChange = (key, value) => {
    setKiteData((prevData) => ({
      ...prevData,
      [key]: value
    }));
  };

  const renderFields = () => {
    const keys = Object.keys(kiteData).slice(0, -3); // Exclude the last 3 keys
    return keys.map((key, index) => {
      if (index === 0 && key === 'id') {
        return null; // Skip rendering the first element with key 'id'
      }
      const label = fieldLabels[key] || key; // Use the label from fieldLabels or fall back to the key if no label is found

      if (key === 'consent_to_use') {
        return (
          <div className="fieldContainer" key={key} style={{ marginLeft: "20px", display: "flex", marginTop: "15px" }}>
            <label className="fieldLabel" htmlFor={key}>{label}</label>
            <EuiCheckbox
              id={key}
              checked={kiteData[key]}
              className='checkk'
              onChange={(e) => handleCheckboxChange(key, e.target.checked)}
            />
          </div>
        );
      } else if (typeof kiteData[key] === 'string' || typeof kiteData[key] === 'number') {
        return (
          <div className="fieldContainer" key={key} style={{ marginLeft: "20px", marginTop: "15px" }}>
            <label className="fieldLabel" htmlFor={key}>{label === "api_key" ? "API KEY" : label === "api_secret" ? "API SECRET" : label === "user_id" ? "USER ID" :
              label === "user_password" ? "USER PASSWORD" : label === "totp_key" ? "TOTP" : label === "access_token" ? "ACCESS TOKEN" :
                label === "request_token" ? "REQUEST TOKEN" : label}</label>
            <EuiFieldText
              id={key}
              placeholder={label}
              value={kiteData[key]}
              className='inputClass'
              aria-label={`Field for ${key}`}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
            <div >
            <EuiFlexGroup>
            <EuiFlexItem>
          
                <EuiIcon
                  onClick={() => handleCopy(kiteData[key])}
                  type="copy"
                  className='copyClass'
                  // aria-label={`Copy ${key}`}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
           
            </div>



          </div>
        );
      }
      return null;
    });
  };

  const AfterLinkGenerate = () => {
    const keys = Object.keys(formTotpData);
    return keys.map((key, index) => {
      const label = TotpData[key] || key;
      if (typeof formTotpData[key] === "string" || typeof formTotpData[key] === "number") {
        return (
          <div className="fieldContainer" key={key} style={{ marginLeft: "20px",marginTop:"15px" }}>
            <label className="fieldLabel" htmlFor={key} >{label}</label>
            <EuiFieldText
              id={key}
              placeholder={label}
              value={formTotpData[key]}
              className='inputClass'
              aria-label={`Field for ${key}`}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
      
             <div >
            <EuiFlexGroup>
            <EuiFlexItem>
          
                <EuiIcon
                  onClick={() => handleCopy(formTotpData[key])}
                  type="copy"
                  className='copyClass'
                  // aria-label={`Copy ${key}`}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
           
            </div>
          </div>
        );
      }
      return null;
    });
  };

  const GenerateLink = async (e, tt) => {
    if (tt) {
      console.log("gg", tt);
    } else {
      e.preventDefault();
    }

    try {
      const body = {
        request_token: kiteData?.data?.request_token
      };

      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/main/login/kite/`, body, { headers });
      console.log("resres", res.data.data);
      if (res.status === 200) {
        setShowKiteDetails(true);
        setBackward(true);
        setFormTotpData(res.data.data);
        
        swal("Generated!","Link is Generated successfully!","success");
      } else {
        setShowKiteDetails(false);
        setBackward(false);
        setFormTotpData(initialData);
        console.error('Unexpected status code:', res.status);
      }
    } catch (error) {
      setShowKiteDetails(false);
      setBackward(false);
      setFormTotpData(initialData);
      console.error('Error fetching Kite data:', error);
    }
  };

  useEffect(() => {
    if (timer === 30) {
      GenerateLink("tt", true);
    }
  }, [timer]);

  const RedirectLink = async (e) => {
    e.preventDefault();
    window.open(formTotpData.login_url, '_blank');
  };

  const LoginToKite = async (e) => {
    e.preventDefault();
    const body = {
      request_token: requestToken
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/main/login/kite/`, body, { headers });
      console.log("dddd", res.data.data);
      if (res.status === 200) {
      
        swal("Logged In!","Successfully Logged In!","success");
        setFormTotpData(TotpData);
        setFormData(initialData);
        setRequestToken('');
        setBackward();
        setShowKiteDetails(false);
        showFlyout();
      } else {
   
        swal("Failed!","Failed to log in!","error");
        console.error('Unexpected status code:', res.status);
      }
    } catch (error) {
   
      swal("Failed!","Failed to log in!","error");
      console.error('Error fetching Kite data:', error);
    }
  };

  const handleBackward = () => {
    setShowKiteDetails(!showKiteDetails);
  };

  const AutoLogin = async (e) => {
    e.preventDefault();
    // console.log("request_tokenrequest_token",kiteData?.request_token)
    // return
    const body = {
      request_token: kiteData?.request_token
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/main/login/kite/auto/`, body, { headers });
      console.log("dddd", res.data.data);
      if (res.status === 200) {
    
        swal("Logged!","Successfully Logged In!","success");
      } else {
        console.error('Unexpected status code:', res.status);
      }
    } catch (error) {
      console.error('Error fetching Kite data:', error);
    }
  };

  const HandleUpdate = async (e) => {
    e.preventDefault();
    const body = {
      api_key: kiteData?.api_key,
      api_secret: kiteData?.api_secret,
      user_id: kiteData?.user_id,
      user_password: kiteData?.user_password,
      totp_key: kiteData?.totp_key,
      consent_to_use: kiteData?.consent_to_use,
    };
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/main/kite/`, body, { headers });
      console.log("resres", res.data.data);
      if (res.status === 200) {
        setFormTotpData(res.data.data);
       
    
        swal("Updated!","User details are updated successfully!","success");
      } else {
        console.error('Unexpected status code:', res.status);
      }
    } catch (error) {
      console.error('Error fetching Kite data:', error);
    }
  };

  const flyout = (
    <EuiPortal>
      <EuiFlyout
        onClose={closeFlyout}
        size="s"
      >
        <div style={{ marginTop: "10px", marginLeft: "15px" }}>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon display="base" iconType={showKiteDetails ? "arrowLeft" : "arrowRight"} aria-label="Next" onClick={(e) => { handleBackward(); }} />
          </EuiFlexItem>
        </div>
        <div className="formContainer" style={{ marginTop: "25px" }}>
          {showKiteDetails ? AfterLinkGenerate() : renderFields()}
          {!showKiteDetails &&
            <EuiFlexGroup
              gutterSize="s"
              alignItems="center"
              responsive={false}
              style={{ marginLeft: "15px", marginTop: "20px" }}
              wrap
            >
              <EuiFlexItem grow={false}>
                <EuiButton
                  color='primary'
                  size="s"
                  onClick={(e) => { GenerateLink(e); setShowChild(true); }}
                >
                  Generate Link
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton
                  color='primary'
                  size="s"
                  onClick={(e) => HandleUpdate(e)}
                >
                  Update Details
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton
                  color='primary'
                  size="s"
                  onClick={(e) => AutoLogin(e)}
                >
                  Auto Login
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          }
          {showKiteDetails &&
            <EuiFlexGroup
              gutterSize="s"
              alignItems="center"
              responsive={false}
              style={{ marginLeft: "15px", marginTop: "20px" }}
              wrap
            >
              <div className="fieldContainer" style={{ marginLeft: "20px" }}>
                <EuiFlexItem grow={false}>
                  <EuiButton
                    color='primary'
                    size="s"
                    onClick={(e) => { RedirectLink(e); }}
                  >
                    Visit Site
                  </EuiButton>
                </EuiFlexItem>
                <div style={{ marginTop: "35px" }}>
                  <label className="fieldLabel">Request Url</label>
                  <EuiFieldText
                    placeholder="Request url"
                    className='forafterlogin'
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <EuiFlexItem grow={false}>
                    <EuiButton
                      color='primary'
                      size="s"
                      onClick={(e) => { LoginToKite(e); }}
                    >
                      Login to Kite
                    </EuiButton>
                  </EuiFlexItem>
                </div>
              </div>
            </EuiFlexGroup>
          }
        </div>
      </EuiFlyout>
    </EuiPortal>
  );

  return (
    <div className='brokerlogin_card'>
      <CardNodes onClick={showFlyout} />
      {isFlyoutVisible && flyout}
    </div>
  );
};

export default BrokerLogin;
