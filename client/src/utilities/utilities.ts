// Converts a normal string as found
// in a title or name to kebab case
export function toKebabCase (string: string) {
  // Trim leading and trailing whitespaces
  const trimmedString = string.trim();

  // Replace non-alphanumeric characters with hyphens,
  // then insert hyphen between lowercase and uppercase letters,
  // then convert to lowercase
  const kebabCaseString = trimmedString
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();

  // Return the converted string
  return kebabCaseString;
}