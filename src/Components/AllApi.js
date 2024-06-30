// api.js

import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const KiteId = JSON.parse(localStorage.getItem('userData'));
const headers = {
  'Authorization': `Bearer ${KiteId?.access}`
};

const fetchStatusData = async (page = 1, pageSize = 10) => {
  const res = await axios.get(`${baseUrl}/status/current/?paginate=true&clear_cache=false&page=${page}&page_size=${pageSize}`, { headers });
  if (res.status === 200) {
    return res.data.data;
  } else {
    throw new Error(`Failed to fetch status data. Status: ${res.status}`);
  }
};

const fetchEquityData = async (page = 1, pageSize = 10) => {
  const res = await axios.get(`${baseUrl}/strategy/bt/equity/search/?paginate=true&clear_cache=false&page=${page}&page_size=${pageSize}`, { headers });
  if (res.status === 200) {
    return res.data.data;
  } else {
    throw new Error(`Failed to fetch equity data. Status: ${res.status}`);
  }
};

const fetchEquityOrderData = async (page = 1, pageSize = 10) => {
  const res = await axios.get(`${baseUrl}/strategy/bt/orders/search/?paginate=true&clear_cache=true&page=${page}&page_size=${pageSize}`, { headers });
  if (res.status === 200) {
    return res.data.data;
  } else {
    throw new Error(`Failed to fetch equity order data. Status: ${res.status}`);
  }
};

const fetchUsersData = async (page = 1, pageSize = 10) => {
  const res = await axios.get(`${baseUrl}/user/profiles/?paginate=true&clear_cache=false&page=${page}&page_size=${pageSize}`, { headers });
  if (res.status === 200) {
    return res.data.data;
  } else {
    throw new Error(`Failed to fetch users data. Status: ${res.status}`);
  }
};

const fetchFutureData = async (page = 1, pageSize = 10) => {
  const res = await axios.get(`${baseUrl}/strategy/fno/analysis/search/?paginate=true&clear_cache=false&page=${page}&page_size=${pageSize}`, { headers });
  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error(`Failed to fetch future data. Status: ${res.status}`);
  }
};

const fetchFutureOrderData = async (page = 1, pageSize = 10) => {
  const res = await axios.get(`${baseUrl}/strategy/orders/?paginate=true&clear_cache=true&page=${page}&page_size=${pageSize}`, { headers });
  if (res.status === 200) {
    return res.data.data.results;
  } else {
    throw new Error(`Failed to fetch future order data. Status: ${res.status}`);
  }
};

export {
  fetchStatusData,
  fetchEquityData,
  fetchEquityOrderData,
  fetchUsersData,
  fetchFutureData,
  fetchFutureOrderData
};
