import { ethers } from 'ethers'

import { address as MeowTokenAddress, abi as tokenAbi } from '../../../contract/abis//MeowToken.json'
import { abi as storageAbi, address as storageContractAddress } from '../../../contract/abis//Storage.json'
import { abi as forwarderAbi, address as MeowForwarderAddress } from '../../../contract/abis/MeowForwarder.json'

export const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io')

export const relayerPrivateKey = process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY || ''
export const relayer = new ethers.Wallet(relayerPrivateKey, provider)

// token 컨트랙트
export const tokenContract = new ethers.Contract(MeowTokenAddress, tokenAbi, relayer)
export const tokenAddress = MeowTokenAddress
// forwarder 컨트랙트
export const forwarderContract = new ethers.Contract(MeowForwarderAddress, forwarderAbi, relayer)
export const forwarderAddress = MeowForwarderAddress

// comments 컨트랙트
export const storageContract = new ethers.Contract(storageContractAddress, storageAbi, relayer)
export const storageAddress = storageContractAddress
