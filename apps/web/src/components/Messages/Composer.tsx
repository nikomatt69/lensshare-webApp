/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ContentTypeId } from '@xmtp/xmtp-js';
import { ContentTypeText } from '@xmtp/xmtp-js';
import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { useMessagePersistStore } from 'src/store/message';
import { useUpdateEffect, useWindowSize } from 'usehooks-ts';
import type { Attachment as TAttachment } from 'xmtp-content-type-remote-attachment';

import Attachment from './AttachmentView';
import {
  ArrowRightIcon,
  PhotoIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Input } from '@lensshare/ui/src/Input';
import { Button } from '@lensshare/ui/src/Button';

import type {
  AllowedContent,
  SendMessageContent,
  SendMessageOptions
} from 'src/hooks/useSendOptimisticMessage';
import { MIN_WIDTH_DESKTOP } from '@lensshare/data/constants';

interface ComposerProps {
  sendMessage: <T extends AllowedContent = string>(
    content: SendMessageContent<T>,
    contentType: ContentTypeId,
    options?: SendMessageOptions
  ) => Promise<boolean>;
  conversationKey: string;
  disabledInput: boolean;
}

interface AttachmentPreviewProps {
  onDismiss: () => void;
  dismissDisabled: boolean;
  attachment: TAttachment;
}

const AttachmentPreview: FC<AttachmentPreviewProps> = ({
  onDismiss,
  dismissDisabled,
  attachment
}) => {
  return (
    <div className="relative ml-12 inline-block rounded pt-6">
      <button
        disabled={dismissDisabled}
        type="button"
        className="absolute top-2 rounded-full bg-gray-900 p-1.5 opacity-75"
        onClick={onDismiss}
      >
        <XCircleIcon className="h-4 w-4 text-white" />
      </button>
      <Attachment attachment={attachment} />
    </div>
  );
};

/**
 * This component is for displaying the attachment preview in the messages
 * list before it's uploaded and sent to the network. It matches how the
 * attachment is rendered when retrieved from the network.
 */
const AttachmentPreviewInline: FC<
  Pick<AttachmentPreviewProps, 'attachment'>
> = ({ attachment }) => {
  return (
    <div className="mt-1 space-y-1">
      <Attachment attachment={attachment} />
    </div>
  );
};

const Composer: FC<ComposerProps> = ({
  sendMessage,
  conversationKey,
  disabledInput
}) => {
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<TAttachment | null>(null);
  const { width } = useWindowSize();
  const unsentMessage = useMessagePersistStore((state) =>
    state.unsentMessages.get(conversationKey)
  );
  const setUnsentMessage = useMessagePersistStore(
    (state) => state.setUnsentMessage
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSendMessage = !disabledInput && (attachment || message.length > 0);

  const onDismiss = () => {
    setAttachment(null);

    const el = fileInputRef.current;
    if (el) {
      el.value = '';
    }
  };

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }
    setSending(true);

    // a `null` value indicates that a message won't be sent
    let sendAttachment: Promise<boolean | null> = Promise.resolve(null);
    let sendText: Promise<boolean | null> = Promise.resolve(null);

    if (message.length > 0) {
      sendText = sendMessage(message, ContentTypeText);
      setMessage('');
      setUnsentMessage(conversationKey, null);
    }

    const sentAttachment = await sendAttachment;

    if (sentAttachment !== null) {
      if (sentAttachment) {
      } else {
        toast.error(`Error sending attachment`);
      }
    }

    const sentText = await sendText;

    if (sentText !== null) {
      if (sentText) {
      } else {
        toast.error(`Error sending message`);
      }
    }

    setSending(false);
  };

  useUpdateEffect(() => {
    setMessage(unsentMessage ?? '');
    // only run this effect when the conversation changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  const onChangeCallback = (value: string) => {
    setUnsentMessage(conversationKey, value);
    setMessage(value);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const onAttachmentChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      const fileReader = new FileReader();
      fileReader.addEventListener('load', async function () {
        const data = fileReader.result;

        if (!(data instanceof ArrayBuffer)) {
          return;
        }

        const attachment: TAttachment = {
          filename: file.name,
          mimeType: file.type,
          data: new Uint8Array(data)
        };

        setAttachment(attachment);
      });

      fileReader.readAsArrayBuffer(file);
    } else {
      setAttachment(null);
    }
  };

  return (
    <div className="bg-brand-100/75 mb-16 rounded-xl border">
      {attachment && !sending ? (
        <AttachmentPreview
          onDismiss={onDismiss}
          dismissDisabled={!canSendMessage}
          attachment={attachment}
        />
      ) : null}
      <div className="flex space-x-4 p-4">
        <label className="flex cursor-pointer items-center">
          <PhotoIcon className="text-brand-900 h-6 w-5" />
          <input
            ref={fileInputRef}
            type="file"
            accept=".png, .jpg, .jpeg, .gif"
            className="hidden w-full"
            onChange={onAttachmentChange}
          />
        </label>

        <Input
          type="text"
          placeholder={`Type Something`}
          value={message}
          disabled={disabledInput}
          onKeyDown={handleKeyDown}
          onChange={(event) => onChangeCallback(event.target.value)}
        />
        <Button
          disabled={!canSendMessage}
          onClick={handleSend}
          variant="primary"
          aria-label="Send message"
        >
          <div className="flex items-center space-x-2">
            {Number(width) > MIN_WIDTH_DESKTOP ? <span>Send</span> : null}
            <ArrowRightIcon className="h-5 w-5" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Composer;
