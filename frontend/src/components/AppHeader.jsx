import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  InputBase,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Logo from './Logo';
import { useThemeMode } from '../ThemeModeContext';

const NAV_LINKS = [
  { label: 'Каталог', to: '/' },
  { label: 'О нас', to: '/about' },
  { label: 'Контакты', to: '/contacts' },
];

export default function AppHeader() {
  const { mode, toggleMode } = useThemeMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(17,17,17,0.85)' : 'rgba(255,255,255,0.85)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 72, display: 'flex', alignItems: 'center', gap: 2, px: { xs: 2, md: 4 } }}>
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
          {NAV_LINKS.map((link) => (
            <Button
              key={link.to}
              component={RouterLink}
              to={link.to}
              color="inherit"
              disableRipple
              sx={{
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.02em',
                px: 0.5,
                minWidth: 0,
                borderBottom: '2px solid transparent',
                borderRadius: 0,
                '&:hover': { borderColor: 'text.primary', backgroundColor: 'transparent' },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        <IconButton
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          onClick={() => setMenuOpen(true)}
          aria-label="Открыть меню"
        >
          <MenuIcon />
        </IconButton>

        <Box
          component={RouterLink}
          to="/"
          sx={{
            flex: { xs: 1, md: 'none' },
            display: 'flex',
            justifyContent: 'center',
            color: 'text.primary',
            textDecoration: 'none',
          }}
        >
          <Logo height={20} />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
          {searchOpen ? (
            <InputBase
              autoFocus
              placeholder="Поиск по артикулу..."
              onBlur={() => setSearchOpen(false)}
              sx={{
                bgcolor: 'action.hover',
                px: 2,
                py: 0.5,
                borderRadius: 999,
                fontSize: '0.9rem',
                width: { xs: 140, sm: 220 },
              }}
            />
          ) : (
            <IconButton onClick={() => setSearchOpen(true)} aria-label="Поиск">
              <SearchIcon />
            </IconButton>
          )}
          <IconButton onClick={toggleMode} aria-label="Переключить тему">
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
            <IconButton onClick={() => setMenuOpen(false)} aria-label="Закрыть меню">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 1 }} />
          <List>
            {NAV_LINKS.map((link) => (
              <ListItemButton
                key={link.to}
                component={RouterLink}
                to={link.to}
                onClick={() => setMenuOpen(false)}
              >
                <ListItemText
                  primaryTypographyProps={{ fontWeight: 700, textTransform: 'uppercase' }}
                  primary={link.label}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
