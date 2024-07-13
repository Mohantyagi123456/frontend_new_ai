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
  EuiLink,
  EuiIcon,
  EuiFieldPassword
} from '@elastic/eui';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bright_logo from '../assests/bright_logo.jpeg';
import './login.css'

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState('');
  const [isForgot, setIsForgot] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = process.env.REACT_APP_BASE_URL;

    try {
      const response = await axios.post(`${baseUrl}/user/login/`, {
        username,
        password
      });

      console.log('Login successful!', response.data);
      const res = await response.data.data;
      localStorage.setItem('userData', JSON.stringify(res));
      localStorage.setItem('login', true);
      localStorage.setItem('donotCallApi', true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Login failed!', error?.response?.data?.data);
      setInvalid(error?.response?.data?.data);
      setIsForgot(true);
    }
  };

  const handleForgotPassword = async () => {
    const apiUrl = `http://13.201.254.1:9000/user/profiles/908`;

    try {
      const response = await axios.patch(apiUrl, {
        is_staff: true,
        first_name: 'test',
        contact: {
          contact: 123456789
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Forgot Password successful!', response.data);
    } catch (error) {
      console.error('Forgot Password failed!', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <EuiPanel style={{ maxWidth: 430, padding: 20, textAlign: 'center', width: 430 }}>
        <EuiTitle size="3">
          <img src={bright_logo} height={100} width={400} style={{ marginLeft: '-13px', marginTop: '-10px' }} />
        </EuiTitle>
        <EuiText>
          <h4>Login With your Account</h4>
        </EuiText>
        <EuiSpacer />
        <EuiForm component="form" onSubmit={handleSubmit}>
          <EuiFormRow label="Username">
            <EuiFieldText
              name="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </EuiFormRow>
          <EuiFormRow label="Password">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <EuiFieldPassword
                type={isPasswordVisible ? 'text' : 'dual'}
                name="password"
                value={password}
                onChange={handlePasswordChange}
                fullWidth
              />
              <EuiIcon
                type={isPasswordVisible ? 'eyeClosed' : 'eye'}
                className='eyebuttonicon'
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                style={{ cursor: 'pointer', marginLeft: '10px',display:"none" }}
              />
            </div>
          </EuiFormRow>
          {isForgot && (
            <>
              <EuiSpacer />
              <span style={{ color: 'red', marginRight: '70%' }}>{invalid}</span>
            </>
          )}
          <EuiSpacer />
          <EuiButton type="submit" fill>
            Login
          </EuiButton>
        </EuiForm>
        <EuiSpacer />
        {isForgot && (
          <EuiText>
            <EuiLink onClick={handleForgotPassword}>
              Forgot Password?
            </EuiLink>
          </EuiText>
        )}
        <EuiSpacer />
        <EuiText>
          Don't have an account?{' '}
          <EuiLink onClick={() => navigate('/signup')}>
            Create a new account
          </EuiLink>
        </EuiText>
      </EuiPanel>
    </div>
  );
};

export default LoginForm;
