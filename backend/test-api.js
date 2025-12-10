// Test script to check Ollama API connectivity
import fetch from 'node-fetch';

const OLLAMA_CONFIG = {
    baseUrl: 'https://ollama.com/api',
    model: 'qwen3-vl:235b-cloud',
    apiKey: 'ea2a43c01ede4553ac398bea55217ff7.Y1EFvbqOiN_HtpjPaGcHyIUu',
};

async function testOllamaAPI() {
    console.log('Testing Ollama API...');
    console.log('URL:', `${OLLAMA_CONFIG.baseUrl}/chat`);
    console.log('Model:', OLLAMA_CONFIG.model);
    console.log('---');

    try {
        const response = await fetch(`${OLLAMA_CONFIG.baseUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OLLAMA_CONFIG.apiKey}`,
            },
            body: JSON.stringify({
                model: OLLAMA_CONFIG.model,
                messages: [{ role: 'user', content: 'Hi' }],
                stream: false,
            }),
        });

        console.log('Response Status:', response.status);
        console.log('Response Status Text:', response.statusText);

        const text = await response.text();
        console.log('Response Body:', text.substring(0, 500));

        if (response.ok) {
            console.log('\n✅ API is working!');
        } else {
            console.log('\n❌ API returned error');
        }
    } catch (error) {
        console.log('\n❌ Request failed:', error.message);
    }
}

testOllamaAPI();
