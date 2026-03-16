import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('bio_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const memberAPI = {
  getAll: (p) => api.get('/members', { params: p }),
  getOne: (id) => api.get(`/members/${id}`),
  create: (d)  => api.post('/members', d),
  update: (id,d)=>api.put(`/members/${id}`, d),
  delete: (id) => api.delete(`/members/${id}`),
};

export const masterAPI = {
  districts: {
    getAll: ()       => api.get('/districts'),
    create: (d)      => api.post('/districts', d),
    update: (id,d)   => api.put(`/districts/${id}`, d),
    delete: (id)     => api.delete(`/districts/${id}`),
  },
  unions: {
    getAll: (p)      => api.get('/unions', { params: p }),
    create: (d)      => api.post('/unions', d),
    update: (id,d)   => api.put(`/unions/${id}`, d),
    delete: (id)     => api.delete(`/unions/${id}`),
  },
  assemblies: {
    getAll: (p)      => api.get('/assemblies', { params: p }),
    create: (d)      => api.post('/assemblies', d),
    update: (id,d)   => api.put(`/assemblies/${id}`, d),
    delete: (id)     => api.delete(`/assemblies/${id}`),
  },
  areas: {
    getAll: (p)      => api.get('/areas', { params: p }),
    create: (d)      => api.post('/areas', d),
    update: (id,d)   => api.put(`/areas/${id}`, d),
    delete: (id)     => api.delete(`/areas/${id}`),
  },
  administrations: {
    getAll: (p)      => api.get('/administrations', { params: p }),
    create: (d)      => api.post('/administrations', d),
    update: (id,d)   => api.put(`/administrations/${id}`, d),
    delete: (id)     => api.delete(`/administrations/${id}`),
  },
  positions: {
    getAll: ()       => api.get('/positions'),
    create: (d)      => api.post('/positions', d),
    update: (id,d)   => api.put(`/positions/${id}`, d),
    delete: (id)     => api.delete(`/positions/${id}`),
  },
};

export const reportAPI = {
  biography: (p) => api.get('/reports/biography', { params: p }),
  category:  (p) => api.get('/reports/category',  { params: p }),
  stats:     ()  => api.get('/reports/stats'),
};

export default api;
