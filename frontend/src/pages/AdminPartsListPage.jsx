import { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  InputBase,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchAdminParts } from '../adminApi';

const PAGE_SIZE = 30;

export default function AdminPartsListPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [onlyEdited, setOnlyEdited] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchAdminParts({ search, onlyEdited, page, pageSize: PAGE_SIZE });
    setItems(data.items);
    setTotal(data.total);
  }, [search, onlyEdited, page]);

  useEffect(() => {
    load();
  }, [load]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Typography variant="h3">Все товары ({total})</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'action.hover', borderRadius: 999, px: 2, py: 0.75 }}>
            <SearchIcon fontSize="small" />
            <InputBase
              placeholder="Поиск..."
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              sx={{ fontSize: '0.9rem', width: 220 }}
            />
          </Box>
          <Chip
            label="Только изменённые"
            variant={onlyEdited ? 'filled' : 'outlined'}
            color={onlyEdited ? 'secondary' : 'default'}
            onClick={() => { setPage(1); setOnlyEdited((v) => !v); }}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Фото</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Бренд</TableCell>
            <TableCell>Артикул</TableCell>
            <TableCell>Цена</TableCell>
            <TableCell>Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((part) => (
            <TableRow
              key={part.id}
              component={RouterLink}
              to={`/admin/parts/${part.id}`}
              hover
              sx={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              <TableCell>
                <Avatar variant="square" src={part.primary_image} sx={{ width: 44, height: 44 }} />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{part.name}</TableCell>
              <TableCell>{part.brand}</TableCell>
              <TableCell>{part.article}</TableCell>
              <TableCell>{part.price != null ? `${part.price.toLocaleString('ru-RU')} ${part.currency_code || 'RUB'}` : '—'}</TableCell>
              <TableCell>
                {part.manual_override && <Chip size="small" label="Ручное" color="secondary" sx={{ mr: 0.5 }} />}
                {part.is_archived && <Chip size="small" label="Архив" />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} />
        </Box>
      )}
    </Container>
  );
}
