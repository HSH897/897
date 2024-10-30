import React, { useState, useEffect } from 'react';
import { Typography, ToggleButton, ToggleButtonGroup, Box, Tooltip, Switch, Button, TextField, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import ComponentBlock from '../hook-form/ComponentBlock';
import Autocomplete from '@mui/material/Autocomplete';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import WrongLocationSharpIcon from '@mui/icons-material/WrongLocationSharp';
import InputAdornment from '@mui/material/InputAdornment';
import { Scrollbar } from '../hook-form/scrollbar';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const RoutePlanner = ({ handleConfirm, routeInfo, setRouteInfo, totalDistance, setTotalDistance, loading, errorMessage, setErrorMessage }) => {
    const [view, setView] = useState('distance');
    const [departureOptions, setDepartureOptions] = useState([]);
    const [arrivalOptions, setArrivalOptions] = useState([]);
    const [startAddress, setStartAddress] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [intermediateAddress, setIntermediateAddress] = useState(''); // 新增中途地址
    const [useIntermediate, setUseIntermediate] = useState(false); // 开关状态
    const [freight, setFreight] = useState('');
    const [technicalFee, setTechnicalFee] = useState('');
    const [costPerKilometer, setCostPerKilometer] = useState(0);
    const [savedAddresses, setSavedAddresses] = useState([]);



    // 从 localStorage 恢复数据
    useEffect(() => {
        const savedDepartureOptions = localStorage.getItem('departureOptions');
        const savedArrivalOptions = localStorage.getItem('arrivalOptions');
        const savedAddresses = localStorage.getItem('savedAddresses');
        if (savedDepartureOptions) {
            setDepartureOptions(JSON.parse(savedDepartureOptions));
        }
        if (savedArrivalOptions) {
            setArrivalOptions(JSON.parse(savedArrivalOptions));
        }
        if (savedAddresses) {
            setSavedAddresses(JSON.parse(savedAddresses)); // 恢复地址信息
        }
    }, []);

    // 每次更新选项时同步到 localStorage
    useEffect(() => {
        localStorage.setItem('departureOptions', JSON.stringify(departureOptions));
        localStorage.setItem('arrivalOptions', JSON.stringify(arrivalOptions));
        localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses)); // 保存地址信息
    }, [departureOptions, arrivalOptions, savedAddresses]);

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const handleQuery = () => {
        // 检查地址的唯一性
        const addresses = [startAddress, intermediateAddress, destinationAddress];
        const hasDuplicates = addresses.some((address, index) => addresses.indexOf(address) !== index);

        if (hasDuplicates) {
            setErrorMessage('提供的地址不能相同'); // 设置错误消息
            return; // 退出函数
        }

        // 清空错误消息
        setErrorMessage('');
        if (startAddress) {
            setDepartureOptions((prev) => {
                const updatedOptions = prev.filter(option => option !== startAddress);
                return [startAddress, ...updatedOptions].slice(0, 10);
            });
        }
        if (destinationAddress) {
            setArrivalOptions((prev) => {
                const updatedOptions = prev.filter(option => option !== destinationAddress);
                return [destinationAddress, ...updatedOptions].slice(0, 10);
            });
        }
        if (intermediateAddress) {
            setArrivalOptions((prev) => {
                const updatedOptions = prev.filter(option => option !== intermediateAddress);
                return [intermediateAddress, ...updatedOptions].slice(0, 10);
            });
        }

        // 检查是否有起点和终点
        if (startAddress && destinationAddress) {
            // 如果使用中途，调用 handleConfirm 传递中途
            handleConfirm(startAddress, useIntermediate ? intermediateAddress : null, destinationAddress);

            // 存储终点地址
            setSavedAddresses((prev) => {
                const updatedAddresses = prev.filter(address => address !== destinationAddress);
                return [destinationAddress, ...updatedAddresses];
            });

            // 重置中途
            if (!useIntermediate) {
                setIntermediateAddress(''); // 如果不使用中途，重置中途地址
            }
        } else {
            console.error('请确保已输入起点和终点');
            setErrorMessage('请确保已输入起点和终点');
        }
    };

    const handleSwap = () => {
        setStartAddress(destinationAddress);
        setDestinationAddress(startAddress);
    };


    const handleCalculate = () => {
        // 清空错误消息
        setErrorMessage('');
        const freightValue = parseFloat(freight); // 将运费转换为数字
        const technicalFeeValue = parseFloat(technicalFee); // 将技术费转换为数字
        const adjustedFreight = freightValue - (isNaN(technicalFeeValue) ? 0 : technicalFeeValue); // 计算调整后的运费
        if (totalDistance > 0 && adjustedFreight > 0) {
            const cost = adjustedFreight / totalDistance; // 计算每公里费用
            setCostPerKilometer(cost.toFixed(2)); // 保留两位小数
        } else {
            console.error('请确保运费和距离有效');
            setErrorMessage('请确保运费和距离有效');
        }
    };


    // 重置所有状态的函数
    const handleClear = () => {
        setRouteInfo([]);
        setTotalDistance(0);
    };
    return (
        <Card
            sx={{
                p: 4,
                position: 'absolute',
                top: '15px',
                right: '40px',
                width: '360px' ,
                width: {
                    xs: '50%',     // 手机上宽度 50%
                    sm: '360px',   // 桌面上宽度 360px
                  },
                  height: {
                    xs: '50%',    // 手机上高度 100%
                    sm: '500px',   // 桌面上高度 500px
                  },
                // maxHeight: { sm: '60%', md: '530px' }, // 最大高度
                padding: 2,
                zIndex: 1000,
                backgroundImage: 'url(https://hsh897.github.io/897/7.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                // height: '100vh',
                backgroundColor: 'grey.100',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                overflow: 'auto', // 滚动条
                transition: 'width 0.3s, height 0.3s',
                transform: {
                    xs: 'scale(0.8)', // 手机上缩放 80%
                    sm: 'scale(1)',   // 桌面上正常大小
                },
                transformOrigin: 'top right', 
            }}
        >


            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" gutterBottom sx={{ margin: 0 }}>
                    路径规划
                </Typography>
                <IconButton onClick={handleClear}>
                    <DeleteForeverSharpIcon />
                </IconButton>
            </Box>
            <ToggleButtonGroup
                color="primary"
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="view selection"
                size="small"
                fullWidth
                sx={{ width: '100%', mb: 3 }}
            >
                <ToggleButton value="distance" sx={{ flex: 1 }}>距离</ToggleButton>
                <ToggleButton value="freight" sx={{ flex: 1 }}>运费</ToggleButton>
                <ToggleButton value="address" sx={{ flex: 1 }}>地址</ToggleButton>
            </ToggleButtonGroup>


            <Box>
                {view === 'distance' && (
                    <>

                        <Box sx={{ mx: 'auto', display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%' }}>
                                <Autocomplete
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    freeSolo
                                    options={departureOptions.length > 0 ? departureOptions : ['当前没有地址']}
                                    getOptionLabel={(option) => option}
                                    value={startAddress}
                                    onChange={(event, newValue) => {
                                        setStartAddress(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="出发"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            value={startAddress}
                                            onChange={(e) => setStartAddress(e.target.value)}
                                        />
                                    )}
                                />

                                {useIntermediate && (
                                    <Autocomplete
                                        sx={{ mb: 2 }}
                                        fullWidth
                                        freeSolo
                                        options={departureOptions.length > 0 ? departureOptions : ['当前没有地址']}
                                        getOptionLabel={(option) => option}
                                        value={intermediateAddress}
                                        onChange={(event, newValue) => {
                                            setIntermediateAddress(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="中途"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                value={intermediateAddress}
                                                onChange={(e) => setIntermediateAddress(e.target.value)}
                                            />
                                        )}
                                    />
                                )}

                                <Autocomplete
                                    fullWidth
                                    freeSolo
                                    options={arrivalOptions.length > 0 ? arrivalOptions : ['当前没有地址']}
                                    getOptionLabel={(option) => option}
                                    value={destinationAddress}
                                    onChange={(event, newValue) => {
                                        setDestinationAddress(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="到达"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            value={destinationAddress}
                                            onChange={(e) => setDestinationAddress(e.target.value)}
                                        />
                                    )}
                                />
                            </Box>

                            <IconButton onClick={handleSwap}>
                                <SwapVertIcon fontSize="large" color="primary" />
                            </IconButton>
                        </Box>

                        {errorMessage && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                大哥，{errorMessage}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginRight: 'auto', borderRadius: '12px', width: '40%' }} // 使用 marginRight: 'auto' 使按钮靠左
                                onClick={handleQuery}
                                disabled={loading}
                            >
                                {loading ? '查询中...' : '查询'}
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Switch
                                    checked={useIntermediate}
                                    onChange={() => setUseIntermediate(!useIntermediate)}
                                    color="primary"
                                />
                                <Typography variant="body2" sx={{ marginRight: 1 }}
                                >中途</Typography>
                            </Box>
                        </Box>

                        <ComponentBlock title="路径（公里）" sx={{ mt: 3, mb: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

                            {routeInfo ? (
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                    {routeInfo}
                                </Typography>
                            ) : (
                                <Typography variant="body2" sx={{ color: 'grey.500' }}>
                                    没有路径信息
                                </Typography>
                            )}

                        </ComponentBlock>
                    </>
                )}
            </Box>


            <Box>
                {view === 'freight' && (
                    <>
                        <Box sx={{ mx: 'auto', display: 'flex', flexDirection: 'column', mb: 1 }}>
                        {/* <Box sx={{ width: '100%' }}> */}
                                <TextField
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    type="number"
                                    label="运费"
                                    value={freight}
                                    onChange={(e) => setFreight(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                    InputProps={{ endAdornment: <InputAdornment position="end">元</InputAdornment> }}
                                />
                                <TextField
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    type="number"
                                    label="- 技术费"
                                    value={technicalFee}
                                    onChange={(e) => setTechnicalFee(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                    InputProps={{ endAdornment: <InputAdornment position="end">元</InputAdornment> }}
                                />
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="距离"
                                    value={totalDistance}
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                    InputProps={{ endAdornment: <InputAdornment position="end">公里</InputAdornment> }}
                                />

                            {/* </Box> */}
                        </Box>
                        {errorMessage && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                大哥，{errorMessage}
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: 1,
                                borderRadius: '12px', 
                                width: '40%'
                            }}
                            onClick={handleCalculate}
                        >
                            计算
                        </Button>
            
                        <ComponentBlock title="每公里（元）" sx={{ mt: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

                            {costPerKilometer ? (
                                <>
                                    <Typography variant="h6">
                                        每公里费用:
                                        <span style={{ color: costPerKilometer >= 2 ? 'green' : 'red' }}>
                                            {` ${costPerKilometer} `}
                                        </span>
                                        元
                                    </Typography>
                                    <Typography variant="body2">
                                        起点: {startAddress}
                                    </Typography>
                                    <Typography variant="body2" >
                                        终点: {destinationAddress}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" sx={{ color: 'grey.500' }}>
                                    没有运费信息
                                </Typography>
                            )}

                        </ComponentBlock>
                    </>
                )}
            </Box>


            <Box>
                {view === 'address' && (
                    <>
                        <Box sx={{ mx: 'auto', display: 'flex', flexDirection: 'column', mb: 1  }}>
                            <Box
                                gap={3}
                                display="grid"
                                alignItems="flex-start"
                                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
                            >
                             
                                    <Scrollbar
                                        sx={{
                                            height: 320,
                                            borderRadius: 1,
                                            border: (theme) => `solid 1px ${theme.palette.divider}`,
                                            overflowY: 'auto',
                                            overflowX: 'hidden',
                                            minWidth: '200px',
                                            minHeight: '100px',
                                        }}
                                    >
                                        {savedAddresses.length > 0 ? (
                                            savedAddresses.map((address, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{ display: 'flex', alignItems: 'center', p: 1 }}
                                                >
                                                    <Typography variant="body2" sx={{ flex: 1 }}>
                                                        {address}
                                                    </Typography>
                                                    <Tooltip title="复制地址">
                                                        <IconButton
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(address);
                                                            }}
                                                        >
                                                            <ContentCopyIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" sx={{ p: 1, color: 'text.secondary' }}>
                                                暂无地址
                                            </Typography>
                                        )}
                                    </Scrollbar>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>

            
        </Card>
    );
};

export default RoutePlanner;
