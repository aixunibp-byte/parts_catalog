import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Logo from './Logo';

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 8,
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Logo height={18} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 320 }}>
              Каталог запчастей Omegation. Остатки и цены синхронизируются напрямую с Ozon.
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase' }}>
              Навигация
            </Typography>
            {[
              { label: 'Каталог', to: '/' },
              { label: 'О нас', to: '/about' },
              { label: 'Контакты', to: '/contacts' },
            ].map((l) => (
              <MuiLink
                key={l.to}
                component={RouterLink}
                to={l.to}
                underline="hover"
                color="text.secondary"
                display="block"
                sx={{ mb: 1, fontSize: '0.9rem' }}
              >
                {l.label}
              </MuiLink>
            ))}
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase' }}>
              Админ
            </Typography>
            <MuiLink
              component={RouterLink}
              to="/admin/login"
              underline="hover"
              color="text.secondary"
              display="block"
              sx={{ fontSize: '0.9rem' }}
            >
              Вход в админ-панель
            </MuiLink>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} Omegation. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
}
