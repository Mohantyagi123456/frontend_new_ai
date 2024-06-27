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
  EuiLink
} from '@elastic/eui';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dark_logo from '../assests/dark_logo.jpeg';

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      console.error('Login failed!', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <EuiPanel style={{ maxWidth: 400, padding: 20, textAlign: 'center' }}>
        <EuiTitle size="3">
          <img src={dark_logo} height={100} width={400} style={{ marginLeft: '-20px', marginTop: '-20px' }} />
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
            <EuiFieldText
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </EuiFormRow>
          <EuiSpacer />
          <EuiButton type="submit" fill>
            Login
          </EuiButton>
        </EuiForm>
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