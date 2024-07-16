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
    confirm_password: '',
    pan_card: null,
    aadhaar_card: null,
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

  const [error, setError] = useState({
    contact: '',
    confirm_password: '',
  });
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'confirm_password') {
      if (value !== formData.password) {
        setError((prevError) => ({
          ...prevError,
          confirm_password: 'Passwords do not match',
        }));
        setSubmitDisabled(true);
      } else {
        setError((prevError) => ({
          ...prevError,
          confirm_password: '',
        }));
        setSubmitDisabled(false);
      }
    }
  };

  const handleNestedChange = (e, nestedObj, fieldName) => {
    const { name, value } = e.target;
    if (nestedObj === 'contact' && name === 'contact') {
      if (!/^\d*$/.test(value)) {
        setError((prevError) => ({
          ...prevError,
          contact: 'Contact number must contain only digits',
        }));
        setSubmitDisabled(true);
        return;
      }

      if (value.length > 10) {
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        [nestedObj]: {
          ...prevData[nestedObj],
          [name]: fieldName ? { ...prevData[nestedObj][fieldName], [name]: value } : value,
        },
      }));

      if (value.length !== 10) {
        setError((prevError) => ({
          ...prevError,
          contact: 'Contact number must be exactly 10 digits',
        }));
        setSubmitDisabled(true);
      } else {
        setError((prevError) => ({
          ...prevError,
          contact: '',
        }));
        setSubmitDisabled(false);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [nestedObj]: {
          ...prevData[nestedObj],
          [name]: fieldName ? { ...prevData[nestedObj][fieldName], [name]: value } : value,
        },
      }));
    }
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
      localStorage.setItem('donotCallApi', false);
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
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
            <EuiFormRow label="Confirm Password" isInvalid={!!error.confirm_password} error={error.confirm_password}>
              <EuiFieldText type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} />
            </EuiFormRow>
            <EuiFormRow label="Contact Number" isInvalid={!!error.contact} error={error.contact}>
              <EuiFieldText
                name="contact"
                value={formData.contact.contact}
                onChange={(e) => handleNestedChange(e, 'contact')}
                inputProps={{ maxLength: 10 }}
              />
            </EuiFormRow>
            <EuiFormRow label="Pincode">
              <EuiFieldText name="pincode" value={formData.address.pincode} onChange={(e) => handleNestedChange(e, 'address')} />
            </EuiFormRow>
            <EuiSpacer />
            <EuiButton type="submit" fill isDisabled={isSubmitDisabled}>
              Sign Up
            </EuiButton>
          </EuiForm>
        </div>
      </EuiPanel>
    </div>
  );
};

export default SignupForm;
