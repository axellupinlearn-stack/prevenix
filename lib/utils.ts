import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateFr(dateString: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}

export function formatPhoneLink(phone: string): string {
  // Strip non-numeric characters except +
  return phone.replace(/[^\d+]/g, '')
}

export function getWhatsAppLink(phone: string, text?: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '')
  // If no country code, add 225 for Ivory Coast
  const fullPhone = cleanPhone.startsWith('225') ? cleanPhone : `225${cleanPhone}`
  const encodedText = text ? encodeURIComponent(text) : ''
  return `https://wa.me/${fullPhone}${encodedText ? `?text=${encodedText}` : ''}`
}
