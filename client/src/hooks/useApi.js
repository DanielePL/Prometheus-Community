// React hooks for API data management
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Hook for managing API requests with loading and error states
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for posts data
export const usePosts = (page = 1, limit = 20, type = null) => {
  return useApi(() => apiService.getPosts(page, limit, type), [page, limit, type]);
};

// Hook for events data
export const useEvents = (page = 1, limit = 20, type = null) => {
  return useApi(() => apiService.getEvents(page, limit, type), [page, limit, type]);
};

// Hook for feed data (combined posts and events)
export const useFeed = (page = 1, limit = 20) => {
  return useApi(() => apiService.getFeedData(page, limit), [page, limit]);
};

// Hook for user data
export const useUsers = (page = 1, limit = 20) => {
  return useApi(() => apiService.getUsers(page, limit), [page, limit]);
};

// Hook for current user
export const useCurrentUser = () => {
  return useApi(() => apiService.getCurrentUser(), []);
};

// Hook for managing async operations (create, update, delete)
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (operation) => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Operation Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Simple apiCall function for direct API calls
  const apiCall = useCallback(async (url, method = 'GET', data = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('prometheus_token')}`
        },
        body: data ? JSON.stringify(data) : null
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('API Call Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, apiCall, loading, error };
};

// Hook for post operations
export const usePostOperations = () => {
  const { execute, loading, error } = useAsyncOperation();

  const createPost = useCallback((postData) => {
    return execute(() => apiService.createPost(postData));
  }, [execute]);

  const updatePost = useCallback((postId, postData) => {
    return execute(() => apiService.updatePost(postId, postData));
  }, [execute]);

  const deletePost = useCallback((postId) => {
    return execute(() => apiService.deletePost(postId));
  }, [execute]);

  const likePost = useCallback((postId) => {
    return execute(() => apiService.likePost(postId));
  }, [execute]);

  const unlikePost = useCallback((postId) => {
    return execute(() => apiService.unlikePost(postId));
  }, [execute]);

  const addComment = useCallback((postId, content) => {
    return execute(() => apiService.addComment(postId, content));
  }, [execute]);

  return {
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    loading,
    error
  };
};

// Hook for event operations
export const useEventOperations = () => {
  const { execute, loading, error } = useAsyncOperation();

  const createEvent = useCallback((eventData) => {
    return execute(() => apiService.createEvent(eventData));
  }, [execute]);

  const updateEvent = useCallback((eventId, eventData) => {
    return execute(() => apiService.updateEvent(eventId, eventData));
  }, [execute]);

  const deleteEvent = useCallback((eventId) => {
    return execute(() => apiService.deleteEvent(eventId));
  }, [execute]);

  const joinEvent = useCallback((eventId) => {
    return execute(() => apiService.joinEvent(eventId));
  }, [execute]);

  const leaveEvent = useCallback((eventId) => {
    return execute(() => apiService.leaveEvent(eventId));
  }, [execute]);

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    loading,
    error
  };
};

// Hook for authentication operations
export const useAuthOperations = () => {
  const { execute, loading, error } = useAsyncOperation();

  const login = useCallback((email, password) => {
    return execute(() => apiService.login(email, password));
  }, [execute]);

  const register = useCallback((userData) => {
    return execute(() => apiService.register(userData));
  }, [execute]);

  const logout = useCallback(() => {
    return execute(() => apiService.logout());
  }, [execute]);

  return {
    login,
    register,
    logout,
    loading,
    error
  };
};

// Hook for search functionality
export const useSearch = () => {
  const [results, setResults] = useState({ users: [], posts: [], events: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setResults({ users: [], posts: [], events: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [usersResult, postsResult, eventsResult] = await Promise.all([
        apiService.searchUsers(query),
        apiService.searchPosts(query),
        apiService.searchEvents(query)
      ]);

      setResults({
        users: usersResult.data || [],
        posts: postsResult.data || [],
        events: eventsResult.data || []
      });
    } catch (err) {
      setError(err.message || 'Search failed');
      console.error('Search Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { search, results, loading, error };
};

// Hook for real-time data updates
export const useRealTimeData = (initialData, updateInterval = 30000) => {
  const [data, setData] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Trigger data refresh in components using this hook
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  const updateData = useCallback((newData) => {
    setData(newData);
    setLastUpdated(new Date());
  }, []);

  return { data, updateData, lastUpdated };
};

// Hook for pagination
export const usePagination = (initialPage = 1, initialLimit = 20) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = useCallback(() => setPage(prev => prev + 1), []);
  const prevPage = useCallback(() => setPage(prev => Math.max(1, prev - 1)), []);
  const goToPage = useCallback((pageNumber) => setPage(pageNumber), []);
  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  return {
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit
  };
};
