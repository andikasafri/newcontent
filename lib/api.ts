// Add this function to the existing api.ts file
export async function getStats() {
  try {
    const res = await fetch(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  } catch (error) {
    // Return fallback data if the API call fails
    return {
      revenue: 0,
      customers: 0,
      orders: 0,
      conversionRate: 0,
      revenueData: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        revenue: 0
      })).reverse()
    };
  }
}