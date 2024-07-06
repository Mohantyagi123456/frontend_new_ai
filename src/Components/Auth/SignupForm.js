import React, { useState } from 'react';
import {
  EuiButton,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiPanel,
  EuiTitle,
  EuiText,
} from '@elastic/eui';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bright_logo from '../assests/bright_logo.jpeg';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    pan_card: '',
    aadhaar_card: '',
    bio: '',
    contact: {
      contact: '',
      is_active: true,
      is_permanent: true,
      is_verified: false,
    },
    address: {
      house_num: '',
      street: '',
      city: '',
      pincode: '',
      is_active: true,
      is_permanent: true,
      is_verified: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNestedChange = (e, nestedObj, fieldName) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [nestedObj]: {
        ...prevData[nestedObj],
        [name]: fieldName ? { ...prevData[nestedObj][fieldName], [name]: parseInt(value) } : parseInt(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = process.env.REACT_APP_BASE_URL;

    try {
      const response = await axios.post(`${baseUrl}/user/profiles/`, formData);

      const res = await response.data.data;
      console.log('Signup successful!', res);
      localStorage.setItem('userData', JSON.stringify(res));
      localStorage.setItem('login', true);
      localStorage.setItem('donotCallApi', true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Signup failed!', error);
    }
  };

  return (
    <div style={{ justifyContent: 'center', alignItems: 'center' }}>
      <EuiPanel style={{ maxWidth: 430, padding: 20, textAlign: 'center', marginLeft: '33%', marginTop: '5%' }}>
        <EuiTitle size="3">
          <img src={bright_logo} height={100} width={400} style={{ marginLeft: '-13px', marginTop: '-10px' }} />
        </EuiTitle>
        <EuiText>
          <h4>Sign Up for an Account</h4>
        </EuiText>
        <EuiSpacer />
        <div style={{ maxHeight: '60vh', overflowY: 'auto',  }}>
          <EuiForm component="form" onSubmit={handleSubmit}>
            <EuiFormRow label="Username">
              <EuiFieldText name="username" value={formData.username} onChange={handleChange} />
            </EuiFormRow>
            <EuiFormRow label="First Name">
              <EuiFieldText name="first_name" value={formData.first_name} onChange={handleChange} />
            </EuiFormRow>
            <EuiFormRow label="Last Name">
              <EuiFieldText name="last_name" value={formData.last_name} onChange={handleChange} />
            </EuiFormRow>
            <EuiFormRow label="Email">
              <EuiFieldText name="email" value={formData.email} onChange={handleChange} />
            </EuiFormRow>
            <EuiFormRow label="Password">
              <EuiFieldText type="password" name="password" value={formData.password} onChange={handleChange} />
            </EuiFormRow>
            {/* <EuiFormRow label="PAN Card">
              <EuiFieldText name="pan_card" value={formData.pan_card} onChange={handleChange} />
            </EuiFormRow>
            <EuiFormRow label="Aadhaar Card">
              <EuiFieldText name="aadhaar_card" value={formData.aadhaar_card} onChange={handleChange} />
            </EuiFormRow>
            <EuiFormRow label="Bio">
              <EuiFieldText name="bio" value={formData.bio} onChange={handleChange} />
            </EuiFormRow>
            <EuiFormRow label="Contact Number">
              <EuiFieldText
                name="contact"
                value={formData.contact.contact}
                onChange={(e) => handleNestedChange(e, 'contact')}
              />
            </EuiFormRow>
            <EuiFormRow label="House Number">
              <EuiFieldText
                name="house_num"
                value={formData.address.house_num}
                onChange={(e) => handleNestedChange(e, 'address')}
              />
            </EuiFormRow>
            <EuiFormRow label="Street">
              <EuiFieldText name="street" value={formData.address.street} onChange={(e) => handleNestedChange(e, 'address')} />
            </EuiFormRow>
            <EuiFormRow label="City">
              <EuiFieldText name="city" value={formData.address.city} onChange={(e) => handleNestedChange(e, 'address')} />
            </EuiFormRow> */}
            <EuiFormRow label="Contact Number">
              <EuiFieldText
                name="contact"
                value={formData.contact.contact}
                onChange={(e) => handleNestedChange(e, 'contact')}
              />
            </EuiFormRow>
            <EuiFormRow label="Pincode">
              <EuiFieldText name="pincode" value={formData.address.pincode} onChange={(e) => handleNestedChange(e, 'address')} />
            </EuiFormRow>
            <EuiSpacer />
            <EuiButton type="submit" fill>
              Sign Up
            </EuiButton>
          </EuiForm>
        </div>
      </EuiPanel>
    </div>
  );
};

export default SignupForm;
