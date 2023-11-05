import getAvatar from '@lensshare/lib/getAvatar';
import getStampFyiURL from '@lensshare/lib/getStampFyiURL';
import formatAddress from '@lensshare/lib/formatAddress';

import useSendMessage from 'src/hooks/useSendMessage';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Profile } from '@lensshare/lens';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useMessageStore } from 'src/store/message';

import { Image } from '@lensshare/ui/src/Image';
import UserProfile from '@components/Shared/UserProfile';
import Follow from '@components/Shared/Profile/Follow';
import Unfollow from '@components/Shared/Profile/Unfollow';

interface MessageHeaderProps {
  profile?: Profile;
  conversationKey?: string;
}

const MessageHeader: FC<MessageHeaderProps> = ({
  profile,
  conversationKey
}) => {
  const router = useRouter();
  const [following, setFollowing] = useState(true);
  const unsyncProfile = useMessageStore((state) => state.unsyncProfile);
  const ensNames = useMessageStore((state) => state.ensNames);
  const ensName = ensNames.get(conversationKey?.split('/')[0] ?? '');
  const url =
    (ensName && getStampFyiURL(conversationKey?.split('/')[0] ?? '')) ?? '';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sendMessage } = useSendMessage(conversationKey ?? '');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [show, setShow] = useState(false);

  const setFollowingWrapped = useCallback(
    (following: boolean) => {
      setFollowing(following);
      unsyncProfile(profile?.id ?? '');
    },
    [setFollowing, unsyncProfile, profile?.id]
  );

  const onBackClick = () => {
    router.push('/messages');
  };

  useEffect(() => {
    setFollowing(profile?.id?.followNftAddress ?? false);
  }, [profile?.id?.followNftAddress]);

  if (!profile && !conversationKey) {
    return null;
  }

  return (
    <div className="divider flex items-center justify-between rounded-xl  border border-blue-700 px-4 py-2">
      <div className="flex items-center">
        <ChevronLeftIcon
          onClick={onBackClick}
          className="mr-1 h-6 w-6 cursor-pointer text-blue-700 lg:hidden"
        />
        {profile?.id ? (
          <UserProfile profile={profile} />
        ) : (
          <>
            <Image
              src={ensName ? url : getAvatar(profile)}
              loading="lazy"
              className="mr-4 h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              width={40}
            />
            {ensName ?? formatAddress(conversationKey ?? '')}
          </>
        )}
      </div>
      {!following ? (
        <Follow
          profile={profile as Profile}
          setFollowing={setFollowingWrapped}
        />
      ) : (
        <Unfollow
          profile={profile as Profile}
          setFollowing={setFollowingWrapped}
        />
      )}
    </div>
  );
};
export default MessageHeader;
