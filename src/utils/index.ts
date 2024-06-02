import { AccountData, SetupData } from '@/types/AccountData'
import { DataResponseType } from '@/types/messages'
import { decodeSuiPrivateKey } from '@mysten/sui.js/cryptography'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { Dispatch, SetStateAction } from 'react'
import config from '../../config.json'

export const speakAudio = (url: number[], setIsEnableMic?: Dispatch<SetStateAction<boolean>>): HTMLAudioElement => {
  const audioBlob = new Blob([new Uint8Array(url)], { type: 'audio/mpeg' })
  const audioUrl = URL.createObjectURL(audioBlob)
  const audio = new Audio(audioUrl)

  audio.src = audioUrl
  audio.play()
  audio.onended = function () {
    if (setIsEnableMic) setIsEnableMic(true)
  }
  return audio
}

export const keypairFromSecretKey = (privateKeyBase64: string): Ed25519Keypair => {
  const keyPair = decodeSuiPrivateKey(privateKeyBase64)
  return Ed25519Keypair.fromSecretKey(keyPair.secretKey)
}

export const loadSetupData = (): SetupData | null => {
  const dataRaw = localStorage.getItem(config.SETUP_DATA_KEY)
  if (!dataRaw) {
    return null
  }
  const data: SetupData = JSON.parse(dataRaw)
  return data
}

export const saveSetupData = (data: SetupData) => {
  localStorage.setItem(config.SETUP_DATA_KEY, JSON.stringify(data))
}

export const clearSetupData = (): void => {
  localStorage.removeItem(config.SETUP_DATA_KEY)
}

export const saveAccountZKLogin = (account: AccountData): void => {
  localStorage.setItem(config.ACCOUNT_DATA_KEY, JSON.stringify(account))
}

export const loadAccountZKLogin = () => {
  if (typeof localStorage === 'undefined') {
    return null
  }
  const dataRaw = localStorage.getItem(config.ACCOUNT_DATA_KEY)
  if (!dataRaw) {
    return null
  }
  const data: AccountData = JSON.parse(dataRaw)
  return data
}

export const formattedAddress = (userAddr: string) => {
  return userAddr.slice(0, 5) + '...' + userAddr.slice(-5)
}

export const formatDataResponse = (data: DataResponseType) => {
  return {
    chatId: data.chatId,
    name: 'Artify',
    avatar: '/images/chat/artify-avatar.svg',
    message: data.message,
    type: data.type,
    options:
      data.metadata?.options && data.metadata?.options.length > 0 && data.type !== 'image'
        ? data.metadata?.options
        : data.type === 'image' && data.metadata?.images
          ? []
          : [],
    activeOption: -1,
    images: data.metadata?.images && data.metadata?.images.length > 0 ? data.metadata?.images : [],
    image: data.metadata?.index && data.metadata?.image ? data.metadata?.image : '',
    subMessage: data.metadata?.message || '',
    voice: data.type === 'image' && data.metadata?.images ? data.metadata?.voice.data : [],
    index: data.metadata?.index || -1,
  }
}
