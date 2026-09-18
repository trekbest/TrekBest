// TrekBest Client API Service Layer
// Communicates with Node.js Express backend (proxied via Vite or port 4000)

const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Packages
  getPackages: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.category && filters.category !== 'ALL') query.append('category', filters.category);
    if (filters.search) query.append('search', filters.search);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return handleResponse(await fetch(`${API_BASE}/packages${qs}`));
  },

  getPackageById: async (id) => {
    return handleResponse(await fetch(`${API_BASE}/packages/${id}`));
  },

  createPackage: async (data) => {
    return handleResponse(await fetch(`${API_BASE}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }));
  },

  updatePackage: async (id, data) => {
    return handleResponse(await fetch(`${API_BASE}/packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }));
  },

  deletePackage: async (id) => {
    return handleResponse(await fetch(`${API_BASE}/packages/${id}`, {
      method: 'DELETE'
    }));
  },

  // Bookings
  getBookings: async () => {
    return handleResponse(await fetch(`${API_BASE}/bookings`));
  },

  createBooking: async (data) => {
    return handleResponse(await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }));
  },

  updateBookingStatus: async (id, status) => {
    return handleResponse(await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }));
  },

  deleteBooking: async (id) => {
    return handleResponse(await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE'
    }));
  },

  // Invoices
  getInvoices: async () => {
    return handleResponse(await fetch(`${API_BASE}/invoices`));
  },

  getInvoiceById: async (id) => {
    return handleResponse(await fetch(`${API_BASE}/invoices/${id}`));
  },

  createInvoice: async (data) => {
    return handleResponse(await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }));
  },

  updateInvoice: async (id, data) => {
    return handleResponse(await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }));
  },

  deleteInvoice: async (id) => {
    return handleResponse(await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'DELETE'
    }));
  },

  sendInvoiceEmail: async (id) => {
    return handleResponse(await fetch(`${API_BASE}/invoices/${id}/email`, {
      method: 'POST'
    }));
  },

  // Stats
  getStats: async () => {
    return handleResponse(await fetch(`${API_BASE}/stats`));
  },

  // Contact
  getMessages: async () => {
    return handleResponse(await fetch(`${API_BASE}/contact`));
  },

  sendMessage: async (data) => {
    return handleResponse(await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }));
  },

  // Reviews
  getReviews: async () => {
    return handleResponse(await fetch(`${API_BASE}/reviews`));
  },

  createReview: async (data) => {
    return handleResponse(await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }));
  }
};
