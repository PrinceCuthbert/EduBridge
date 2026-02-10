import { MOCK_PROGRAMS, MOCK_LIBRARY_RESOURCES, MOCK_SCHOLARSHIPS, MOCK_BLOGS, MOCK_PARTNERS } from '../data/mockData';
import { BASE_URL } from '../config/api';

/**
 * Initializes the mock backend by overriding window.fetch.
 * This allows the application to use 'fetch' as if there were a real backend.
 */
export function initMockBackend() {
  const originalFetch = window.fetch;

  window.fetch = async (input, init) => {
    // Check if the request is to our API
    if (typeof input === 'string' && input.startsWith(BASE_URL)) {
      console.log(`[MockBackend] Intercepting request to: ${input}`);
      
      const url = new URL(input);
      const path = url.pathname.replace('/api', ''); // Adjust based on BASE_URL structure
      const method = init?.method || 'GET';

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));

      try {
        // --- Programs Routes ---
        if (path === '/programs' && method === 'GET') {
           return mockResponse(MOCK_PROGRAMS);
        }
        
        if (path.match(/\/programs\/\d+/) && method === 'GET') {
          const id = parseInt(path.split('/').pop());
          const program = MOCK_PROGRAMS.find(p => p.id === id);
          if (program) return mockResponse(program);
          return mockError(404, "Program not found");
        }

        // --- Library Routes ---
        if (path === '/library' && method === 'GET') {
          return mockResponse(MOCK_LIBRARY_RESOURCES);
        }

        // --- Application/Upload Routes (User Request Simulation) ---
        if (path === '/exams/upload' && method === 'POST') {
           // Simulate successful upload
           return mockResponse({ message: "Exam uploaded successfully", fileCount: 1 });
        }

        // --- Scholarship Routes ---
        if (path === '/scholarships' && method === 'GET') {
          return mockResponse(MOCK_SCHOLARSHIPS);
        }

        // --- Blog Routes ---
        if (path === '/blogs' && method === 'GET') {
          return mockResponse(MOCK_BLOGS);
        }
        
        if (path.match(/\/blogs\/\d+/) && method === 'GET') {
          const id = parseInt(path.split('/').pop());
          const blog = MOCK_BLOGS.find(b => b.id === id);
          if (blog) return mockResponse(blog);
          return mockError(404, "Blog post not found");
        }

        // --- Partner Routes ---
        if (path === '/partners' && method === 'GET') {
           return mockResponse(MOCK_PARTNERS);
        }
        
        // --- Fallback for unhandled API routes ---
        console.warn(`[MockBackend] Unhandled route: ${path}`);
        return mockError(404, "Route not found");

      } catch (error) {
        console.error('[MockBackend] Error processing request', error);
        return mockError(500, "Internal Server Error");
      }
    }

    // Pass through non-API requests (e.g., assets, other external APIs)
    return originalFetch(input, init);
  };
}

function mockResponse(data, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  }));
}

function mockError(status, message) {
  return Promise.resolve(new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  }));
}
