import React, { useEffect, useRef, useState } from 'react';  
import Card from '@mui/material/Card';

import RoutePlanner from './RoutePlanner';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [driving, setDriving] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startCoords, setStartCoords] = useState(null);
  const [intermediateCoords, setIntermediateCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState('');
  const [totalDistance, setTotalDistance] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window._AMapSecurityConfig = {
      securityJsCode: process.env.NEXT_PUBLIC_AMAP_API_KEY,
    };

    const AMapLoader = document.createElement('script');
    AMapLoader.src = 'https://webapi.amap.com/loader.js';
    AMapLoader.async = true;

    AMapLoader.onload = () => {
      window.AMapLoader.load({
        key: process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE,
        version: '2.0',
        plugin: [
          'AMap.Geolocation',
          'AMap.Scale',
          'AMap.ToolBar',
          'AMap.ControlBar',
          'AMap.HawkEye',
          'AMap.Driving',
          'AMap.Geocoder',
        ],
      })
        .then((AMap) => {
          const map = new AMap.Map(mapRef.current, {
            zoom: 11,
          });

          AMap.plugin('AMap.Geolocation', () => {
            const geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,
              timeout: 20000,
              zoomToAccuracy: true,
            });
            map.addControl(geolocation);

            geolocation.on('complete', (result) => {
              console.log('定位成功:', result.position);
              map.setCenter(result.position);
            });

            geolocation.on('error', (result) => {
              console.error('定位失败:', result);
              alert(`定位失败: ${result.message}`);
              map.setCenter([116.397428, 39.90923]);
            });
          });

          AMap.plugin(['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.HawkEye'], () => {
            const scaleControl = new AMap.Scale();
            const toolBarControl = new AMap.ToolBar();
            const controlBarControl = new AMap.ControlBar();
            const overViewControl = new AMap.HawkEye();

            map.addControl(scaleControl);
            map.addControl(toolBarControl);
            map.addControl(controlBarControl);
            map.addControl(overViewControl);
          });

          AMap.plugin('AMap.Driving', () => {
            const drivingInstance = new AMap.Driving({
              map: map,
              policy: AMap.DrivingPolicy.LEAST_DISTANCE,
              extensions: 'all',
            });
            setDriving(drivingInstance);
          });
        });
    };

    document.head.appendChild(AMapLoader);

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);
  const handleConfirm = (startAddress, intermediateAddress, destinationAddress) => { 
    setLoading(true);
  
    if (startAddress && destinationAddress) {
      Promise.all([
        getCoordinates(startAddress),
        getCoordinates(destinationAddress),
        intermediateAddress ? getCoordinates(intermediateAddress) : Promise.resolve(null)
      ])
      .then(([startCoords, destinationCoords, intermediateCoords]) => {
        setStartCoords(startCoords);
        setDestinationCoords(destinationCoords);
        setIntermediateCoords(intermediateCoords);
        drawRoute(startCoords, intermediateCoords, destinationCoords, startAddress, intermediateAddress, destinationAddress);
      })
      .catch(error => {
        console.error('获取坐标失败:', error);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      console.error('请确保已输入起点和终点');
    }
  };

  const drawRoute = (start, intermediate, destination, startAddress, intermediateAddress, destinationAddress) => { 
    setErrorMessage('');
    if (driving) {
        // 构造points数组
        // const points = [{ keyword: startAddress, city: '你的城市' }];

        // if (intermediateAddress) {
        //     points.push({ keyword: intermediateAddress, city: '你的城市' });
        // }

        // points.push({ keyword: destinationAddress, city: '你的城市' });
        const waypoints = intermediate ? [intermediate] : []; 
        driving.search(start, destination, { waypoints }, (status, result) => {
        // driving.search(points, (status, result) => {
            if (status === 'complete' && result.routes.length) {
                const route = result.routes[0];
                const totalDistance = route.distance; // 总距离（米）
                const totalTime = route.time; // 总时间（秒）

                const totalDistanceInKm = (totalDistance / 1000).toFixed(1);
                const totalHours = Math.floor(totalTime / 3600);
                const totalMinutes = Math.floor((totalTime % 3600) / 60);

                const formattedTotalTime = totalHours > 0 
                    ? `${totalHours}小时${totalMinutes}分钟` 
                    : `${totalMinutes}分钟`;

                // 设置公里数到状态
                setTotalDistance(totalDistanceInKm); // 更新状态为公里数
                // 初始化返回结果数组
                let results = [`起点 至 终点：${totalDistanceInKm}公里，时间：${formattedTotalTime}\n`];

                // 如果有中途，进行相关计算
                if (intermediate) {
                    let distanceToIntermediate = 0; // 起点到中途的距离
                    let timeToIntermediate = 0; // 起点到中途的时间
                    let distanceToDestination = 0; // 中途到终点的距离
                    let timeToDestination = 0; // 中途到终点的时间

                    let closestIntermediate = null; // 存储最接近的经纬度
                    let minDistance = Infinity; // 存储最小距离
                    let closestIndex = -1; // 存储最接近经纬度的索引

                    const steps = route.steps;
                    for (let i = 0; i < steps.length; i++) {
                        const step = steps[i];

                        // 计算最接近的中途
                        if (step.end_location) {
                            const stepCoords = {
                                lat: step.end_location.lat,
                                lng: step.end_location.lng,
                            };

                            const distanceToCoords = Math.sqrt(
                                Math.pow(stepCoords.lat - intermediate.lat, 2) +
                                Math.pow(stepCoords.lng - intermediate.lng, 2)
                            );

                            if (distanceToCoords < minDistance) {
                                minDistance = distanceToCoords;
                                closestIntermediate = stepCoords;
                                closestIndex = i; // 更新最接近经纬度的索引
                            }
                        }
                    }

                    // 累加起点到最接近中途之前的所有步骤的距离和时间
                    for (let i = 0; i <= closestIndex; i++) {
                        const step = steps[i];
                        distanceToIntermediate += step.distance; // 累加距离
                        timeToIntermediate += step.time; // 累加时间
                    }

                    // 从最接近点的下一个步骤开始累加中途到终点的距离和时间
                    for (let i = closestIndex + 1; i < steps.length; i++) {
                        const step = steps[i];
                        distanceToDestination += step.distance; // 累加距离
                        timeToDestination += step.time; // 累加时间
                    }

                    // 格式化中途的距离和时间
                    const distanceToIntermediateInKm = (distanceToIntermediate / 1000).toFixed(1);
                    const timeToIntermediateHours = Math.floor(timeToIntermediate / 3600);
                    const timeToIntermediateMinutes = Math.floor((timeToIntermediate % 3600) / 60);

                    const formattedTimeToIntermediate = timeToIntermediateHours > 0 
                        ? `${timeToIntermediateHours}小时${timeToIntermediateMinutes}分钟` 
                        : `${timeToIntermediateMinutes}分钟`;

                    const distanceToDestinationInKm = (distanceToDestination / 1000).toFixed(2);
                    const timeToDestinationHours = Math.floor(timeToDestination / 3600);
                    const timeToDestinationMinutes = Math.floor((timeToDestination % 3600) / 60);

                    const formattedTimeToDestination = timeToDestinationHours > 0 
                        ? `${timeToDestinationHours}小时${timeToDestinationMinutes}分钟` 
                        : `${timeToDestinationMinutes}分钟`;

                    // 更新返回结果
                    results.push(`其中：`);
                    results.push(`起点 至 中途：${distanceToIntermediateInKm}公里，时间：${formattedTimeToIntermediate}`);
                    results.push(`中途 至 终点：${distanceToDestinationInKm}公里，时间：${formattedTimeToDestination}`);
                }

                // 设置路由信息
                setRouteInfo(results.join('\n'));
                console.log(results); // 输出路由详情
            } else {
                console.error('路线规划失败:', result);
                if (result === 'USER_DAILY_QUERY_OVER_LIMIT') {
                  setErrorMessage('您已达到每日请求限制，请稍后再试。'); // 设置错误信息
              }
            }
        });
    }
};


  
  
  const getCoordinates = (address) => {
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        window.AMap.plugin('AMap.Geocoder', () => {
          const geocoder = new window.AMap.Geocoder();
          geocoder.getLocation(address, (status, result) => {
            if (status === 'complete' && result.geocodes.length) {
              resolve(result.geocodes[0].location);
            } else {
              reject(`获取 ${address} 的经纬度失败: ${result}`);
            }
          });
        });
      } else {
        reject('AMap not loaded yet');
      }
    });
  };
  

  
  return (
    <Card style={{ height: '100vh', width: '100vw', position: 'relative', padding: 0 }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      <RoutePlanner 
        handleConfirm={handleConfirm} 
        routeInfo={routeInfo} 
        setRouteInfo={setRouteInfo} 
        loading={loading}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        totalDistance={totalDistance}
        setTotalDistance={setTotalDistance}
      />
    </Card>
  );
};

export default MapComponent;
