import { Container, Typography, Box } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3rem' }, mb: 3 }}>
        О нас
      </Typography>
      <Box sx={{ '& p': { mb: 2, color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.7 } }}>
        <p>
          Omegation — каталог запчастей и аналогов, синхронизируемый напрямую со складом
          продавца на Ozon. Мы обновляем остатки и цены автоматически, а карточки
          товаров дополняем фотографиями и описаниями вручную, чтобы покупателю было
          проще найти нужную деталь по названию, артикулу или номеру аналога.
        </p>
        <p>
          Каталог обновляется каждый час — актуальность остатков вы всегда можете
          проверить в статусе синхронизации.
        </p>
      </Box>
    </Container>
  );
}
