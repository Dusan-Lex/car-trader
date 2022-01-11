export const getAsString = (
  s: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(s)) {
    return s[0];
  }
  return s;
};
