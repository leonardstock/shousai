"use client";

import React from "react";
import { Copy } from "lucide-react";
import {
    HUMAN_READABLE_NAMES,
    MODEL_PRICING,
} from "@/models/types/supportedModels";

const ApiDocumentation = () => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const jsExample = `const response = await fetch('https://shousai.co.uk/api/v1/proxy', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        apiKey: 'your-shousai-api-key",',
        providerKey: 'your-provider-api-key',
        model: 'gpt-4',
        messages: [
            {
                role: 'user',
                content: 'Hello, how are you?'
            }
        ]
    })
});

const data = await response.json();`;

    const axiosExample = `const response = await axios.post('https://shousai.co.uk/api/v1/proxy', {
    apiKey: 'your-shousai-api-key",',
    providerKey: 'your-provider-api-key',
    model: 'gpt-4',
    messages: [
        {
            role: 'user',
            content: 'Hello, how are you?'
        }
    ]
});`;

    const pythonExample = `import requests

def make_ai_request(prompt: str):
    url = "https://shousai.co.uk/api/v1/proxy"
    
    payload = {
        "apiKey": "your-shousai-api-key",
        "providerKey": "your-provider-api-key",
        "model": "gpt-4",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    response = requests.post(url, json=payload)
    response.raise_for_status()  # Raises exception for 4XX/5XX status codes
    
    return response.json()

# Example usage
try:
    result = make_ai_request("What is the capital of France?")
    print(f"Response: {result['choices'][0]['message']['content']}")
    print(f"Cost: \${result["usage"]["estimated_cost"]}")
    print(f"Cached: {result['usage']['cached']}")
except requests.exceptions.RequestException as e:
    print(f"Error making request: {e}")`;

    const pythonAsyncExample = `import aiohttp
import asyncio

async def make_async_ai_request(prompt: str):
    url = "https://shousai.co.uk/api/v1/proxy"
    
    payload = {
        "apiKey": "your-shousai-api-key",
        "providerKey": "your-provider-api-key",
        "model": "claude-3-opus-20240229",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as response:
            if response.status >= 400:
                error_data = await response.json()
                raise Exception(f"API error: {error_data}")
            
            return await response.json()

# Example usage
async def main():
    try:
        result = await make_async_ai_request("What is the capital of France?")
        print(f"Response: {result['choices'][0]['message']['content']}")
        print(f"Cost: \${result["usage"]["estimated_cost"]}")
        print(f"Cached: {result['usage']['cached']}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(main())`;

    const pythonErrorExample = `import requests
from typing import Dict, Any

class AIProxyError(Exception):
    """Custom exception for AI Proxy errors"""
    pass

def make_ai_request_with_retry(prompt: str, max_retries: int = 3) -> Dict[str, Any]:
    """
    Make an AI request with retry logic and proper error handling
    """
    url = "https://shousai.co.uk/api/v1/proxy"
    
    payload = {
        "apiKey": "your-shousai-api-key",
        "providerKey": "your-provider-api-key",
        "model": "gpt-4",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    for attempt in range(max_retries):
        try:
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 401:
                raise AIProxyError("Invalid API key")
            elif response.status_code == 400:
                error_data = response.json()
                raise AIProxyError(f"Invalid request: {error_data['details']}")
            elif response.status_code >= 500:
                if attempt == max_retries - 1:
                    raise AIProxyError("Server error after max retries")
                continue  # Try again
                
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.Timeout:
            if attempt == max_retries - 1:
                raise AIProxyError("Request timed out after max retries")
        except requests.exceptions.RequestException as e:
            raise AIProxyError(f"Network error: {str(e)}")
            
    raise AIProxyError("Max retries exceeded")

# Example usage with error handling
try:
    result = make_ai_request_with_retry("What is the capital of France?")
    print(f"Response: {result['choices'][0]['message']['content']}")
    print(f"Cost: \${result["usage"]["estimated_cost"]}")
except AIProxyError as e:
    print(f"AI Proxy error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")`;

    const CodeBlock = ({
        code,
        language,
    }: {
        code: string;
        language: string;
    }) => (
        <div className='bg-white rounded-lg shadow-lg overflow-hidden mb-8'>
            <div className='flex items-center justify-between bg-gray-800 px-4 py-2'>
                <div className='flex space-x-2'>
                    <div className='w-3 h-3 rounded-full bg-red-500'></div>
                    <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
                    <div className='w-3 h-3 rounded-full bg-green-500'></div>
                </div>
                <div className='flex items-center space-x-4'>
                    <span className='text-gray-400'>{language}</span>
                    <button
                        onClick={() => copyToClipboard(code)}
                        className='text-gray-400 hover:text-white'>
                        <Copy className='w-4 h-4' />
                    </button>
                </div>
            </div>
            <div className='p-6 bg-gray-900'>
                <pre className='text-gray-300 overflow-x-auto'>
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );

    return (
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <h1 className='text-4xl font-bold text-gray-900 mb-8'>
                How to get started
            </h1>

            <section className='mb-12'>
                <p className='text-gray-600 mb-6'>
                    Our API proxy service helps you reduce costs and improve
                    response times for your AI API calls by implementing
                    intelligent caching. When you make identical requests, our
                    service returns cached responses instead of making new API
                    calls, saving you money and time.
                </p>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Features
                </h2>
                <ul className='list-disc list-inside text-gray-600 space-y-2'>
                    <li>Request caching for identical prompts</li>
                    <li>
                        Support for multiple AI providers (OpenAI and Anthropic)
                    </li>
                    <li>Automatic token counting and cost estimation</li>
                    <li>Usage logging and statistics</li>
                    <li>Transparent cache hit reporting</li>
                </ul>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Authentication
                </h2>
                <p className='text-gray-600 mb-4'>
                    To use the proxy service, you&apos;ll need:
                </p>
                <ul className='list-disc list-inside text-gray-600 space-y-2'>
                    <li>An API key from our service</li>
                    <li>Your provider API key (OpenAI or Anthropic)</li>
                </ul>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Making Requests
                </h2>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    Endpoint
                </h3>
                <CodeBlock code='POST /api/proxy' language='HTTP' />

                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    Request Format
                </h3>
                <CodeBlock
                    code={JSON.stringify(
                        {
                            apiKey: "your-shousai-api-key",
                            providerKey: "your-provider-api-key",
                            model: "model-name",
                            messages: [
                                {
                                    role: "user | assistant",
                                    content: "Your message here",
                                },
                            ],
                        },
                        null,
                        2
                    )}
                    language='JSON'
                />
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Supported Models
                </h2>
                <table className='table-auto border-collapse border border-gray-300 w-full'>
                    <thead>
                        <tr className='bg-gray-200'>
                            <th className='border border-gray-300 px-4 py-2'>
                                Model
                            </th>
                            <th className='border border-gray-300 px-4 py-2'>
                                {"model-name"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(MODEL_PRICING).map(([key]) => (
                            <tr key={key} className='hover:bg-gray-100'>
                                <td className='border border-gray-300 px-4 py-2'>
                                    {HUMAN_READABLE_NAMES[key]}
                                </td>
                                <td className='border border-gray-300 px-4 py-2'>
                                    {key}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Code Examples
                </h2>

                <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                    JavaScript Examples
                </h3>
                <h4 className='text-lg font-medium text-gray-900 mb-2'>
                    Using fetch
                </h4>
                <CodeBlock code={jsExample} language='JavaScript' />

                <h4 className='text-lg font-medium text-gray-900 mb-2'>
                    Using Axios
                </h4>
                <CodeBlock code={axiosExample} language='JavaScript' />

                <h3 className='text-xl font-semibold text-gray-900 mb-4 mt-8'>
                    Python Examples
                </h3>
                <h4 className='text-lg font-medium text-gray-900 mb-2'>
                    Using requests
                </h4>
                <CodeBlock code={pythonExample} language='Python' />

                <h4 className='text-lg font-medium text-gray-900 mb-2'>
                    Using aiohttp (Async)
                </h4>
                <CodeBlock code={pythonAsyncExample} language='Python' />

                <h4 className='text-lg font-medium text-gray-900 mb-2'>
                    Error Handling Example
                </h4>
                <CodeBlock code={pythonErrorExample} language='Python' />
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Error Handling
                </h2>
                <p className='text-gray-600 mb-4'>
                    The service returns standard HTTP status codes:
                </p>
                <ul className='list-disc list-inside text-gray-600 space-y-2'>
                    <li>200: Successful request</li>
                    <li>400: Invalid request data</li>
                    <li>401: Invalid API key or user not found</li>
                    <li>500: Internal server error</li>
                </ul>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Caching Behavior
                </h2>
                <ul className='list-disc list-inside text-gray-600 space-y-2'>
                    <li>
                        Responses are cached based on the exact match of
                        messages, model, and provider
                    </li>
                    <li>
                        Cache hits are indicated by cached: true in the response
                    </li>
                    <li>
                        Cached responses have zero cost (estimated_cost:
                        &quot;0.0000 (cached)&quot;)
                    </li>
                    <li>
                        Cache timeouts are set to 2000ms for reads and writes
                    </li>
                </ul>
            </section>

            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Best Practices
                </h2>
                <ul className='list-disc list-inside text-gray-600 space-y-2'>
                    <li>
                        Consistent Message Format: Keep message format
                        consistent to maximize cache hits
                    </li>
                    <li>
                        Error Handling: Implement proper error handling in your
                        application
                    </li>
                    <li>
                        Timeout Handling: Account for potential cache timeouts
                        in your implementation
                    </li>
                    <li>
                        Cost Monitoring: Track usage costs through the provided
                        metrics
                    </li>
                    <li>
                        API Key Security: Store your API keys securely and never
                        expose them in client-side code
                    </li>
                </ul>
            </section>

            <section>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Support
                </h2>
                <p className='text-gray-600'>
                    For additional support or questions, please contact our
                    support team or visit our documentation portal.
                </p>
            </section>
        </div>
    );
};

export default ApiDocumentation;
