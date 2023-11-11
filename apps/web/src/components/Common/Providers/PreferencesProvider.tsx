import { PREFERENCES_WORKER_URL } from '@lensshare/data/constants';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

const PreferencesProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setVerifiedMembers = useAppStore((state) => state.setVerifiedMembers);
  const {
    setIsStaff,
    setIsGardener,
    setStaffMode,
    setGardenerMode,
    setIsPride,
    setHighSignalNotificationFilter,
    setLoadingPreferences
  } = usePreferencesStore();

  const fetchPreferences = async () => {
    try {
      if (Boolean(currentSessionProfileId)) {
        const response = await axios.get(
          `${PREFERENCES_WORKER_URL}/get/${currentSessionProfileId}`
        );
        const { data } = response;

        setIsStaff(data.result?.is_staff || false);
        setIsGardener(data.result?.is_gardener || false);
        setStaffMode(data.result?.staff_mode || false);
        setGardenerMode(data.result?.gardener_mode || false);
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
      const response = await axios.get(`${PREFERENCES_WORKER_URL}/verified`);
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
