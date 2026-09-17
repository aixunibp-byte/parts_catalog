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
import EngineExplorer from '../components/EngineExplorer';
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
          minHeight: { xs: 580, md: '78vh' },
          maxHeight: { md: 810 },
          overflow: 'hidden',
        }}
      >
        <EngineExplorer />

        <Box
          sx={{
            position: 'absolute',
            zIndex: 4,
            left: { xs: 24, md: 64 },
            right: { xs: 24, md: 'auto' },
            bottom: { xs: 182, md: 72 },
            maxWidth: { xs: 390, md: 500 },
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant="overline"
            sx={{ fontWeight: 800, letterSpacing: '0.14em', color: 'secondary.main' }}
          >
            Engineered for motion
          </Typography>
          <Typography variant="h1" sx={{ mt: 0.5, mb: 1.5 }}>
            Omegation Parts
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 410, mb: 2.5 }}>
            Выберите узел на схеме или найдите запчасть по артикулу, названию и номеру детали.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' })}
            sx={{ pointerEvents: 'auto' }}
          >
            Смотреть каталог
          </Button>
        </Box>

        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            zIndex: 4,
            right: { xs: 20, md: 48 },
            bottom: 20,
            color: 'text.secondary',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          }}
        >
          Нажмите на узел двигателя
        </Typography>
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
