import React from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
}

const colorMap = {
  success: 'bg-accent text-white',
  error: 'bg-error text-white',
  info: 'bg-primary text-white'
}

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map(notification => {
        const Icon = iconMap[notification.type]
        return (
          <div
            key={notification.id}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-card max-w-sm ${colorMap[notification.type]}`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 hover:opacity-80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}