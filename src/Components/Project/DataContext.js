// DataContext.js

import React, { createContext, useState } from 'react';

// Create a context object
export const DataContext = createContext();

// Data provider component
export const DataProvider = ({ children }) => {
  // Example data
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', location: 'New York', account: 'Premium', date: '2023-06-21', amount: 1500, phone: '123-456-7890', version: '1.0' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', location: 'Los Angeles', account: 'Standard', date: '2023-06-22', amount: 1200, phone: '987-654-3210', version: '1.1' },
    // Add more data as needed
  ]);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};
