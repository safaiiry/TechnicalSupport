export const getItem = (key: string): string | null => {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key)
}

export const removeItem = (key: string) => {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}
