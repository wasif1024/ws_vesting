import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useWsVestingInitializeMutation } from '@/features/ws-vesting/data-access/use-ws-vesting-initialize-mutation'

export function WsVestingUiButtonInitialize({ account }: { account: UiWalletAccount }) {
  const mutationInitialize = useWsVestingInitializeMutation({ account })

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize WsVesting {mutationInitialize.isPending && '...'}
    </Button>
  )
}
