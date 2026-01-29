'use client';
import { useUser } from '@/hooks/user';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import MerchTable from './merchTable';
import MusicTable from './music-table';
import BlackboxTable from './blackbox-table';

function a11yProps(index: number) {
  return {
    id: `orders-tab-${index}`,
    'aria-controls': `orders-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Orders() {
  const [value, setValue] = useState(0);
  const { user } = useUser();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        padding: { xs: '1rem' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <Box
        sx={{
          borderRadius: '0.75rem',
          border: '2px solid rgba(21, 21, 21, 0.40)',
          background: '#000',
          boxShadow: '0px 68px 32px 0px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: 'auto',
          width: '100%',
          backgroundColor: '#000',
          gap: '3.75rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: '1rem',
              width: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#FFF',
                textAlign: 'center',
                width: { xs: '100%', sm: 'auto' },
                fontFamily: 'ClashDisplay-Bold',
                fontSize: { xs: '1.25rem', sm: '1.9rem' },
                fontWeight: 700,
                lineHeight: '120%',
              }}
            >
              Your Downloads & Orders
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="orders tabs"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#00B8C1',
                  },
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: 'space-grotesk',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&.Mui-selected': {
                      color: '#fff',
                    },
                  },
                }}
              >
                <Tab
                  label="Digital"
                  {...a11yProps(0)}
                  sx={{
                    '&.Mui-selected': {
                      color: '#fff',
                      background: 'rgba(15, 15, 15, 0.82)',
                    },
                  }}
                />
                <Tab
                  label="Merch"
                  {...a11yProps(1)}
                  sx={{
                    '&.Mui-selected': {
                      color: '#fff',
                      background: 'rgba(15, 15, 15, 0.82)',
                    },
                  }}
                />
                <Tab
                  label="Blackbox"
                  {...a11yProps(2)}
                  sx={{
                    '&.Mui-selected': {
                      color: '#fff',
                      background: 'rgba(15, 15, 15, 0.82)',
                    },
                  }}
                />
              </Tabs>
            </Box>
          </Box>

          <Box
            sx={{
              width: '100%',
            }}
          >
            <TabPanel value={value} index={0}>
              <MusicTable userId={user?._id || ''} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <MerchTable userId={user?._id || ''} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <BlackboxTable />
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
