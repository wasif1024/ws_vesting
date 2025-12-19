import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { WsVestingUiButtonInitialize } from './ui/ws-vesting-ui-button-initialize'
import { WsVestingUiList } from './ui/ws-vesting-ui-list'
import { WsVestingUiProgramExplorerLink } from './ui/ws-vesting-ui-program-explorer-link'
import { WsVestingUiProgramGuard } from './ui/ws-vesting-ui-program-guard'

export default function WsVestingFeature() {
  const { account } = useSolana()

  return (
    <WsVestingUiProgramGuard>
      <AppHero
        title="WsVesting"
        subtitle={
          account
            ? "Initialize a new ws-vesting onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <WsVestingUiProgramExplorerLink />
        </p>
        {account ? (
          <WsVestingUiButtonInitialize account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <WsVestingUiList account={account} /> : null}
    </WsVestingUiProgramGuard>
  )
}
