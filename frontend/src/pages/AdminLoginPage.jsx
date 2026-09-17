import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Alert } from '@mui/material';
import { setAdminToken, fetchAdminParts } from '../adminApi';

export default function AdminLoginPage() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAdminToken(token);
    try {
      await fetchAdminParts({ page: 1, pageSize: 1 });
      navigate('/admin/parts');
    } catch (err) {
      setError('Неверный токен доступа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 8, md: 14 } }}>
      <Typography variant="h2" sx={{ fontSize: '1.8rem', mb: 3 }}>
        Вход в админ-панель
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="password"
          label="Admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          sx={{ mb: 2 }}
          autoFocus
        />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading || !token}>
          {loading ? 'Проверка...' : 'Войти'}
        </Button>
      </Box>
    </Container>
  );
}
