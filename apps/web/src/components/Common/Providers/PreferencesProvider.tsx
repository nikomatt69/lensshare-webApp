import { BASE_URL } from '@lensshare/data/constants';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { isAddress } from 'viem';

const PreferencesProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setVerifiedMembers = useAppStore((state) => state.setVerifiedMembers);
  const setIsPride = usePreferencesStore((state) => state.setIsPride);
  const setHighSignalNotificationFilter = usePreferencesStore(
    (state) => state.setHighSignalNotificationFilter
  );
  const setLoadingPreferences = usePreferencesStore(
    (state) => state.setLoadingPreferences
  );

  const fetchPreferences = async () => {
    try {
      if (
        Boolean(currentSessionProfileId) &&
        !isAddress(currentSessionProfileId)
      ) {
        const response = await axios.get(
          `${BASE_URL}/api/preference/getPreferences`,
          { params: { id: currentSessionProfileId } }
        );
        const { data } = response;

        setIsPride(data.result?.is_pride || false);
        setHighSignalNotificationFilter(
          data.result?.high_signal_notification_filter || false
        );
      }
    } catch {
    } finally {
      setLoadingPreferences(false);
    }
  };

  useQuery({
    queryKey: ['fetchPreferences', currentSessionProfileId || ''],
    queryFn: fetchPreferences
  });

  const fetchVerifiedMembers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/feature/getVerified`);
      const { data } = response;
      setVerifiedMembers(data.result || []);
    } catch {}
  };

  useQuery({
    queryKey: ['fetchVerifiedMembers'],
    queryFn: fetchVerifiedMembers
  });

  return null;
};

export default PreferencesProvider;
