import { Localstorage } from '@lensshare/data/storage';

import { Client } from '@xmtp/xmtp-js';
import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useMessageStore } from 'src/store/message';
import useEthersWalletClient from './useEthersWalletClient';
import { APP_NAME, APP_VERSION, XMTP_ENV } from '@lensshare/data/constants';

const ENCODING = 'binary';

const buildLocalStorageKey = (walletAddress: string) =>
  `xmtp:${XMTP_ENV}:keys:${walletAddress}`;

const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

/**
 * Anyone copying this code will want to be careful about leakage of sensitive keys.
 * Make sure that there are no third party services, such as bug reporting SDKs or ad networks, exporting the contents
 * of your LocalStorage before implementing something like this.
 */
const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  );
};

/**
 * This will clear the conversation cache + the private keys
 */
const wipeKeys = (walletAddress: string) => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

const useXmtpClient = (cacheOnly = false) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const client = useMessageStore((state) => state.client);
  const setClient = useMessageStore((state) => state.setClient);
  const [awaitingXmtpAuth, setAwaitingXmtpAuth] = useState<boolean>();
  const { data: signer, isLoading } = useEthersWalletClient();

  useEffect(() => {
    const initXmtpClient = async () => {
      if (signer && !client && currentProfile) {
        let keys = loadKeys(await signer.getAddress());
        if (!keys) {
          if (cacheOnly) {
            return;
          }
          setAwaitingXmtpAuth(true);
          keys = await Client.getKeys(signer, {
            env: XMTP_ENV,
            appVersion: APP_NAME + '/' + APP_VERSION,
            persistConversations: false,
            skipContactPublishing: true
          });
          storeKeys(await signer.getAddress(), keys);
        }

        const xmtp = await Client.create(null, {
          env: XMTP_ENV,
          appVersion: APP_NAME + '/' + APP_VERSION,
          privateKeyOverride: keys,
          persistConversations: true,
          codecs: []
        });

        setClient(xmtp);
        setAwaitingXmtpAuth(false);
      } else {
        setAwaitingXmtpAuth(false);
      }
    };
    initXmtpClient();
    if (!signer || !currentProfile) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return {
    client: client,
    loading: isLoading || awaitingXmtpAuth
  };
};

export const useDisconnectXmtp = () => {
  const { data: signer } = useEthersWalletClient();
  const client = useMessageStore((state) => state.client);
  const setClient = useMessageStore((state) => state.setClient);
  const disconnect = useCallback(async () => {
    if (signer) {
      wipeKeys(await signer.getAddress());
    }
    if (client) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setClient(undefined);
    }
    localStorage.removeItem(Localstorage.MessageStore);
    localStorage.removeItem(Localstorage.AttachmentCache);
    localStorage.removeItem(Localstorage.AttachmentStore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, client]);

  return disconnect;
};

export default useXmtpClient;
