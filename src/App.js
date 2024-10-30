import React from 'react';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import MapComponent from './components/MapComponent';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MapComponent />
    </ThemeProvider>
  );
}

export default App;
