import { useChat } from '@/provider/chat-provider'
import { useWrapper } from '@/provider/wrapper-provider'
import SUI_CLIENT from '@/services/sui-client'
import { keypairFromSecretKey } from '@/utils'
import { SerializedSignature } from '@mysten/sui.js/cryptography'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { genAddressSeed, getZkLoginSignature } from '@mysten/zklogin'
import { useWallet } from '@suiet/wallet-kit'
import { useCallback, useMemo, useState } from 'react'
type OpenIdProvider = 'Google' | 'Twitch' | 'Facebook'

type AccountData = {
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

type NFTParamsType = {
  account?: AccountData
  name: string
  description: string
  image: string
}

const artifyNft = new Map([
  [
    'sui:devnet',
    {
      contractAddress: '0x654f8457ef2c39b7978c6aa6e4ff277316cbf80023b45347bb3b8fd8bdb46751',
      chainName: 'Sui Devnet',
      id: 'sui:devnet',
    },
  ],
  // [
  //   'sui:testnet',
  //   {
  //     contractAddress: '0x94da855248247602756c7ab111cac9a0ba35831965c9d4b2cc968147d8cc1f7b',
  //     chainName: 'Sui Testnet',
  //     id: 'sui:testnet',
  //   },
  // ],
])

const useMint = () => {
  const wallet = useWallet()
  const contractModule = 'nft'
  const contractMethod = 'mint'
  const [balance, setBalance] = useState(0)

  const { setIsMinted } = useWrapper()
  const { setError, setIsError } = useChat()

  async function fetchBalances(account: AccountData) {
    const suiBalance = await SUI_CLIENT.getBalance({
      owner: account.userAddr,
      coinType: '0x2::sui::SUI',
    })

    setBalance(parseInt(suiBalance.totalBalance, 10) / 1_000_000_000)
  }

  const createMintNftTxnBlockZKLogin = useCallback(
    async (account: AccountData, name: string, description: string, image: string) => {
      if (account) {
        console.log('account', account)
        const txb = new TransactionBlock()
        txb.setSender(account.userAddr)
        txb.moveCall({
          target: `${artifyNft.get('sui:devnet')?.contractAddress}::${contractModule}::${contractMethod}`,
          arguments: [txb.pure(name || 'Minted NFT'), txb.pure(description || 'description'), txb.pure(image)],
        })
        const ephemeralKeyPair = keypairFromSecretKey(account.ephemeralPrivateKey)
        const { bytes, signature: userSignature } = await txb.sign({
          client: SUI_CLIENT,
          signer: ephemeralKeyPair,
        })

        const addressSeed = genAddressSeed(BigInt(account.userSalt), 'sub', account.sub, account.aud).toString()

        const zkLoginSignature: SerializedSignature = getZkLoginSignature({
          inputs: {
            ...account.zkProofs,
            addressSeed,
          },
          maxEpoch: account.maxEpoch,
          userSignature,
        })

        await SUI_CLIENT.executeTransactionBlock({
          transactionBlock: bytes,
          signature: zkLoginSignature,
          options: {
            showEffects: true,
          },
        })
          .then((result) => {
            console.log('[sendTransaction] executeTransactionBlock response:', result)
            setIsMinted(true)
            setIsError(false)
            setError('success')
            fetchBalances(account)
          })
          .catch((error: unknown) => {
            setError('Mint failed! Check your chain Id or balance in Sui wallet')
            setIsMinted(false)
            setIsError(true)
            return null
          })
        return txb
      }
    },
    [setError, setIsError, setIsMinted]
  )

  const createMintNftTxnBlockSUI = useCallback(
    async (name: string, description: string, image: string) => {
      try {
        const txb = new TransactionBlock()
        txb.moveCall({
          target: `${artifyNft.get(wallet.chain?.id || '')?.contractAddress}::${contractModule}::${contractMethod}`,
          arguments: [txb.pure(name), txb.pure(description), txb.pure(image)],
        })

        const res = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: txb,
        })

        console.log('executeMoveCall success', res)
        setIsMinted(true)
        setIsError(false)
        setError('success')
      } catch (e) {
        console.error('executeMoveCall failed', e)

        setError('Mint failed! Check balance in Sui wallet ')
        setIsMinted(false)
        setIsError(true)
      }
    },
    [wallet, setError, setIsError, setIsMinted]
  )

  const onMintZKLogin = useCallback(
    async ({ account, name, description, image }: NFTParamsType) => {
      if (account) {
        await createMintNftTxnBlockZKLogin(account, name, description, image)
      }
    },
    [createMintNftTxnBlockZKLogin]
  )

  const onMintWallet = useCallback(
    async ({ name, description, image }: NFTParamsType) => {
      if (!wallet.connected) return

      if (!name || !description || !image) {
        return
      }

      await createMintNftTxnBlockSUI(name, description, image)
    },
    [createMintNftTxnBlockSUI, wallet]
  )
  return useMemo(() => {
    return {
      onMintZKLogin,
      onMintWallet,
    }
  }, [onMintZKLogin, onMintWallet])
}

export default useMint
