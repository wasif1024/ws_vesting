import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getWsVestingProgramAccounts } from '@project/anchor'
import { useWsVestingAccountsQueryKey } from './use-ws-vesting-accounts-query-key'

export function useWsVestingAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useWsVestingAccountsQueryKey(),
    queryFn: async () => await getWsVestingProgramAccounts(client.rpc),
  })
}
