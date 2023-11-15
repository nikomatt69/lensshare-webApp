import getAvatar from '@lensshare/lib/getAvatar';
import formatAddress from '@lensshare/lib/formatAddress';

import getStampFyiURL from '@lensshare/lib/getStampFyiURL';
import type { Profile } from '@lensshare/lens';
import sanitizeDisplayName from '@lensshare/lib/sanitizeDisplayName';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import { ContentTypeText } from '@xmtp/xmtp-js';

import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import type { RemoteAttachment } from 'xmtp-content-type-remote-attachment';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';

import { Image } from '@lensshare/ui/src/Image';
import formatTime from 'src/hooks/formatTime';
import { getTimeFromNow } from 'src/hooks/formatTime4';
import cn from '@lensshare/ui/cn';

interface PreviewProps {
  ensName?: string;
  profile?: Profile;
  message?: DecodedMessage;
  conversationKey: string;
  isSelected: boolean;
}

interface MessagePreviewProps {
  message: DecodedMessage;
}

const MessagePreview: FC<MessagePreviewProps> = ({ message }) => {
  if (message.contentType.sameAs(ContentTypeText)) {
    return <span>{message.content}</span>;
  } else if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
    const remoteAttachment: RemoteAttachment = message.content;
    return <span>{remoteAttachment.filename}</span>;
  } else {
    return <span>''</span>;
  }
};

const Preview: FC<PreviewProps> = ({
  ensName,
  profile,
  message,
  conversationKey,
  isSelected
}) => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const address = currentProfile?.id.handle.ownedBy;

  const onConversationSelected = (profile: string) => {
    router.push(profile ? `/messages/${conversationKey}` : '/messages');
  };

  const url = (ensName && getStampFyiURL(conversationKey?.split('/')[0])) ?? '';

  return (
    message?.content && (
      <div
        className={cn(
          'cursor-pointer py-3 hover:bg-gray-100 dark:hover:bg-blue-100',
          isSelected && 'bg-gray-50 dark:bg-gray-800'
        )}
        onClick={() =>
          onConversationSelected(profile ? profile.id : conversationKey)
        }
        aria-hidden="true"
      >
        <div className="flex space-x-3 overflow-hidden px-5">
          <Image
            src={ensName ? url : getAvatar(profile)}
            loading="lazy"
            className="h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
            height={40}
            width={40}
          />
          <div className="grow overflow-hidden">
            <div className="flex justify-between space-x-1">
              <div className="flex items-center gap-1 overflow-hidden">
                <div className="text-md truncate">
                  {profile?.id.name
                    ? sanitizeDisplayName(profile?.id.handle?.localName) ?? profile?.id.handle?.localName
                    : ensName ?? formatAddress(conversationKey?.split('/')[0])}
                </div>
              </div>
              {message?.sent && (
                <span
                  className="lt-text-gray-500 shrink-0 pt-0.5 text-xs"
                  title={formatTime(message.sent)}
                >
                  {getTimeFromNow(message.sent)}
                </span>
              )}
            </div>
            <span className="lt-text-gray-500 line-clamp-1 break-all text-sm">
              {address === message?.senderAddress && 'You: '}
              <MessagePreview message={message} />
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default Preview;
