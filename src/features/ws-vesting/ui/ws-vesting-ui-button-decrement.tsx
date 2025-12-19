import { WsVestingAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useWsVestingDecrementMutation } from '../data-access/use-ws-vesting-decrement-mutation'

export function WsVestingUiButtonDecrement({ account, ws-vesting }: { account: UiWalletAccount; ws-vesting: WsVestingAccount }) {
  const decrementMutation = useWsVestingDecrementMutation({ account, ws-vesting })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}
