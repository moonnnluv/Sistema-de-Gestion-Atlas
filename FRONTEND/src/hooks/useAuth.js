import { useContext } from 'react'
import { AuthContext } from '../context/authContextInstance'

export function useAuth() {
  return useContext(AuthContext)
}


