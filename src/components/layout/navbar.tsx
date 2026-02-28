'use client';

import { ROUTES } from '@/util/paths';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import RoundedButton from '../ui/rounded-button';
import { useLogout } from '@/hooks/auth';
import { useCart } from '@/hooks/cart';
import { useCartDrawer } from '@/providers/CartProvider';
import { useUser } from '@/hooks/user';

export default function Navbar({ trigger }: { trigger: boolean }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const logoutMutation = useLogout();
  const { data: cart } = useCart();
  const { open: openCart } = useCartDrawer();
  const { user } = useUser();

  const cartItemCount = cart?.data.itemCount || 0;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { text: 'GAME', href: ROUTES.GAME.HOME },
    { text: 'SHOP', href: ROUTES.SHOP.HOME },
    { text: 'MUSIC', href: ROUTES.MUSIC },
  ];
  const navIcons = [
    {
      icon: (
        <Badge
          badgeContent={cartItemCount}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#D91313',
              color: '#fff',
              fontFamily: 'satoshi-bold',
              fontSize: '0.75rem',
            },
          }}
        >
          <Image src={'/assets/cart.svg'} alt="Cart" width={40} height={40} />
        </Badge>
      ),
      href: ROUTES.CART,
      onClick: openCart,
    },
    {
      icon: <Image src={'/assets/user.svg'} alt="User" width={40} height={40} />,
      href: ROUTES.USER.PROFILE,
    },
  ];

  return (
    <>
      <Box sx={{ height: { xs: '2rem', sm: '5rem' } }} />
      <Box
        component="header"
        sx={{
          position: trigger ? 'fixed' : 'relative',
          top: 0,
          zIndex: 1100,
          width: '100%',
          paddingInline: { xs: '0', sm: '2rem', md: '6rem' },
          bgcolor: trigger ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
          backdropFilter: trigger ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            onClick={() => router.push(ROUTES.USER.HOME)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          >
            <Image
              src="/assets/logo.svg"
              alt="Dugod Logo"
              style={{
                width: isMobile ? '5rem' : '6.75rem',
                height: 'auto',
              }}
              width={100}
              height={100}
            />
          </Box>

          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: '4rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  variant="h6"
                  sx={{
                    fontFamily: 'satoshi-bold',
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'satoshi-bold',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '1.25rem',
                    }}
                  >
                    {link.text}
                  </Typography>
                </Link>
              ))}
            </Box>
          ) : (
            <IconButton onClick={toggleMobileMenu} sx={{ color: '#fff' }}>
              <MenuIcon />
            </IconButton>
          )}

          {isMobile ? null : (
            <Box sx={{ flexGrow: 0, display: 'flex', gap: '1rem' }}>
              <IconButton onClick={openCart}>
                <Badge
                  badgeContent={cartItemCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#D91313',
                      color: '#fff',
                      fontFamily: 'satoshi-bold',
                      fontSize: '0.75rem',
                    },
                  }}
                >
                  <Image
                    src={'/assets/cart.svg'}
                    alt="Cart"
                    width={isMobile ? 32 : 40}
                    height={isMobile ? 32 : 40}
                  />
                </Badge>
              </IconButton>
              <Tooltip title="Account settings">
                <IconButton sx={{ p: 0 }} onClick={() => router.push(ROUTES.USER.PROFILE)}>
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      color: '#fff',
                      fontFamily: 'satoshi-bold',
                      width: isMobile ? 32 : 40,
                      height: isMobile ? 32 : 40,
                    }}
                  >
                    <Image
                      src={user?.picture || '/assets/user.svg'}
                      alt="User"
                      width={32}
                      height={32}
                    />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </Box>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '100vw',
            bgcolor: '#0C0C0C',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <List sx={{ pt: 4 }}>
          <ListItem
            onClick={() => {
              toggleMobileMenu();
            }}
            sx={{
              py: 2,
              marginBottom: '2rem',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            <ListItemText
              primary={<Image src={'/assets/delete.svg'} alt="Close" width={60} height={60} />}
              primaryTypographyProps={{
                sx: {
                  color: '#fff',
                  textAlign: 'center',
                },
              }}
            />
          </ListItem>
          {navLinks.map((link) => (
            <ListItem
              key={link.text}
              onClick={() => {
                router.push(link.href);
                toggleMobileMenu();
              }}
              sx={{
                py: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemText
                primary={link.text}
                primaryTypographyProps={{
                  sx: {
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'ClashDisplay-Bold',
                    fontSize: '1.5625rem',
                    fontWeight: 700,
                    lineHeight: '120%',
                  },
                }}
              />
            </ListItem>
          ))}
          {navIcons.map((link) => (
            <ListItem
              key={link.href}
              onClick={() => {
                if (link.onClick) {
                  link.onClick();
                } else {
                  router.push(link.href);
                }
                toggleMobileMenu();
              }}
              sx={{
                py: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemText
                primary={link.icon}
                primaryTypographyProps={{
                  sx: {
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'ClashDisplay-Bold',
                    fontSize: '1.5625rem',
                    fontWeight: 700,
                    lineHeight: '120%',
                  },
                }}
              />
            </ListItem>
          ))}
          <RoundedButton
            onClick={handleLogout}
            startIcon={<Image src={'/assets/logout.svg'} alt="Logout" width={24} height={24} />}
            sx={{
              '&:hover': { backgroundColor: 'rgba(137, 19, 15, 0.32)' },
              width: '100%',
              paddingInline: '2rem',
              marginTop: '2rem',
              backgroundColor: '#D91313',
              color: '#fff',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Manrope',
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: '#fff',
                lineHeight: '120%',
                textAlign: 'center',
              }}
            >
              Log Out
            </Typography>
          </RoundedButton>
        </List>
      </Drawer>
    </>
  );
}
