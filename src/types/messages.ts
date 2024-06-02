export type IMessage = {
  chatId: string
  avatar: string
  name: string
  message: string
  subMessage?: string
  options: string[]
  activeOption: number
  type?: string
  images?: string[]
  voice?: number[]
  image?: string
  index?: number
}

export type DataResponseType = {
  chatId: string
  message: string
  voice: {
    type: string
    data: number[]
  }
  metadata: {
    options?: string[]
    prompt?: string[]
    message?: string
    images?: string[]
    index?: number
    image?: string
    voice: {
      type: string
      data: number[]
    }
  }
  type: string
}
