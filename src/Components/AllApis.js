
// import axios from 'axios';

// const KiteId = JSON.parse(localStorage.getItem('userData'));

// const headers = {
//   'Authorization': `Bearer ${KiteId?.access}`
// };


// // Function to fetch user data asynchronously
// export async function getStatus(page, pageSize) {
//   const baseUrl = process.env.REACT_APP_BASE_URL
//   try {
//     const res = await axios.get(`${baseUrl}/status/current/`, {
//       headers,
//       // params: {
//       //   page: page,
//       //   page_size: pageSize,
//       // },
//     });

//     if (res.status === 200) {
//       const formattedData = res.data.data.results

//       return {
//         data: formattedData
//       };
//     } else {
//       throw new Error(`Failed to fetch data. Status: ${res.status}`);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error; // Re-throw the error for the caller to handle
//   }
// }
