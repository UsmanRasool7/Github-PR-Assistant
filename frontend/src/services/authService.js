// src/services/authService.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
    this.isProcessingCallback = false;
  }

  // Initialize auth from localStorage
  init() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (e) {
          localStorage.removeItem('user_data');
        }
      }
    }
  }

  // Start GitHub OAuth flow
  loginWithGitHub() {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`; // Frontend callback
    const scope = 'read:user user:email repo';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    
    window.location.href = githubAuthUrl;
  }

  // Handle OAuth callback
  async handleOAuthCallback(code) {
    // Prevent concurrent callback processing
    if (this.isProcessingCallback) {
      console.log('OAuth callback already in progress, skipping duplicate request');
      throw new Error('OAuth callback already in progress');
    }

    try {
      this.isProcessingCallback = true;
      console.log('AuthService: Handling OAuth callback with code:', code?.substring(0, 10) + '...');
      const url = `${API_BASE_URL}/api/auth/github/callback?code=${code}`;
      console.log('AuthService: Making request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('AuthService: OAuth callback response status:', response.status);
      console.log('AuthService: OAuth callback response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AuthService: OAuth callback error response:', errorText);
        throw new Error(`OAuth callback failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('AuthService: OAuth callback success, received data:', {
        hasToken: !!data.access_token,
        hasUser: !!data.user,
        tokenType: data.token_type
      });
      
      if (!data.access_token || !data.user) {
        throw new Error('Invalid response from OAuth callback - missing token or user data');
      }
      
      this.setAuthData(data.access_token, data.user);
      return data;
    } catch (error) {
      console.error('AuthService: OAuth callback error:', error);
      throw error;
    } finally {
      this.isProcessingCallback = false;
    }
  }

  // Set authentication data
  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  // Get current user
  async getCurrentUser() {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error('Failed to get current user');
      }

      const user = await response.json();
      this.user = user;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Logout
  logout() {
    this.token = null;
    this.user = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get auth headers for API requests
  getAuthHeaders() {
    if (!this.token) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${this.token}`,
    };
  }

  // Get user data
  getUser() {
    return this.user;
  }

  // Get token
  getToken() {
    return this.token;
  }
}

// Create singleton instance
const authService = new AuthService();

// Initialize immediately if we're in the browser
if (typeof window !== 'undefined') {
  authService.init();
}

export default authService;
