import { useSolana } from '@/components/solana/use-solana'

export function useWsVestingAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['ws-vesting', 'accounts', { cluster }]
}
