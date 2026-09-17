import { useEffect, useState, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  fetchAdminPartById,
  updateAdminPart,
  revertPartToSync,
  uploadPartImage,
  addPartImageByUrl,
  deletePartImage,
  fetchPartAuditLog,
} from '../adminApi';

export default function AdminPartEditPage() {
  const { id } = useParams();
  const [part, setPart] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [auditLog, setAuditLog] = useState([]);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const data = await fetchAdminPartById(id);
    setPart(data);
    setForm({ name: data.name || '', description: data.description || '' });
    const log = await fetchPartAuditLog(id).catch(() => []);
    setAuditLog(log);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    await updateAdminPart(id, form);
    setMessage('Изменения сохранены');
    load();
  };

  const handleRevert = async () => {
    await revertPartToSync(id);
    setMessage('Карточка возвращена под управление синхронизации');
    load();
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadPartImage(id, file);
    load();
  };

  const handleAddByUrl = async () => {
    if (!imageUrl) return;
    await addPartImageByUrl(id, imageUrl);
    setImageUrl('');
    load();
  };

  const handleDeleteImage = async (url) => {
    await deletePartImage(id, url);
    load();
  };

  if (!part) return null;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Button component={RouterLink} to="/admin/parts" startIcon={<ArrowBackIcon />} color="inherit" sx={{ mb: 3, pl: 0, fontWeight: 700 }}>
        Все товары
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="h3">{part.name}</Typography>
        {part.manual_override && <Chip label="Ручное редактирование" color="secondary" size="small" />}
      </Box>

      {message && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMessage('')}>{message}</Alert>}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1.5 }}>
            Изображения
          </Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {(part.images || []).map((img) => (
              <Grid item xs={4} key={img}>
                <Box sx={{ position: 'relative' }}>
                  <Box component="img" src={img} sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteImage(img)}
                    sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button variant="outlined" component="label" sx={{ mr: 1, mb: 1 }}>
            Загрузить файл
            <input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={handleUpload} />
          </Button>

          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <TextField
              size="small"
              placeholder="URL изображения"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
            />
            <Button variant="outlined" onClick={handleAddByUrl}>Добавить</Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1.5 }}>
            Контент карточки
          </Typography>
          <TextField
            fullWidth
            label="Название"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={6}
            label="Описание"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            {part.manual_override && (
              <Button variant="outlined" color="secondary" onClick={handleRevert}>
                Revert to sync
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1.5 }}>
        Журнал изменений
      </Typography>
      {auditLog.length === 0 ? (
        <Typography color="text.secondary">Изменений пока не было</Typography>
      ) : (
        auditLog.map((entry, idx) => (
          <Box key={idx} sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2">
              {entry.timestamp} — {entry.field} изменено на «{entry.new_value}»
            </Typography>
          </Box>
        ))
      )}
    </Container>
  );
}
