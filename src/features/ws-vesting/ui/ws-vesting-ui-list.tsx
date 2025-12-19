import { WsVestingUiCard } from './ws-vesting-ui-card'
import { useWsVestingAccountsQuery } from '@/features/ws-vesting/data-access/use-ws-vesting-accounts-query'
import { UiWalletAccount } from '@wallet-ui/react'

export function WsVestingUiList({ account }: { account: UiWalletAccount }) {
  const ws-vestingAccountsQuery = useWsVestingAccountsQuery()

  if (ws-vestingAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!ws-vestingAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {ws-vestingAccountsQuery.data?.map((ws-vesting) => (
        <WsVestingUiCard account={account} key={ws-vesting.address} ws-vesting={ws-vesting} />
      ))}
    </div>
  )
}
