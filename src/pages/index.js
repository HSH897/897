// import React, { useEffect } from 'react';
// import { Container, Typography } from '@mui/material';

// const loadAmap = () => {
//     window._AMapSecurityConfig = {
//         securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE,
//     };
//     const script = document.createElement('script');
//     script.src = `https://webapi.amap.com/maps?v=2.0&key=${process.env.NEXT_PUBLIC_AMAP_API_KEY}`;
//     script.async = true;
//     document.head.appendChild(script);
// };

// const Home = () => {
//     useEffect(() => {
//         loadAmap();
//     }, []);

//     return (
//         <Container>
//             <Typography variant="h4" gutterBottom>
//                 高德地图定位示例
//             </Typography>
//             <div id="map" style={{ width: '100%', height: '400px' }}></div>
//         </Container>
//     );
// };

// export default Home;


import React, { useEffect } from 'react';
import App from '../App';

const Home = () => {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
              .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
              })
              .catch((error) => {
                console.log('Service Worker registration failed:', error);
              });
          });
        }
      }, []);
      

  return <App />;
};

export default Home;
