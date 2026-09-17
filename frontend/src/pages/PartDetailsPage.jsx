import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchPartById } from '../api';

export default function PartDetailsPage() {
  const { id } = useParams();
  const [part, setPart] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPartById(id)
      .then((data) => {
        setPart(data);
        setActiveImage(0);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" sx={{ aspectRatio: '1 / 1' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton width="60%" height={48} />
            <Skeleton width="30%" />
            <Skeleton width="40%" height={40} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!part) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>Товар не найден</Typography>
        <Button component={RouterLink} to="/" variant="outlined">Вернуться в каталог</Button>
      </Container>
    );
  }

  const images = part.images?.length ? part.images : [part.primary_image].filter(Boolean);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        color="inherit"
        sx={{ mb: 3, fontWeight: 700, pl: 0 }}
      >
        В каталог
      </Button>

      <Grid container spacing={{ xs: 3, md: 6 }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              aspectRatio: '1 / 1',
              bgcolor: (t) => (t.palette.mode === 'dark' ? '#1F1F1F' : '#F5F5F5'),
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {images[activeImage] ? (
              <Box component="img" src={images[activeImage]} alt={part.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Typography color="text.secondary">Нет фото</Typography>
            )}
          </Box>
          {images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
              {images.map((img, idx) => (
                <Box
                  key={img + idx}
                  component="img"
                  src={img}
                  onClick={() => setActiveImage(idx)}
                  sx={{
                    width: 72,
                    height: 72,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    opacity: idx === activeImage ? 1 : 0.5,
                    border: idx === activeImage ? '2px solid' : '2px solid transparent',
                    borderColor: idx === activeImage ? 'text.primary' : 'transparent',
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h2" sx={{ fontSize: '1.9rem', mb: 1 }}>{part.name}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Артикул: {part.article}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 3 }}>
            <Typography variant="h3" sx={{ fontSize: '1.6rem' }}>
              {part.price != null ? `${part.price.toLocaleString('ru-RU')} ${part.currency_code || 'RUB'}` : 'Цена по запросу'}
            </Typography>
            {part.old_price != null && part.old_price > part.price && (
              <Typography sx={{ textDecoration: 'line-through' }} color="text.secondary">
                {part.old_price.toLocaleString('ru-RU')} {part.currency_code || 'RUB'}
              </Typography>
            )}
          </Box>

          <Chip
            label={part.has_stock ? 'В наличии' : 'Нет в наличии'}
            color={part.has_stock ? 'secondary' : 'default'}
            sx={{ mb: 3 }}
          />

          {part.description && (
            <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
              {part.description}
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          {part.attributes?.length > 0 && (
            <Box>
              <Typography variant="h3" sx={{ fontSize: '1rem', mb: 1.5 }}>Характеристики</Typography>
              {part.attributes.map((attr) => (
                <Box key={attr.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography color="text.secondary">{attr.name}</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{attr.value}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {part.stocks?.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h3" sx={{ fontSize: '1rem', mb: 1.5 }}>Остатки по складам</Typography>
              {part.stocks.map((stock) => (
                <Box key={stock.warehouse} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography color="text.secondary">{stock.warehouse}</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{stock.quantity}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
