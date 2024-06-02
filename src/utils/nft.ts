import suiClient from '@/services/sui-client'
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet'
import path from 'path'
import { loadAccountZKLogin } from '.'

export const getOwnedObject = async (address: string) => {
  try {
    const objectData = await suiClient.getOwnedObjects({
      owner: address,
      options: {
        showBcs: true,
        showContent: true,
        showDisplay: true,
        showOwner: true,
        showPreviousTransaction: true,
        showStorageRebate: true,
        showType: true,
      },
      cursor: null,
      limit: null,
    })
    return objectData
  } catch (error) {
    return null
  }
}

export const getImageInformation = async (url: string) => {
  try {
    const response = await fetch(url)

    const buffer = await response.arrayBuffer()

    const filename = path.basename(url)

    const size = Buffer.byteLength(Buffer.from(buffer))
    const sizeInKB = size / 1024

    const lastModifiedHeader = response.headers.get('Last-Modified')
    const dateTimeCreated = lastModifiedHeader ? new Date(lastModifiedHeader).toISOString() : new Date().toISOString()

    return {
      filename,
      size: sizeInKB.toFixed(0) + 'KB',
      // createAt: sizeInKB.toFixed(0) + 'KB' + '-' + dateTimeCreated,
      createAt: dateTimeCreated,
    }
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}

export const setFaucet = async () => {
  const account = loadAccountZKLogin()
  if (account) {
    await requestSuiFromFaucetV0({
      host: getFaucetHost('devnet'),
      recipient: account.userAddr,
    })
  }
}
