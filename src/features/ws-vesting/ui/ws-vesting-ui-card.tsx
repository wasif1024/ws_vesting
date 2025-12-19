import { WsVestingAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { WsVestingUiButtonClose } from './ws-vesting-ui-button-close'
import { WsVestingUiButtonDecrement } from './ws-vesting-ui-button-decrement'
import { WsVestingUiButtonIncrement } from './ws-vesting-ui-button-increment'
import { WsVestingUiButtonSet } from './ws-vesting-ui-button-set'

export function WsVestingUiCard({ account, ws-vesting }: { account: UiWalletAccount; ws-vesting: WsVestingAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>WsVesting: {ws-vesting.data.count}</CardTitle>
        <CardDescription>
          Account: <AppExplorerLink address={ws-vesting.address} label={ellipsify(ws-vesting.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <WsVestingUiButtonIncrement account={account} ws-vesting={ws-vesting} />
          <WsVestingUiButtonSet account={account} ws-vesting={ws-vesting} />
          <WsVestingUiButtonDecrement account={account} ws-vesting={ws-vesting} />
          <WsVestingUiButtonClose account={account} ws-vesting={ws-vesting} />
        </div>
      </CardContent>
    </Card>
  )
}
