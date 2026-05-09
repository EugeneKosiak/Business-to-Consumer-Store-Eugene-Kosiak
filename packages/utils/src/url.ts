export function toUrlPath(path: string) {
  // replace all non alphanumerics characters with hyphen
  // then replace all sequential hyphens with single hyphen
  // then remove leading and trailing hyphens
  
  const normalised = path
  // convert to lowercase
  .toLowerCase()
  // replace all non-alphanumeric characters with hyphen
  .replace(/[^a-zA-Z0-9]/g, "-")
  // replace multiple hyphens with a single hyphen
  .replace(/-+/g, "-")
  // remove leading and trailing hyphens
  .replace(/^-|-$/g, "")
  
  return normalised;
}
