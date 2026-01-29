'use client';
import { useUser } from '@/hooks/user';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import SectionBg from '../../../../public/assets/section-bg.png';
import Footer from '../../layout/footer';
import Account from './account';
import Orders from './orders';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export default function Profile() {
  const { user } = useUser();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          color: '#fff',
        }}
      >
        <Typography>Something went wrong. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: '0.5rem', sm: '1rem' },
        width: '100%',
        padding: 0,
        margin: 0,
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '0.5rem', sm: '1rem' },
          width: '100%',
          padding: 0,
          margin: 0,
        }}
      >
        <Typography
          sx={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'ClashDisplay-Bold',
            fontSize: {
              xs: '2rem',
              sm: '2.5rem',
              md: '3.0625rem',
            },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '120%',
            marginTop: { xs: '4rem' },
            px: { xs: '1rem', sm: 0 },
          }}
        >
          Profile
        </Typography>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="profile tabs"
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
              label="🗂️ My Purchases"
              {...a11yProps(0)}
              sx={{
                '&.Mui-selected': {
                  color: '#fff',
                  background: 'rgba(15, 15, 15, 0.82)',
                },
              }}
            />
            <Tab
              label="⚙️ Account Settings"
              {...a11yProps(1)}
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
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '0.5rem', sm: '1rem' },
          width: '100%',
          backgroundImage: `url(${SectionBg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#000',
          paddingInline: { xs: '1rem', sm: '3rem', md: '7.5rem' },
          paddingBlock: { xs: '1.5rem' },
          margin: 0,
          minHeight: '100vh',
        }}
      >
        <TabPanel value={value} index={0}>
          <Orders />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box
            sx={{
              paddingInline: { xs: '1rem', sm: '3rem', md: '6rem' },
            }}
          >
            <Account />
          </Box>
        </TabPanel>
        <Box
          sx={{
            marginTop: { xs: '2rem', sm: '3rem', md: '4rem' },
          }}
        >
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
