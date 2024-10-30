import { forwardRef } from 'react';
import SimpleBar from 'simplebar-react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { scrollbarClasses } from './classes';

// ----------------------------------------------------------------------

export const Scrollbar = forwardRef(
  ({ slotProps, children, fillContent, naturalScroll, sx, ...other }, ref) => (
    <Box
      component={SimpleBar}
      scrollableNodeProps={{ ref }}
      clickOnTrack={false}
      className={scrollbarClasses.root}
      sx={{
        px: 1,
        py: 1,
        gap: 2,
        // height:1,
        flexWrap: 'wrap',
        borderRadius: 1.5,
        position: 'relative',
        flexDirection: 'column', // 使用 column 以确保内容从上到下排列
        alignItems: 'flex-start', // 左对齐内容
        justifyContent: 'flex-start', // 上对齐内容
        minHeight: '120px', // 最小高度，确保即使没有内容也不会太小
        '& .simplebar-wrapper': slotProps?.wrapper,
        '& .simplebar-content-wrapper': slotProps?.contentWrapper,
        '& .simplebar-content': {
          ...(fillContent && {
            minHeight: 1,
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
          }),

          ...slotProps?.content,
        },
        ...sx,
      }}
      {...other}
    >            
      {children}
    </Box>
  )
);
