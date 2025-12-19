import { WsVestingAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useWsVestingSetMutation } from '@/features/ws-vesting/data-access/use-ws-vesting-set-mutation'

export function WsVestingUiButtonSet({ account, ws-vesting }: { account: UiWalletAccount; ws-vesting: WsVestingAccount }) {
  const setMutation = useWsVestingSetMutation({ account, ws-vesting })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', ws-vesting.data.count.toString() ?? '0')
        if (!value || parseInt(value) === ws-vesting.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}
