import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Box, Toolbar, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BarChartIcon from '@mui/icons-material/BarChart';

const DRAWER_WIDTH = 260;

const menuItems = [
  { label: 'Painel Inicial', icon: <DashboardIcon />, path: '/' },
  { label: 'Categorias', icon: <CategoryIcon />, path: '/categorias' },
  { label: 'Eventos', icon: <EventIcon />, path: '/eventos' },
  { label: 'Inscrições', icon: <PersonAddIcon />, path: '/inscricoes' },
  { label: 'Relatórios', icon: <BarChartIcon />, path: '/relatorios' },
];

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, pb: 2, pt: 3 }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
          🎯 Gerenciador
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Eventos & Inscrições
        </Typography>
      </Box>

      <Divider sx={{ my: 1, borderColor: 'rgba(0,0,0,0.06)' }} />

      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              sx={{
                borderRadius: 2.5,
                mb: 0.8,
                mx: 0.5,
                bgcolor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? '#FFF' : 'text.primary',
                '& .MuiListItemIcon-root': {
                  color: isActive ? '#FFF' : 'text.secondary',
                },
                '&:hover': {
                  bgcolor: isActive ? 'primary.dark' : 'rgba(99, 102, 241, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.92rem', fontWeight: isActive ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar for mobile */}
      {isMobile && (
        <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ color: 'text.primary', mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '1.05rem' }}>
              🎯 Gerenciador de Eventos
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Desktop */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          mt: isMobile ? 8 : 0,
          maxWidth: '1280px',
          mx: 'auto',
          width: '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
