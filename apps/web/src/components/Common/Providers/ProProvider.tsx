
import { BASE_URL } from '@lensshare/data/constants';
import getCurrentSession from '@lib/getCurrentSession';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useProStore } from 'src/store/useProStore';
import { isAddress } from 'viem';

const ProProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setIsPro = useProStore((state) => state.setIsPro);
  const setLoadingPro = useProStore((state) => state.setLoadingPro);

  const fetchProEnabled = async () => {
    try {
      if (Boolean(currentSessionProfileId) && !isAddress(currentSessionProfileId)) {
        const response = await axios.get(`${BASE_URL}/api/pro/getProEnabled`, {
          params: { id: currentSessionProfileId }
        });
        const { data } = response;
        setIsPro(data?.enabled || false);
      }
    } catch {
    } finally {
      setLoadingPro(false);
    }
  };

  useQuery({
    queryKey: ['fetchProEnabled', currentSessionProfileId || ''],
    queryFn: fetchProEnabled
  });

  return null;
};

export default ProProvider;
