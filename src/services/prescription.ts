const API_BASE_URL = 'http://localhost:3001/api';

export interface Prescription {
    id: string;
    uploadDate: string; // or Date
    doctorName?: string;
    hospitalName?: string;
    medicines: string[];
    dosages: string[];
    status: 'analyzed' | 'pending' | 'warning';
    safetyScore: number;
    imageUrl?: string;
    confidence: number;
    warnings: string[];
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const prescriptionService = {
    getAll: async (): Promise<Prescription[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/prescriptions`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch prescriptions');
            }

            const data = await response.json();
            // Map backend data to frontend interface if needed
            return data.map((p: any) => ({
                id: p.id,
                uploadDate: p.created_at || new Date().toISOString(),
                doctorName: p.doctorName || 'Unknown Doctor',
                hospitalName: 'Unknown Hospital', // Backend doesn't support this yet
                medicines: p.medicines || [],
                dosages: p.dosages || [],
                status: p.status || 'analyzed',
                safetyScore: p.safetyScore || 0,
                imageUrl: p.imageUrl,
                confidence: p.confidence || 0,
                warnings: p.warnings || []
            }));
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            // Return empty array instead of throwing to avoid crashing UI
            return [];
        }
    }
};
