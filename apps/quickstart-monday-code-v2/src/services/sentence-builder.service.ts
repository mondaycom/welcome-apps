export const buildSentence = (parts: unknown[], separator = " "): string => {
  if (!parts || !Array.isArray(parts)) return "";

  const validParts = parts
    .filter((part) => part != null && part !== "")
    .map((part) => String(part).trim())
    .filter((part) => part.length > 0);

  return validParts.join(separator);
};

export const buildSentenceWithTemplate = (template: string, values: Record<string, unknown>): string => {
  if (!template || typeof template !== "string") return "";

  let result = template;
  if (values && typeof values === "object") {
    Object.keys(values).forEach((key) => {
      const value = values[key] != null ? String(values[key]) : "";
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    });
  }

  return result;
};

export const extractTextFromColumnValue = (columnValue: unknown): string => {
  if (!columnValue) return "";

  try {
    const parsed = typeof columnValue === "string" ? JSON.parse(columnValue) : columnValue;

    if (typeof parsed === "string") return parsed;

    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      if (obj.text) return String(obj.text);
      if (obj.value) return String(obj.value);
      if (obj.label) return String(obj.label);
    }

    return String(columnValue);
  } catch {
    return String(columnValue);
  }
};
