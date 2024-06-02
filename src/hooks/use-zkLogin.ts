import { useChat } from '@/provider/chat-provider'
import SUI_CLIENT from '@/services/sui-client'
import { OpenIdProvider } from '@/types/AccountData'
import {
  clearSetupData,
  formattedAddress,
  keypairFromSecretKey,
  loadAccountZKLogin,
  loadSetupData,
  saveAccountZKLogin,
  saveSetupData,
} from '@/utils'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { generateNonce, generateRandomness, getExtendedEphemeralPublicKey, jwtToAddress } from '@mysten/zklogin'
import { jwtDecode } from 'jwt-decode'
import { Dispatch, SetStateAction } from 'react'
import config from '../../config.json'

type CompleteZkLoginType = {
  setAccountAddress: Dispatch<SetStateAction<string>>
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  setIsShowBlank: Dispatch<SetStateAction<boolean>>
}

const useZkLogin = () => {
  const { saveHistoryChat } = useChat()
  async function beginZkLogin(provider: OpenIdProvider) {
    const { epoch } = await SUI_CLIENT.getLatestSuiSystemState()

    const maxEpoch = Number(epoch) + 2
    const ephemeralKeyPair = new Ed25519Keypair()
    const randomness = generateRandomness()
    const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness)

    saveSetupData({
      provider,
      maxEpoch,
      randomness: randomness.toString(),
      ephemeralPrivateKey: ephemeralKeyPair.getSecretKey(),
    })

    const urlParamsBase = {
      nonce: nonce,
      redirect_uri: window.location.origin,
      response_type: 'id_token',
      scope: 'openid',
    }
    let loginUrl: string

    switch (provider) {
      case 'Google': {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,

          client_id: process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE || '',
        })

        loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams.toString()}`
        break
      }
      case 'Twitch': {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID_TWITCH || '',
          force_verify: 'true',
          lang: 'en',
          login_type: 'login',
        })
        loginUrl = `https://id.twitch.tv/oauth2/authorize?${urlParams.toString()}`
        break
      }
    }
    saveHistoryChat()
    window.location.replace(loginUrl!)
  }

  async function completeZkLogin({ setAccountAddress, setIsAuthenticated, setIsShowBlank }: CompleteZkLoginType) {
    const account = loadAccountZKLogin()

    const urlFragment = window.location.hash.substring(1)
    const urlParams = new URLSearchParams(urlFragment)
    const jwt = urlParams.get('id_token')
    if (!jwt) {
      return
    }
    const jwtPayload = jwtDecode(jwt)
    if (!jwtPayload.sub || !jwtPayload.aud) {
      return
    }

    window.history.replaceState(null, '', window.location.pathname)

    const requestOptions =
      config.URL_SALT_SERVICE === '/dummy-salt-service.json'
        ? {
            method: 'GET',
          }
        : {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jwt }),
          }

    const saltResponse: { salt: string } | null = await fetch(config.URL_SALT_SERVICE, requestOptions)
      .then((res) => {
        return res.json()
      })
      .catch((error: unknown) => {
        return null
      })

    if (!saltResponse) {
      return
    }

    const userSalt = BigInt(saltResponse.salt)

    const userAddr = jwtToAddress(jwt, userSalt)

    const setupData = loadSetupData()
    if (!setupData) {
      return
    }
    clearSetupData()

    if (account && userAddr === account.userAddr) {
      setAccountAddress(formattedAddress(userAddr))
      setIsAuthenticated(true)
      return
    }

    const ephemeralKeyPair = keypairFromSecretKey(setupData.ephemeralPrivateKey)
    const ephemeralPublicKey = ephemeralKeyPair.getPublicKey()
    const payload = JSON.stringify(
      {
        maxEpoch: setupData.maxEpoch,
        jwtRandomness: setupData.randomness,
        extendedEphemeralPublicKey: getExtendedEphemeralPublicKey(ephemeralPublicKey),
        jwt,
        salt: userSalt.toString(),
        keyClaimName: 'sub',
      },
      null,
      2
    )

    const zkProofs = await fetch(config.URL_ZK_PROVER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
      .then((res) => {
        return res.json()
      })
      .catch((error: unknown) => {
        return null
      })

    if (!zkProofs) {
      return
    }
    localStorage.setItem('loginStatus', 'success')

    saveAccountZKLogin({
      provider: setupData.provider,
      userAddr,
      zkProofs,
      ephemeralPrivateKey: setupData.ephemeralPrivateKey,
      userSalt: userSalt.toString(),
      sub: jwtPayload.sub,
      aud: typeof jwtPayload.aud === 'string' ? jwtPayload.aud : jwtPayload.aud[0],
      maxEpoch: setupData.maxEpoch,
    })

    setIsAuthenticated(true)
    setAccountAddress(formattedAddress(userAddr))
  }

  return {
    beginZkLogin,
    completeZkLogin,
  }
}

export default useZkLogin
