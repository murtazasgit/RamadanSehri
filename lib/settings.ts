const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function getSetting(key: string): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/app_settings?key=eq.${encodeURIComponent(key)}`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      return data[0]?.value || null
    }
  } catch (err) {
    console.error('Error fetching setting:', err)
  }
  return null
}

export async function setSetting(key: string, value: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false
  
  try {
    // Try to update first
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/app_settings?key=eq.${encodeURIComponent(key)}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ 
          value,
          updated_at: new Date().toISOString()
        })
      }
    )
    
    // If no rows updated (404), insert new
    if (updateResponse.status === 200) {
      const data = await updateResponse.json()
      if (data && data.length > 0) {
        return true
      }
    }
    
    // Insert new record
    const insertResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/app_settings`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ key, value })
      }
    )
    
    return insertResponse.ok
  } catch (err) {
    console.error('Error setting value:', err)
  }
  return false
}
