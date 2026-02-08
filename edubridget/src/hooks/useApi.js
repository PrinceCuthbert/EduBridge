import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for data fetching with loading and error states
 * @param {Function} apiFunc - API function to call
 * @param {*} params - Parameters to pass to API function
 * @param {Array} dependencies - Dependencies for useEffect
 */
export const useFetch = (apiFunc, params = null, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(params);
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunc, params, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for paginated data fetching
 */
export const usePaginatedFetch = (apiFunc, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc({
        ...params,
        page: pagination.page,
        limit: pagination.limit,
      });
      setData(result.data || result);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunc, params, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const updateParams = (newParams) => {
    setParams(newParams);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return {
    data,
    loading,
    error,
    pagination,
    goToPage,
    changeLimit,
    updateParams,
    refetch: fetchData,
  };
};

/**
 * Hook for debounced search
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for async actions (create, update, delete)
 */
export const useAsyncAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiFunc, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
