/**
 * Safely parses a JSON string, preventing crashes by returning a fallback value if parsing fails.
 * Useful for handling AI-generated responses that might contain code blocks or trailing commas.
 * 
 * @param {string} jsonString - The string to parse.
 * @param {*} fallback - The fallback value if parsing fails (defaults to null).
 * @returns {*} The parsed JSON object or the fallback value.
 */
export function safeJsonParse(jsonString, fallback = null) {
  if (typeof jsonString !== 'string') {
    return fallback;
  }

  const trimmed = jsonString.trim();
  
  // Attempt to clean markdown code blocks if the AI wrapped the JSON in ```json ... ```
  let cleanedString = trimmed;
  if (trimmed.startsWith('```')) {
    const lines = trimmed.split('\n');
    // Remove the first line (like ```json or ```) and the last line (```)
    if (lines.length > 2) {
      const startIndex = lines[0].includes('json') ? 1 : 0;
      const endIndex = lines[lines.length - 1].startsWith('```') ? lines.length - 1 : lines.length;
      cleanedString = lines.slice(startIndex, endIndex).join('\n').trim();
    }
  }

  try {
    return JSON.parse(cleanedString);
  } catch (error) {
    console.error('safeJsonParse: JSON parsing failed:', error.message);
    
    // Attempt some basic recovery for typical AI formatting issues (like trailing commas)
    try {
      // Remove trailing commas before closing braces/brackets
      const regexCleaned = cleanedString
        .replace(/,\s*([}\]])/g, '$1')
        // Replace unescaped newlines inside strings (common in AI outputs)
        .replace(/\n/g, '\\n');
      return JSON.parse(regexCleaned);
    } catch (secondError) {
      console.error('safeJsonParse: Recovery attempt failed:', secondError.message);
      return fallback;
    }
  }
}
