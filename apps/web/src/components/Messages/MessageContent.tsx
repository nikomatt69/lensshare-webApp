import type { Profile } from '@lensshare/lens';
import type { DecodedMessage } from '@xmtp/xmtp-js';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import { ContentTypeRemoteAttachment } from 'xmtp-content-type-remote-attachment';

import RemoteAttachmentPreview from './RemoteAttachmentPreview';
import {
  isQueuedMessage,
  type FailedMessage,
  type PendingMessage
} from 'src/hooks/useSendOptimisticMessage';
import Markup from '@components/Shared/Markup';

interface MessageContentProps {
  message: DecodedMessage | PendingMessage | FailedMessage;
  profile: Profile | undefined;
  sentByMe: boolean;
  preview?: ReactNode;
}

const MessageContent: FC<MessageContentProps> = ({
  message,
  profile,
  sentByMe
}) => {
  const previewRef = useRef<ReactNode>();

  const hasQueuedMessagePreview = isQueuedMessage(message);

  // if message is pending, render a custom preview if available
  if (hasQueuedMessagePreview && message.render && !previewRef) {
    return previewRef;
  }

  if (message.contentType.sameAs(ContentTypeRemoteAttachment)) {
    return (
      <RemoteAttachmentPreview
        remoteAttachment={message.content}
        profile={profile}
        sentByMe={sentByMe}
        preview={previewRef.current}
      />
    );
  }

  const meetingUrlMatches = message.content.match(/(https?:\/\/.*)/);
  const meetingLink = meetingUrlMatches ? meetingUrlMatches[0] : null;

  return meetingLink ? (
    <div>
      <Markup>{message.content}</Markup>
    </div>
  ) : (
    <Markup>{message.content}</Markup>
  );
};

export default MessageContent;
