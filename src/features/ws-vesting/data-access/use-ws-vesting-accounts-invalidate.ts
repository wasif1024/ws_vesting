import { useQueryClient } from '@tanstack/react-query'
import { useWsVestingAccountsQueryKey } from './use-ws-vesting-accounts-query-key'

export function useWsVestingAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useWsVestingAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}
