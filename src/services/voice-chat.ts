import axiosClient from './axios-client'

export const voiceChatService = {
  initChat: async () => {
    const response = await axiosClient.get('/api/v1/ai-chat/initial-chat')
    return response.data
  },
  communicate: async ({ chatId, message, level }: { chatId: string; message: string; level: number }) => {
    let endpoint = '/api/v1/ai-chat/newbie-chat/'
    if (level === 1) {
      endpoint = '/api/v1/ai-chat/expert-chat/'
    }
    const response = await axiosClient.post(endpoint + chatId, { message })
    return response.data
  },
}
