// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { WsVesting, WS_VESTING_DISCRIMINATOR, WS_VESTING_PROGRAM_ADDRESS, getWsVestingDecoder } from './client/js'
import WsVestingIDL from '../target/idl/ws-vesting.json'

export type WsVestingAccount = Account<WsVesting, string>

// Re-export the generated IDL and type
export { WsVestingIDL }

export * from './client/js'

export function getWsVestingProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getWsVestingDecoder(),
    filter: getBase58Decoder().decode(WS_VESTING_DISCRIMINATOR),
    programAddress: WS_VESTING_PROGRAM_ADDRESS,
  })
}
