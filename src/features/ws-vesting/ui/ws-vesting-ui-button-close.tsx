import { WsVestingAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useWsVestingCloseMutation } from '@/features/ws-vesting/data-access/use-ws-vesting-close-mutation'

export function WsVestingUiButtonClose({ account, ws-vesting }: { account: UiWalletAccount; ws-vesting: WsVestingAccount }) {
  const closeMutation = useWsVestingCloseMutation({ account, ws-vesting })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
