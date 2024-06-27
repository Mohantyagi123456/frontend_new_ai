// src/indexeddb.js
import { openDB } from 'idb';

const DB_NAME = 'myDatabase';
const STORE_NAMES = {
  STATUS: 'statusData',
  EQUITY: 'equityData',
  EQUITY_ORDER: 'equityOrderData',
  USERS: 'usersData',
  FUTURE: 'futureData',
  FUTURE_ORDER: 'futureOrderData',


};

const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAMES.STATUS, { keyPath: 'id', autoIncrement: true });
      db.createObjectStore(STORE_NAMES.EQUITY, { keyPath: 'id', autoIncrement: true });
      db.createObjectStore(STORE_NAMES.EQUITY_ORDER, { keyPath: 'id', autoIncrement: true });
      db.createObjectStore(STORE_NAMES.USERS, { keyPath: 'id', autoIncrement: true });
      db.createObjectStore(STORE_NAMES.FUTURE, { keyPath: 'id', autoIncrement: true });
      db.createObjectStore(STORE_NAMES.FUTURE_ORDER, { keyPath: 'id', autoIncrement: true });

    },
  });
  return db;
};

export const clearObjectStore = async (storeName) => {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    await tx.store.clear();
    await tx.done;
  };
  
  export const clearAllStores = async () => {
    // localStorage.clear()
    await clearObjectStore(STORE_NAMES.STATUS);
    await clearObjectStore(STORE_NAMES.EQUITY);
    await clearObjectStore(STORE_NAMES.EQUITY_ORDER);
    await clearObjectStore(STORE_NAMES.USERS);
    await clearObjectStore(STORE_NAMES.FUTURE);
    await clearObjectStore(STORE_NAMES.FUTURE_ORDER);


  };

export const setStatusData = async (data) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAMES.STATUS, 'readwrite');
  data.forEach(item => tx.store.put(item));
  await tx.done;
};

export const setEquityData = async (data) => {
   
  const db = await initDB();
  const tx = db.transaction(STORE_NAMES.EQUITY, 'readwrite');
  data.forEach(item => tx.store.put(item));
  await tx.done;
};

export const setEquityOrderData = async (data) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAMES.EQUITY_ORDER, 'readwrite');
  data.forEach(item => tx.store.put(item));
  await tx.done;
};

export const setUsersData = async (data) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAMES.USERS, 'readwrite');
    data.forEach(item => tx.store.put(item));
    await tx.done;
};

export const setFutureData = async (data) => {
    console.log("datanvbmnjgjc cjk",data)

    const db = await initDB();
    const tx = db.transaction(STORE_NAMES.FUTURE, 'readwrite');
    // data.forEach(item => tx.store.put(item));
    tx.store.put(data.data)
    await tx.done;
};

export const setFutureOrderData = async (data) => {
    console.log("datadatadatadatadata",data)
    const db = await initDB();
    const tx = db.transaction(STORE_NAMES.FUTURE_ORDER, 'readwrite');
    data.forEach(item => tx.store.put(item));
    await tx.done;
};



export const getStatusData = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAMES.STATUS);
};

export const getEquityData = async () => {
  const db = await initDB();
  console.log("datadd",db)
  return await db.getAll(STORE_NAMES.EQUITY);
};

export const getEquityOrderData = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAMES.EQUITY_ORDER);
};


export const getUsersData = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAMES.USERS);
};

export const getFutureData = async () => {
    const db = await initDB();
    console.log("datadd", db)
    return await db.getAll(STORE_NAMES.FUTURE);
};

export const getFutureOrderData = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAMES.FUTURE_ORDER);
};

