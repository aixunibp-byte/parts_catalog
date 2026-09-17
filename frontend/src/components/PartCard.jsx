import { Box, Typography, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function PartCard({ part }) {
  const {
    id,
    name,
    article,
    price,
    old_price: oldPrice,
    currency_code: currency = 'RUB',
    primary_image: image,
    has_stock: hasStock,
    manual_override: manualOverride,
  } = part;

  return (
    <Box
      component={RouterLink}
      to={`/parts/${id}`}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover .part-card-media img': { transform: 'scale(1.04)' },
      }}
    >
      <Box
        className="part-card-media"
        sx={{
          position: 'relative',
          aspectRatio: '1 / 1',
          bgcolor: (t) => (t.palette.mode === 'dark' ? '#1F1F1F' : '#F5F5F5'),
          overflow: 'hidden',
          mb: 1.5,
        }}
      >
        {image ? (
          <Box
            component="img"
            src={image}
            alt={name}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              fontSize: '0.8rem',
            }}
          >
            Нет фото
          </Box>
        )}

        <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 0.5 }}>
          {!hasStock && (
            <Chip size="small" label="Нет в наличии" sx={{ bgcolor: 'text.primary', color: 'background.paper' }} />
          )}
          {manualOverride && (
            <Chip size="small" label="Обновлено" color="secondary" />
          )}
        </Box>
      </Box>

      <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.25 }} noWrap>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Арт. {article}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          {price != null ? `${price.toLocaleString('ru-RU')} ${currency}` : 'Цена по запросу'}
        </Typography>
        {oldPrice != null && oldPrice > price && (
          <Typography
            variant="body2"
            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
          >
            {oldPrice.toLocaleString('ru-RU')} {currency}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
