/**
 * Sanitizes user input to prevent XSS attacks.
 * Removes any HTML/script tags while preserving safe text content.
 *
 * @param input - The user input string to sanitize
 * @returns Sanitized string safe for filtering and processing
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Simple sanitization - remove HTML tags and trim
  // This is safe for server-side rendering
  const sanitized = input.replace(/<[^>]*>/g, '');

  return sanitized.trim();
}

/**
 * Escapes HTML special characters to prevent XSS when rendering user input in HTML context.
 * Use this when displaying user-controlled content in the DOM.
 *
 * @param text - The text to escape
 * @returns HTML-escaped string safe to render
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Validates that input is a safe string before processing.
 * Useful as a gatekeeper before filtering operations.
 *
 * @param input - The input to validate
 * @returns true if input is a safe string, false otherwise
 */
export function isValidSearchInput(input: unknown): input is string {
  return typeof input === 'string' && input.length <= 1000;
}
