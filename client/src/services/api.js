// API service for Prometheus Community Dashboard
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('prometheus_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('prometheus_token', token);
    } else {
      localStorage.removeItem('prometheus_token');
    }
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log('Making API request:', { url, config });

    try {
      const response = await fetch(url, config);
      console.log('API response received:', { status: response.status, ok: response.ok });
      
      const data = await response.json();
      console.log('API response data:', data);

      if (!response.ok) {
        console.error('API response not ok:', data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    console.log('API Service login called with:', { email });
    console.log('Making request to:', `${this.baseURL}/api/auth/login`);
    
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    console.log('Login response received:', response);
    
    if (response.token) {
      console.log('Setting token:', response.token);
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User methods
  async getUsers(page = 1, limit = 20) {
    return this.request(`/users?page=${page}&limit=${limit}`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Post methods
  async getPosts(page = 1, limit = 20, type = null) {
    let endpoint = `/posts?page=${page}&limit=${limit}`;
    if (type) {
      endpoint += `&type=${type}`;
    }
    return this.request(endpoint);
  }

  async getPostById(postId) {
    return this.request(`/posts/${postId}`);
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(postId, postData) {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async likePost(postId) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async unlikePost(postId) {
    return this.request(`/posts/${postId}/unlike`, {
      method: 'DELETE',
    });
  }

  async addComment(postId, content) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Event methods
  async getEvents(page = 1, limit = 20, type = null) {
    let endpoint = `/events?page=${page}&limit=${limit}`;
    if (type) {
      endpoint += `&type=${type}`;
    }
    return this.request(endpoint);
  }

  async getEventById(eventId) {
    return this.request(`/events/${eventId}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(eventId, eventData) {
    return this.request(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(eventId) {
    return this.request(`/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  async joinEvent(eventId) {
    return this.request(`/events/${eventId}/join`, {
      method: 'POST',
    });
  }

  async leaveEvent(eventId) {
    return this.request(`/events/${eventId}/leave`, {
      method: 'DELETE',
    });
  }

  // Feed methods (combining posts and events)
  async getFeedData(page = 1, limit = 20) {
    const [postsResponse, eventsResponse] = await Promise.all([
      this.getPosts(page, Math.ceil(limit * 0.7)), // 70% posts
      this.getEvents(page, Math.ceil(limit * 0.3))  // 30% events
    ]);

    // Combine and sort by creation date
    const combinedFeed = [
      ...postsResponse.data.map(post => ({ ...post, feedType: 'post' })),
      ...eventsResponse.data.map(event => ({ ...event, feedType: 'event' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      data: combinedFeed.slice(0, limit),
      pagination: {
        page,
        limit,
        totalPosts: postsResponse.pagination?.total || 0,
        totalEvents: eventsResponse.pagination?.total || 0,
        total: (postsResponse.pagination?.total || 0) + (eventsResponse.pagination?.total || 0)
      }
    };
  }

  // Search methods
  async searchUsers(query, page = 1, limit = 10) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  async searchPosts(query, page = 1, limit = 10) {
    return this.request(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  async searchEvents(query, page = 1, limit = 10) {
    return this.request(`/events/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
