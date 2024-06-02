export type OpenIdProvider = 'Google' | 'Twitch' | 'Facebook'

export type AccountData = {
  provider: OpenIdProvider
  userAddr: string
  zkProofs: {
    headerBase64: string
    issBase64Details: {
      value: string
      indexMod4: number
    }
    indexMod4: number
    value: string
    proofPoints: {
      a: string[]
      b: string[][]
      c: string[]
    }
  }
  ephemeralPrivateKey: string
  userSalt: string
  sub: string
  aud: string
  maxEpoch: number
}

export type SetupData = {
  provider: OpenIdProvider
  maxEpoch: number
  randomness: string
  ephemeralPrivateKey: string
}
