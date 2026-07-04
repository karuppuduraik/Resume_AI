const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (method, path, body = null, headers = {}) => {
  const token = localStorage.getItem('token');
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  
  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers: finalHeaders,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${method} ${path}:`, error);
    throw error;
  }
};

const api = {
  get: (path, headers) => request('GET', path, null, headers),
  post: (path, body, headers) => request('POST', path, body, headers),
  put: (path, body, headers) => request('PUT', path, body, headers),
  delete: (path, headers) => request('DELETE', path, null, headers),
};

export default api;
