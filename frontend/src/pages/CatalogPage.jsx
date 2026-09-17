import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  InputBase,
  Button,
  Chip,
  Pagination,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PartCard from '../components/PartCard';
import { fetchParts } from '../api';

const PAGE_SIZE = 24;

export default function CatalogPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchParts({ search, inStockOnly, page, pageSize: PAGE_SIZE });
      setItems(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [search, inStockOnly, page]);

  useEffect(() => {
    load();
  }, [load]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '60vh', md: '78vh' },
          display: 'flex',
          alignItems: 'flex-end',
          bgcolor: (t) => (t.palette.mode === 'dark' ? '#000' : '#EDEDED'),
          color: (t) => (t.palette.mode === 'dark' ? '#fff' : '#111'),
          px: { xs: 3, md: 8 },
          pb: { xs: 5, md: 8 },
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
          <Typography variant="h1" sx={{ mb: 2 }}>
            Omegation Parts
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, maxWidth: 480 }}>
            Оригинальные запчасти и аналоги. Прямая синхронизация остатков с Ozon.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Смотреть каталог
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }} id="catalog-grid">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Typography variant="h3">Каталог</Typography>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'action.hover',
                borderRadius: 999,
                px: 2,
                py: 0.75,
              }}
            >
              <SearchIcon fontSize="small" />
              <InputBase
                placeholder="Название, артикул, номер детали..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                sx={{ fontSize: '0.9rem', width: { xs: 160, sm: 260 } }}
              />
            </Box>
            <Chip
              label="В наличии"
              variant={inStockOnly ? 'filled' : 'outlined'}
              color={inStockOnly ? 'secondary' : 'default'}
              onClick={() => {
                setPage(1);
                setInStockOnly((value) => !value);
              }}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Skeleton variant="rectangular" sx={{ aspectRatio: '1 / 1', mb: 1.5 }} />
                  <Skeleton width="80%" />
                  <Skeleton width="40%" />
                </Grid>
              ))
            : items.map((part) => (
                <Grid item xs={6} sm={4} md={3} key={part.id}>
                  <PartCard part={part} />
                </Grid>
              ))}
        </Grid>

        {!loading && items.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
            Ничего не найдено по запросу «{search}»
          </Typography>
        )}

        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="standard"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
