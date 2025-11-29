/**
 * Sentence Builder Service
 * 
 * This service handles building sentences from multiple text inputs.
 * It can combine text from different columns or static text with dynamic values.
 */

export const buildSentence = (parts, separator = " ") => {
  if (!parts || !Array.isArray(parts)) {
    return "";
  }

  // Filter out empty/null/undefined parts and trim whitespace
  const validParts = parts
    .filter(part => part != null && part !== "")
    .map(part => String(part).trim())
    .filter(part => part.length > 0);

  return validParts.join(separator);
};

export const buildSentenceWithTemplate = (template, values) => {
  if (!template || typeof template !== "string") {
    return "";
  }

  // Replace placeholders in the format {key} with values
  let result = template;
  if (values && typeof values === "object") {
    Object.keys(values).forEach(key => {
      const value = values[key] != null ? String(values[key]) : "";
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    });
  }

  return result;
};

export const extractTextFromColumnValue = (columnValue) => {
  if (!columnValue) {
    return "";
  }

  // Column values from monday.com API are often JSON strings
  try {
    const parsed = typeof columnValue === "string" ? JSON.parse(columnValue) : columnValue;
    
    // Handle different column types
    if (typeof parsed === "string") {
      return parsed;
    }
    
    if (parsed && typeof parsed === "object") {
      // For text columns, the value might be in a 'text' property
      if (parsed.text) {
        return parsed.text;
      }
      // For other column types, try common properties
      if (parsed.value) {
        return parsed.value;
      }
      if (parsed.label) {
        return parsed.label;
      }
    }
    
    return String(columnValue);
  } catch (e) {
    // If parsing fails, return as string
    return String(columnValue);
  }
};

