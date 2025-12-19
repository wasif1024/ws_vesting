import { WsVestingAccount, getCloseInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useWsVestingAccountsInvalidate } from './use-ws-vesting-accounts-invalidate'

export function useWsVestingCloseMutation({ account, ws-vesting }: { account: UiWalletAccount; ws-vesting: WsVestingAccount }) {
  const invalidateAccounts = useWsVestingAccountsInvalidate()
  const signAndSend = useWalletUiSignAndSend()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, ws-vesting: ws-vesting.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
