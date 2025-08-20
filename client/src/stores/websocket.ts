import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWebsocketStore = defineStore('websocket', () => {
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)

  function closeConnection() {
    if (socket.value) {
      socket.value.close()
      socket.value = null
      isConnected.value = false
    }
  }

  function connect(url: string) {
    if (socket.value) {
      closeConnection()
    }
    
    socket.value = new WebSocket(url)
    
    socket.value.onopen = () => {
      isConnected.value = true
    }
    
    socket.value.onclose = () => {
      isConnected.value = false
    }
    
    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
      isConnected.value = false
    }
  }

  return { 
    socket, 
    isConnected, 
    closeConnection, 
    connect 
  }
})