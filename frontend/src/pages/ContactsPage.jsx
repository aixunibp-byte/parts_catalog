import { Container, Typography, Box, Grid } from '@mui/material';

export default function ContactsPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3rem' }, mb: 4 }}>
        Контакты
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
            Почта
          </Typography>
          <Typography color="text.secondary">support@omegation.example</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
            Магазин на Ozon
          </Typography>
          <Typography color="text.secondary">ozon.ru/seller/omegation</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
