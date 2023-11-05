import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { Tab } from '@headlessui/react';
import { APP_NAME } from '@lensshare/data/constants';
import { PAGEVIEW } from '@lensshare/data/tracking';
import type { PublicationMetadataMainFocusType } from '@lensshare/lens';
import { ExplorePublicationsOrderByType } from '@lensshare/lens';
import { GridItemEight, GridItemFour, GridLayout } from '@lensshare/ui';
import cn from '@lensshare/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import { LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';

import Feed from './Feed';
import MirrorOutline from '@components/Icons/MirrorOutline';
import ExploreOutline from '@components/Icons/ExploreOutline';

const Explore: NextPage = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isLensMember = usePreferencesStore((state) => state.isLensMember);
  const [focus, setFocus] = useState<PublicationMetadataMainFocusType>();

 

  const tabs = [
    {
      icon: <SparklesIcon />,
      type: ExplorePublicationsOrderByType.LensCurated
    },
    {
      icon: <LightBulbIcon />,
      type: ExplorePublicationsOrderByType.TopCommented
    },
    {
      icon: <ExploreOutline />,
      type: ExplorePublicationsOrderByType.TopCollectedOpenAction
    },
    {
      icon: <MirrorOutline />,
      type: ExplorePublicationsOrderByType.TopMirrored
    }
  ];

  return (
    <GridLayout>
      <MetaTags
        title={`Explore • ${APP_NAME}`}
        description={`Explore top commented, collected and latest publications in the ${APP_NAME}.`}
      />
      <GridItemEight className="space-y-5">
        <Tab.Group
          defaultIndex={Number(router.query.tab)}
          onChange={(index) => {
            router.replace(
              { query: { ...router.query, tab: index } },
              undefined,
              { shallow: true }
            );
          }}
        >
          <Tab.List className="divider space-x-8">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.type}
                defaultChecked={index === 1}
                className={({ selected }) =>
                  cn(
                    {
                      'border-brand-500 border-b-2 !text-black dark:!text-white':
                        selected
                    },
                    'lt-text-gray-500 px-4 pb-2 text-xs font-medium outline-none sm:text-sm'
                  )
                }
              >
                {tab.icon}
              </Tab>
            ))}
          </Tab.List>
          <FeedFocusType focus={focus} setFocus={setFocus} />
          <Tab.Panels>
            {tabs.map((tab) => (
              <Tab.Panel key={tab.type}>
                <Feed focus={focus} feedType={tab.type} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </GridItemEight>
      <GridItemFour>
        {isLensMember ? <Trending /> : null}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
