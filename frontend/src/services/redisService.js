export const fetchConnections = async () => {
  const response = await fetch('/api/connections');
  if (!response.ok) {
    throw new Error('Failed to fetch connections');
  }
  const data = await response.json();
  return data;
};
