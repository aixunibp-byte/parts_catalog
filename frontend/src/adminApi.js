const BASE_URL = '';
const TOKEN_KEY = 'omegation-admin-token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function adminRequest(path, options = {}) {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (res.status === 401) {
    clearAdminToken();
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Admin API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function fetchAdminParts({ search = '', onlyEdited = false, page = 1, pageSize = 24 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (onlyEdited) params.set('only_edited', 'true');
  params.set('page', String(page));
  params.set('page_size', String(pageSize));
  return adminRequest(`/admin/parts?${params.toString()}`);
}

export function fetchAdminPartById(id) {
  return adminRequest(`/admin/parts/${id}`);
}

export function updateAdminPart(id, payload) {
  return adminRequest(`/admin/parts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function revertPartToSync(id) {
  return adminRequest(`/admin/parts/${id}/revert-to-sync`, { method: 'POST' });
}

export function uploadPartImage(id, file) {
  const formData = new FormData();
  formData.append('file', file);
  return adminRequest(`/admin/parts/${id}/images/upload`, {
    method: 'POST',
    body: formData,
  });
}

export function addPartImageByUrl(id, url) {
  return adminRequest(`/admin/parts/${id}/images/by-url`, {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

export function deletePartImage(id, imageUrl) {
  const params = new URLSearchParams({ image_url: imageUrl });
  return adminRequest(`/admin/parts/${id}/images?${params.toString()}`, { method: 'DELETE' });
}

export function reorderPartImages(id, order) {
  return adminRequest(`/admin/parts/${id}/images/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ order }),
  });
}

export function fetchPartAuditLog(id) {
  return adminRequest(`/admin/parts/${id}/audit-log`);
}
