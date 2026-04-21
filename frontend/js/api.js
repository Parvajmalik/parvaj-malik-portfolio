// api.js — Backend API client (all fetch calls go through here)

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
export const API_BASE = isLocalhost
  ? 'http://localhost:8000'
  : 'https://api.ibngroup.in';

const SITE = 'parvajmalik'; 

async function request(method, path, body = null) {
  const token = localStorage.getItem('auth_token');
  const headers = { 
    'Content-Type': 'application/json', 
    Accept: 'application/json',
    'X-Site': SITE, 

  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body !== null) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const e = new Error(err.message || 'Request failed');
    e.status = res.status;
    e.errors = err.errors || {};
    throw e;
  }
  return res.json();
}

export const api = {
  // ── Auth
  login:  (email, password) => request('POST', '/auth/login', { email, password }),
  logout: ()                => request('POST', '/auth/logout'),
  me:     ()                => request('GET',  '/auth/me'),

  // ── Public
  getBlogs:    ()     => request('GET', '/blogs'),
  getBlog:     (slug) => request('GET', `/blogs/${slug}`),
  getProjects: ()     => request('GET', '/projects'),
  getProject:  (slug) => request('GET', `/projects/${slug}`),

  // ── Admin – Blogs
  adminGetBlogs:  ()         => request('GET',    '/admin/blogs'),
  createBlog:     (data)     => request('POST',   '/admin/blogs', data),
  updateBlog:     (id, data) => request('PUT',    `/admin/blogs/${id}`, data),
  deleteBlog:     (id)       => request('DELETE', `/admin/blogs/${id}`),

  // ── Admin – Projects
  adminGetProjects: ()         => request('GET',    '/admin/projects'),
  createProject:    (data)     => request('POST',   '/admin/projects', data),
  updateProject:    (id, data) => request('PUT',    `/admin/projects/${id}`, data),
  deleteProject:    (id)       => request('DELETE', `/admin/projects/${id}`),
};

// CKEditor image upload (multipart/form-data)
export async function uploadImage(file) {
  const token = localStorage.getItem('auth_token');
  const form = new FormData();
  form.append('upload', file);

  const res = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${token}`, 
      Accept: 'application/json',
      'X-Site': SITE,  
    },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Image upload failed');
  }
  return res.json(); // { url: "..." }
}
