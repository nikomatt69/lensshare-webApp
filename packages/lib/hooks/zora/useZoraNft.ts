import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { NFT_WORKER_URL } from '@/constants';
import type { ZoraNft } from '@/types/nft';

interface UseZoraNftProps {
  chain: string;
  address: string;
  token: string;
  enabled?: boolean;
}

const useZoraNft = ({
  chain,
  address,
  token,
  enabled
}: UseZoraNftProps): {
  data: ZoraNft;
  loading: boolean;
  error: unknown;
} => {
  const loadZoraNftDetails = async () => {
    const response = await axios.get(`${NFT_WORKER_URL}/zora`, {
      params: { chain, address, token }
    });

    return response.data?.nft;
  };

  const { data, isLoading, error } = useQuery(
    ['loadZoraNftDetails', chain, address, token],
    () => loadZoraNftDetails().then((res) => res),
    { enabled }
  );

  return { data, loading: isLoading, error };
};

export default useZoraNft;
