const API_URL = 'http://localhost:3001/api/auth';

export const authService = {
    register: async (data: any) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                name: data.fullName,
                role: data.role
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        return response.json();
    },

    login: async (data: any) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        return response.json();
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    updateProfile: async (data: any) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Profile update failed');
        }

        const result = await response.json();
        if (result.user) {
            // Update local storage with fresh user data
            /* 
               Merge with existing just in case, but result.user from backend 
               should be the source of truth.
            */
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return result.user;
    },

    updatePassword: async (data: { currentPassword: string, newPassword: string }) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Password update failed');
        }

        return response.json();
    },

    refreshUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    return data.user;
                }
            }
        } catch (e) {
            console.error('Failed to refresh user', e);
        }
        return null;
    }
};
