import { WS_VESTING_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function WsVestingUiProgramExplorerLink() {
  return <AppExplorerLink address={WS_VESTING_PROGRAM_ADDRESS} label={ellipsify(WS_VESTING_PROGRAM_ADDRESS)} />
}
