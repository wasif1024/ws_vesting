import { WsVestingAccount, getDecrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useWsVestingAccountsInvalidate } from './use-ws-vesting-accounts-invalidate'

export function useWsVestingDecrementMutation({
  account,
  ws-vesting,
}: {
  account: UiWalletAccount
  ws-vesting: WsVestingAccount
}) {
  const invalidateAccounts = useWsVestingAccountsInvalidate()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ ws-vesting: ws-vesting.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
