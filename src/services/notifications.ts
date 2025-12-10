const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export interface Notification {
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    is_read: boolean;
    created_at: string;
}

export const notificationService = {
    async getAll(): Promise<Notification[]> {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        return response.json();
    },

    async markAsRead(id: string | number): Promise<Notification> {
        const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to mark as read');
        return response.json();
    },

    async markAllAsRead(): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to mark all as read');
    },

    async delete(id: string | number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete notification');
    }
};
