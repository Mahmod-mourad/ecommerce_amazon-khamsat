"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import type { User } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "@/hooks/use-translations"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { t } = useTranslations()

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (!foundUser) {
        return false
      }

      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      toast({
        title: t("auth.loginSuccess"),
        description: t("auth.welcomeBack", { name: foundUser.name }),
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      if (users.some((u: any) => u.email === email)) {
        return false
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role: "user",
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      toast({
        title: t("auth.registerSuccess"),
        description: t("auth.accountCreated"),
      })

      return true
    } catch (error) {
      console.error("Register error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")

    toast({
      title: t("auth.logoutSuccess"),
      description: t("auth.loggedOut"),
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
