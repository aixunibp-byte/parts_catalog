const BASE_URL = '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function fetchParts({ search = '', inStockOnly = false, page = 1, pageSize = 24 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (inStockOnly) params.set('in_stock_only', 'true');
  params.set('page', String(page));
  params.set('page_size', String(pageSize));
  return request(`/parts?${params.toString()}`);
}

export function fetchPartById(id) {
  return request(`/parts/${id}`);
}

export function fetchBrands() {
  return request('/brands');
}

export function fetchSyncStatus() {
  return request('/sync/status');
}
