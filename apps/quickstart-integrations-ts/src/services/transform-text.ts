export default function transformText(value: string, type: string) {
  switch (type) {
    case "TO_UPPER_CASE":
      return value.toUpperCase();
    case "TO_LOWER_CASE":
      return value.toLowerCase();
    default:
      return value.toUpperCase();
  }
}
