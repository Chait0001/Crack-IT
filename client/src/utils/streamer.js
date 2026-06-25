/**
 * streamer.js — Reads a Server-Sent Events stream from the backend
 * and calls onChunk(text) for each token, onDone() on completion.
 */
export const streamSSE = async (url, body, { onChunk, onDone, onError, signal } = {}) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'AI request failed' }));
      throw new Error(err.message || 'AI request failed');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') {
            onDone?.();
            return;
          }
          try {
            const { content } = JSON.parse(raw);
            if (content) onChunk?.(content);
          } catch {
            // ignore malformed lines
          }
        }
      }
    }

    onDone?.();
  } catch (err) {
    if (err.name === 'AbortError') return;
    onError?.(err);
  }
};

const BASE = import.meta.env.VITE_API_URL || '/api';

export const AI_ENDPOINTS = {
  bullet:   `${BASE}/ai/improve-bullet`,
  grammar:  `${BASE}/ai/fix-grammar`,
  summary:  `${BASE}/ai/generate-summary`,
  cover:    `${BASE}/ai/cover-letter`,
  tone:     `${BASE}/ai/adjust-tone`,
};
