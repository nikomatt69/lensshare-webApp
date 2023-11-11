import Preview from '@components/Messages/Preview';

import type { Profile } from '@lensshare/lens';

import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useAppStore } from 'src/store/app';
import type { TabValues } from 'src/store/message';
import { useMessagePersistStore, useMessageStore } from 'src/store/message';
import { GridItemFour } from '@lensshare/ui/src/GridLayout';
import { Card } from '@lensshare/ui/src/Card';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import TabButton from '@lensshare/ui/src/TabButton';

import { Modal } from '@lensshare/ui/src/Modal';

import { ErrorMessage } from './ErrorMessage';
import { useMessageDb } from 'src/hooks/useMessageDb';
import useGetMessagePreviews from 'src/hooks/useGetMessagePreviews';
import useMessagePreviews from 'src/hooks/useMessagePreviews';
import cn from '@lensshare/ui/cn';
import { MessageTabs } from 'src/enums';
import { buildConversationKey } from 'src/hooks/conversationKey';
import buildConversationId from 'src/hooks/buildConversationId';
import { Errors } from '@lensshare/data/errors';
import Search from '@components/Shared/Navbar/Search';
import Loader from '@components/Shared/Loader';

interface PreviewListProps {
  className?: string;
  selectedConversationKey?: string;
}

const PreviewList: FC<PreviewListProps> = ({
  className,
  selectedConversationKey
}) => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { persistProfile } = useMessageDb();
  const selectedTab = useMessageStore((state) => state.selectedTab);
  const ensNames = useMessageStore((state) => state.ensNames);
  const setSelectedTab = useMessageStore((state) => state.setSelectedTab);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const {
    authenticating,
    loading,
    messages,
    profilesToShow,
    requestedCount,
    profilesError
  } = useMessagePreviews();

  const { loading: previewsLoading, progress: previewsProgress } =
    useGetMessagePreviews();
  const clearMessagesBadge = useMessagePersistStore(
    (state) => state.clearMessagesBadge
  );

  const sortedProfiles = Array.from(profilesToShow).sort(([keyA], [keyB]) => {
    const messageA = messages.get(keyA);
    const messageB = messages.get(keyB);
    return (messageA?.sent?.getTime() || 0) >= (messageB?.sent?.getTime() || 0)
      ? -1
      : 1;
  });

  useEffect(() => {
    if (!currentProfile) {
      return;
    }
    clearMessagesBadge(currentProfile.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  const showAuthenticating = currentProfile?.id && authenticating;
  const showLoading =
    loading && (messages.size === 0 || profilesToShow.size === 0);

  const newMessageClick = () => {
    setShowSearchModal(true);
  };

  const onProfileSelected = async (profile: Profile) => {
    const conversationId = buildConversationId(currentProfile?.id, profile.id);
    const conversationKey = buildConversationKey(profile.id, conversationId);
    await persistProfile(conversationKey, profile);
    const selectedTab: TabValues = profile.id.followNftaddress
      ? MessageTabs.Lens
      : MessageTabs.Requests;
    setSelectedTab(selectedTab);
    router.push(`/messages/${conversationKey}`);
    setShowSearchModal(false);
  };

  return (
    <GridItemFour
      className={cn(
        'xs:h-[100vh] xs:mx-2 xs:col-span-4 w-full justify-between rounded-xl sm:mx-2 sm:h-[76vh] md:h-[80vh] xl:h-[84vh]',
        className
      )}
    >
      <Card className="flex h-full flex-col justify-between rounded-xl">
        <div className="divider relative flex items-center justify-between p-5">
          <div className="font-bold">Messages</div>
          {currentProfile && !showAuthenticating && !showLoading && (
            <button onClick={newMessageClick} type="button">
              <PlusCircleIcon className="h-6 w-6" />
            </button>
          )}
          {previewsLoading && (
            <progress
              className="absolute -bottom-1 left-0 h-1 w-full appearance-none border-none bg-transparent"
              value={previewsProgress}
              max={100}
            />
          )}
        </div>
        <div className="flex justify-between px-4 py-3">
          <div className="flex space-x-2">
            <TabButton
              className="p-2 px-4 text-blue-500"
              name={'All'}
              active={selectedTab === 'All'}
              onClick={() => setSelectedTab('All')}
              showOnSm
              icon={undefined}
            />
            <TabButton
              className="p-2 px-4 text-blue-500"
              name={'Lens'}
              active={selectedTab === 'Lens'}
              onClick={() => setSelectedTab('Lens')}
              showOnSm
              icon={undefined}
            />
            <TabButton
              className="p-2 px-4 text-blue-500"
              name={'Other'}
              active={selectedTab === 'Other'}
              onClick={() => setSelectedTab('Other')}
              showOnSm
              icon={undefined}
            />
          </div>
          <TabButton
            className="p-2 px-4 text-blue-500"
            name={
              requestedCount > 99
                ? '99+'
                : `${requestedCount.toString()} Requests`
            }
            active={selectedTab === MessageTabs.Requests}
            onClick={() => setSelectedTab(MessageTabs.Requests)}
            showOnSm
            icon={undefined}
          />
        </div>
        {selectedTab === MessageTabs.Requests ? (
          <div className=" p-2 px-5 text-sm text-blue-700">
            These conversations are from Lens profiles that you dot currently
            follow.
          </div>
        ) : null}
        <div className="mb-10 h-full">
          {showAuthenticating ? (
            <div className=" items-center justify-center">
              <Loader message="Awaiting signature to enable DMs" />
            </div>
          ) : showLoading ? (
            <div className="flex   items-center justify-center">
              <Loader message={`Loading conversations`} />
            </div>
          ) : profilesError ? (
            <ErrorMessage
              className="m-5"
              title={`Failed to load messages`}
              error={{
                message: Errors.SomethingWentWrong,
                name: Errors.SomethingWentWrong
              }}
            />
          ) : sortedProfiles.length === 0 ? (
            <button
              className=" w-full justify-items-center"
              onClick={newMessageClick}
              type="button"
            />
          ) : (
            <Virtuoso
              className="mx-2 mb-[70vh] justify-around"
              data={sortedProfiles}
              itemContent={(_, [key, profile]) => {
                const message = messages.get(key);
                return (
                  <Preview
                    ensName={ensNames.get(key)}
                    isSelected={key === selectedConversationKey}
                    key={key}
                    profile={profile}
                    conversationKey={key}
                    message={message}
                  />
                );
              }}
            />
          )}
        </div>
      </Card>
      <Modal
        title={`New message`}
        // eslint-disable-next-line react/jsx-no-undef
        icon={<PlusCircleIcon className="text-brand h-5 w-5" />}
        size="sm"
        show={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      >
        <div className="pb w-full px-4 pt-4">
          <Search placeholder="" onProfileSelected={onProfileSelected} />
        </div>
      </Modal>
    </GridItemFour>
  );
};

export default PreviewList;
