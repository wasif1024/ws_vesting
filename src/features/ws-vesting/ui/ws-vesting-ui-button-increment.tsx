import { WsVestingAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useWsVestingIncrementMutation } from '../data-access/use-ws-vesting-increment-mutation'

export function WsVestingUiButtonIncrement({ account, ws-vesting }: { account: UiWalletAccount; ws-vesting: WsVestingAccount }) {
  const incrementMutation = useWsVestingIncrementMutation({ account, ws-vesting })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}
