import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#424242',
    },
    secondary: {
      main: '#f50057',
    },
    grey: {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e', // 如果您需要500色，可以在这里定义
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    // 如果需要更多颜色或背景色，可以在这里定义
    common: {
      white: '#ffffff',
      black: '#000000',
    },
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        input: {
          fontSize: '15px',
        },
        option: {
          fontSize: '12px',
          boxSizing: 'border-box',
          // height: '40px', // 设置选项的高度
          color: '#424242', // 设置默认文本颜色
          // backgroundColor: '#eeeeee',
          borderBottom: '1px solid #e0e0e0', // 添加分隔线
          '&:last-child': {
              borderBottom: 'none', // 最后一个选项不显示分隔线
          },
          '&[aria-selected]': {
            // backgroundColor: '#424242', // 选中时的背景颜色
            // color: '#ffffff', // 选中时的文本颜色
          },
          '&:hover': {
            backgroundColor: '#eeeeee', // 悬停时的背景颜色
            color: '#424242', // 悬停时的文本颜色
          },
        },
        paper: {
          border: '1px solid #bdbdbd', // 下拉菜单的边框
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // 下拉菜单的阴影
        },
      },
    },
    // 如果有其他组件需要统一样式，可以继续在这里添加
  },
});

export default theme;
