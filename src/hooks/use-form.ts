"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"

export function useForm<T extends z.ZodType>(schema: T) {
  const [data, setData] = useState<Partial<z.infer<T>>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const register = (name: keyof z.infer<T>) => ({
    value: data[name] || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, [name]: e.target.value }))
      if (errors[name as string]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
  })

  const setValue = (name: keyof z.infer<T>, value: any) => {
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const watch = (name: keyof z.infer<T>) => data[name]

  const handleSubmit = (onSubmit: (data: z.infer<T>) => void) => (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const validatedData = schema.parse(data)
      setErrors({})
      onSubmit(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  const reset = () => {
    setData({})
    setErrors({})
  }

  return {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  }
}
