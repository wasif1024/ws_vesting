import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  fetchWsVesting,
  getCloseInstruction,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('ws-vesting', () => {
  let payer: KeyPairSigner
  let ws-vesting: KeyPairSigner

  beforeAll(async () => {
    ws-vesting = await generateKeyPairSigner()
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('Initialize WsVesting', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getInitializeInstruction({ payer: payer, ws-vesting: ws-vesting })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSER
    const currentWsVesting = await fetchWsVesting(rpc, ws-vesting.address)
    expect(currentWsVesting.data.count).toEqual(0)
  })

  it('Increment WsVesting', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({
      ws-vesting: ws-vesting.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchWsVesting(rpc, ws-vesting.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Increment WsVesting Again', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({ ws-vesting: ws-vesting.address })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchWsVesting(rpc, ws-vesting.address)
    expect(currentCount.data.count).toEqual(2)
  })

  it('Decrement WsVesting', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getDecrementInstruction({
      ws-vesting: ws-vesting.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchWsVesting(rpc, ws-vesting.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Set ws-vesting value', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getSetInstruction({ ws-vesting: ws-vesting.address, value: 42 })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchWsVesting(rpc, ws-vesting.address)
    expect(currentCount.data.count).toEqual(42)
  })

  it('Set close the ws-vesting account', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getCloseInstruction({
      payer: payer,
      ws-vesting: ws-vesting.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    try {
      await fetchWsVesting(rpc, ws-vesting.address)
    } catch (e) {
      if (!isSolanaError(e)) {
        throw new Error(`Unexpected error: ${e}`)
      }
      expect(e.message).toEqual(`Account not found at address: ${ws-vesting.address}`)
    }
  })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}
