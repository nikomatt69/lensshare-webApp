/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Toaster } from 'react-hot-toast';

import type { FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useAccount, useDisconnect } from 'wagmi';
import { useCurrentProfileQuery } from '@lensshare/lens';
import type { Profile, AnyPublication } from '@lensshare/lens';

import Messages from '.';
import { useNonceStore } from 'src/store/useNonceStore';
import { hydrateAuthTokens, signOut } from 'src/store/useAuthPersistStore';
import Loading from '@components/Shared/Loading';
import { useEffectOnce, useIsMounted } from 'usehooks-ts';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { useTheme } from 'next-themes';


interface Props {
  publication: AnyPublication;
}

const MessagePage: FC<Props> = ({ publication }) => {
  const { resolvedTheme } = useTheme();
  const { setCurrentProfile } = useAppStore();
  const { loadingPreferences, resetPreferences } = usePreferencesStore();
  const { setLensHubOnchainSigNonce } = useNonceStore();

  const isMounted = useIsMounted();
  const { connector } = useAccount();
  const { disconnect } = useDisconnect();

  const currentSessionProfileId = getCurrentSessionProfileId();

  const logout = () => {
    resetPreferences();
    signOut();
    disconnect?.();
  };

  const { loading } = useCurrentProfileQuery({
    variables: { request: { forProfileId: currentSessionProfileId } },
    skip: !currentSessionProfileId,
    onCompleted: ({ profile, userSigNonces }) => {
      if (!profile) {
        return logout();
      }

      setCurrentProfile(profile as Profile);
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);
    }
  });

  useEffectOnce(() => {
    // Listen for switch account in wallet and logout
    connector?.addListener('change', () => logout());
  });

  const validateAuthentication = () => {
    const { accessToken } = hydrateAuthTokens();
    if (!accessToken) {
      logout();
    }
  };

  useEffectOnce(() => {
    validateAuthentication();
  });

  if (loading || !isMounted()) {
    return <Loading />;
  }
  return (
    <div>
      <div className="m-auto h-[100vh] overflow-hidden lg:w-[1100px] xl:w-[1200px]">
        <Toaster position="bottom-right" />
        <div className="flex gap-6">
          <div className="hidden h-[92vh] overflow-hidden lg:block lg:hover:overflow-auto" />
          <div className=" mt-4 h-full  flex-1 flex-col  items-center">
            <Messages />
          </div>
        </div>
        <div className="block md:hidden" />
      </div>
    </div>
  );
};

export default MessagePage;
