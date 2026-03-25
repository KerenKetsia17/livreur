import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
console.log('[API] baseURL=', baseURL)

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function handleApiError(error) {
  // Firebase errors and other non-Axios errors
  if (error && error.code && error.message) {
    return { message: error.message }
  }

  if (!error.response) {
    return { message: 'Impossible de contacter le serveur.' }
  }

  return { message: error.response.data?.message || error.message }
}
