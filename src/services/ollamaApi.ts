// Backend API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    images?: string[];
}

export interface AnalysisResult {
    medicines: string[];
    dosages: string[];
    confidence: number;
    warnings?: string[];
    safetyScore?: number;
}

export interface InteractionResult {
    interactions: Array<{
        drugA: string;
        drugB: string;
        severity: 'minor' | 'moderate' | 'severe';
        description: string;
        management: string;
    }>;
    safetyScore: number;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// Analyze prescription image using backend API
export async function analyzePrescriptionImage(imageBase64: string): Promise<AnalysisResult> {
    try {
        const response = await fetch(`${API_BASE_URL}/analyze-prescription`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ imageBase64 }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Analysis failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Prescription analysis error:', error);
        throw error;
    }
}

// Check drug interactions using backend API
export async function checkDrugInteractions(medicines: string[]): Promise<InteractionResult> {
    try {
        const response = await fetch(`${API_BASE_URL}/check-interactions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ medicines }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Interaction check failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Drug interaction check error:', error);
        throw error;
    }
}

// AI Health Assistant Chat using backend API
export async function healthAssistantChat(
    message: string,
    conversationHistory: ChatMessage[] = []
): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/health-assistant`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                message,
                conversationHistory: conversationHistory.map(m => ({
                    role: m.role,
                    content: m.content
                }))
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Chat failed');
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Health assistant error:', error);
        throw error;
    }
}

// General chat with backend API
export async function chatWithBackend(messages: ChatMessage[]): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Chat failed');
        }

        const data = await response.json();
        return data.message?.content || '';
    } catch (error) {
        console.error('Chat error:', error);
        throw error;
    }
}

// Health check for backend
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}

// Verify medicine authenticity
export interface VerificationResult {
    isLikelyAuthentic: boolean;
    confidence: number;
    riskLevel: 'high' | 'medium' | 'low';
    issues: string[];
    analysis: string;
}

export async function verifyMedicine(imageBase64: string): Promise<VerificationResult> {
    try {
        const response = await fetch(`${API_BASE_URL}/verify-medicine`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ imageBase64 }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Verification failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Verification error:', error);
        throw error;
    }
}

// Get interaction history
export async function getInteractionHistory(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/interactions`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
}
