/**
 * SYNTHOS Token Reward System
 * Sends real SYNTR tokens (BEP-20) to user wallets on BSC Mainnet
 * Uses raw RPC calls + ethers.js — no viem, no testnet
 */

const ADMIN_PRIVATE_KEY = process.env.REWARD_WALLET_PRIVATE_KEY
const TOKEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
const BSC_RPC_URL = process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org'

console.log('🔧 SYNTR Reward Gateway Configuration:')
console.log('- Admin Key:', ADMIN_PRIVATE_KEY ? '✅ Present' : '❌ Missing')
console.log('- Token Address:', TOKEN_CONTRACT_ADDRESS ? '✅ Present' : '❌ Missing')

// ERC-20 transfer function selector: transfer(address,uint256)
const TRANSFER_FUNCTION_SIGNATURE = '0xa9059cbb'

// ─── Direct RPC call helper ────────────────────────────────────────────────────
async function directRPCCall(method, params = []) {
    const response = await fetch(BSC_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method,
            params,
            id: Date.now()
        })
    })

    const data = await response.json()
    if (data.error) throw new Error(`RPC error: ${data.error.message}`)
    return data.result
}

// ─── Encode BEP-20 transfer calldata manually ─────────────────────────────────
function createTransferData(recipientAddress, tokenAmountWei) {
    const cleanAddress = recipientAddress.replace('0x', '').toLowerCase()
    const paddedAddress = cleanAddress.padStart(64, '0')
    const amountHex = BigInt(tokenAmountWei).toString(16)
    const paddedAmount = amountHex.padStart(64, '0')
    return TRANSFER_FUNCTION_SIGNATURE + paddedAddress + paddedAmount
}

/**
 * Send SYNTR tokens to a user wallet on BSC Mainnet
 * @param {string} toAddress - Recipient wallet address
 * @param {number} amount - Human-readable token amount (e.g. 10)
 * @returns {{ success: boolean, txHash?: string, error?: string, blockNumber?: number }}
 */
export async function sendSYNTRReward(toAddress, amount) {
    if (!ADMIN_PRIVATE_KEY || !TOKEN_CONTRACT_ADDRESS) {
        console.warn('⚠️ Reward wallet or contract not configured — skipping transfer')
        return { success: false, error: 'Reward wallet not configured' }
    }

    try {
        // Dynamically import ethers (works in Next.js server context)
        const ethers = await import('ethers')
        const ethersLib = ethers.default || ethers

        // Create admin wallet from private key
        const adminWallet = new ethersLib.Wallet(ADMIN_PRIVATE_KEY)

        // Prevent self-transfer
        if (toAddress.toLowerCase() === adminWallet.address.toLowerCase()) {
            return { success: false, error: 'Cannot send to admin wallet' }
        }

        // Validate address
        if (!ethersLib.isAddress(toAddress)) {
            return { success: false, error: 'Invalid recipient address' }
        }

        console.log(`💸 Sending ${amount} SYNTR to ${toAddress}`)
        console.log(`   Contract: ${TOKEN_CONTRACT_ADDRESS}`)
        console.log(`   From: ${adminWallet.address}`)

        // Test RPC connection
        const blockNumber = await directRPCCall('eth_blockNumber')
        console.log('✅ RPC connected, block:', parseInt(blockNumber, 16))

        // Get nonce and gas price in parallel
        const [adminNonce, gasPrice] = await Promise.all([
            directRPCCall('eth_getTransactionCount', [adminWallet.address, 'pending']),
            directRPCCall('eth_gasPrice')
        ])

        // Add 20% buffer to gas price for faster inclusion
        const bufferedGasPrice = Math.floor(parseInt(gasPrice, 16) * 1.2)

        // Convert amount to wei (18 decimals)
        const tokenAmountWei = ethersLib.parseUnits(amount.toString(), 18)
        console.log('💰 Token amount (wei):', tokenAmountWei.toString())

        // Build raw transaction
        const rawTransaction = {
            nonce: adminNonce,
            gasPrice: '0x' + bufferedGasPrice.toString(16),
            gasLimit: '0x186A0', // 100,000 gas — enough for BEP-20 transfer
            to: TOKEN_CONTRACT_ADDRESS,
            value: '0x0',
            data: createTransferData(toAddress, tokenAmountWei.toString()),
            chainId: 56 // BSC Mainnet
        }

        // Sign and broadcast
        const signedTx = await adminWallet.signTransaction(rawTransaction)
        const txHash = await directRPCCall('eth_sendRawTransaction', [signedTx])
        console.log('📤 Transaction sent:', txHash)

        // Poll for receipt (max 30s)
        let receipt = null
        let attempts = 0

        while (!receipt && attempts < 30) {
            try {
                receipt = await directRPCCall('eth_getTransactionReceipt', [txHash])
                if (receipt) break
            } catch {
                // Receipt not ready yet
            }
            attempts++
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        // Return pending if no receipt after 30s
        if (!receipt) {
            console.warn('⏳ No receipt after 30s — returning pending')
            return {
                success: true,
                txHash,
                status: 'pending',
                explorer: `https://bscscan.com/tx/${txHash}`
            }
        }

        // Check on-chain status
        const txStatus = parseInt(receipt.status, 16)
        if (txStatus !== 1) {
            console.error('❌ Transaction reverted on-chain')
            return {
                success: false,
                error: 'Transaction reverted on blockchain',
                txHash,
                explorer: `https://bscscan.com/tx/${txHash}`
            }
        }

        console.log('🎉 SYNTR TRANSFER CONFIRMED!')
        console.log(`✅ Sent ${amount} SYNTR → ${toAddress}`)
        console.log(`✅ TX: ${txHash}`)

        return {
            success: true,
            txHash,
            blockNumber: parseInt(receipt.blockNumber, 16),
            gasUsed: parseInt(receipt.gasUsed, 16),
            explorer: `https://bscscan.com/tx/${txHash}`
        }

    } catch (error) {
        console.error('❌ SYNTR transfer error:', error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Health check — returns admin wallet address and current block
 */
export async function getRewardWalletInfo() {
    try {
        const ethers = await import('ethers')
        const ethersLib = ethers.default || ethers
        const adminWallet = new ethersLib.Wallet(ADMIN_PRIVATE_KEY)
        const blockNumber = await directRPCCall('eth_blockNumber')

        return {
            status: 'healthy',
            adminWallet: adminWallet.address,
            tokenContract: TOKEN_CONTRACT_ADDRESS,
            tokenSymbol: 'SYNTR',
            network: 'Binance Smart Chain (Mainnet)',
            chainId: 56,
            blockNumber: parseInt(blockNumber, 16),
            rpcUrl: BSC_RPC_URL
        }
    } catch (error) {
        return { status: 'unhealthy', error: error.message }
    }
}
