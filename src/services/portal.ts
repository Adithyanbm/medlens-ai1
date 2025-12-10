const API_BASE_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const portalService = {
    // Shared / Doctor
    searchPatient: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/doctor/patient/search?email=${encodeURIComponent(email)}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Patient not found');
        return response.json();
    },

    getPatientPrescriptions: async (patientId: string) => {
        const response = await fetch(`${API_BASE_URL}/doctor/patient/${patientId}/prescriptions`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch prescriptions');
        return response.json();
    },

    // Doctor Specific
    addNote: async (prescriptionId: string, note: string) => {
        const response = await fetch(`${API_BASE_URL}/prescription/${prescriptionId}/note`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ note })
        });
        if (!response.ok) throw new Error('Failed to add note');
        return response.json();
    },

    // Pharmacist Specific
    getAllPrescriptions: async () => {
        const response = await fetch(`${API_BASE_URL}/pharmacist/prescriptions`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch prescriptions');
        return response.json();
    },

    dispensePrescription: async (prescriptionId: string) => {
        const response = await fetch(`${API_BASE_URL}/prescription/${prescriptionId}/dispense`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to dispense prescription');
        return response.json();
    }
};
