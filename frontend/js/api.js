// api.js — Backend API client (public routes only)

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
export const API_BASE = isLocalhost
  ? 'http://localhost:8000'
  : 'https://api.ibngroup.in';

async function request(method, path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  getBlogs:    ()     => request('GET', '/blogs'),
  getBlog:     (slug) => request('GET', `/blogs/${slug}`),
  getProjects: ()     => request('GET', '/projects'),
  getProject:  (slug) => request('GET', `/projects/${slug}`),
};
