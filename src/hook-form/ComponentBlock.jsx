import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------
const ComponentBlock = ({ title, sx, children, ...other }) => {
  return (
    <Stack
      sx={(theme) => ({
        px: 3,
        py: 2,
        gap: 2,
        // height:1,
        flexWrap: 'wrap',
        borderRadius: 1.5,
        position: 'relative',
        flexDirection: 'column', // 使用 column 以确保内容从上到下排列
        alignItems: 'flex-start', // 左对齐内容
        justifyContent: 'flex-start', // 上对齐内容
        border: `1px solid ${theme.palette.grey[500]}`,
        boxShadow: `0 0 0 0px ${theme.palette.grey[500]}`,
        minHeight: '120px', // 最小高度，确保即使没有内容也不会太小
        ...sx,
      })}
      {...other}
    >
      {title && (
        <Box
          component="span"
          sx={(theme) => ({
            px: 1,
            top: 0,
            ml: 2.5,
            left: 0,
            py: 0.25,
            borderRadius: 2,
            position: 'absolute',
            color: theme.palette.text.primary, // 使用主题中的文本颜色
            bgcolor: theme.palette.common.white, // 保留标题的白色背景
            transform: 'translateY(-50%)',
            fontSize: theme.typography.caption.fontSize,
            fontWeight: theme.typography.fontWeightSemiBold,
            border: `solid 1px ${theme.palette.grey[500]}`, // 使用主题中的灰色边框
          })}
        >
          {title}
        </Box>
      )}

      {children}
    </Stack>
  );
}

export default ComponentBlock;
