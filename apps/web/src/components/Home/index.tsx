import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { IS_MAINNET, STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { HomeFeedType } from '@lensshare/data/enums';
import { PAGEVIEW } from '@lensshare/data/tracking';
import { GridItemEight, GridItemFour, GridLayout ,Image} from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useState } from 'react';
import { useAppStore } from 'src/store/useAppStore';
import { useEffectOnce } from 'usehooks-ts';

import AlgorithmicFeed from './AlgorithmicFeed';
import Tabs from './Algorithms/Tabs';
import EnableLensManager from './EnableLensManager';
import FeedType from './FeedType';
import Hero from './Hero';
import HeyMembershipNft from './HeyMembershipNft';
import Highlights from './Highlights';
import RecommendedProfiles from './RecommendedProfiles';
import SetProfile from './SetProfile';
import StaffPicks from './StaffPicks';
import Timeline from './Timeline';
import Waitlist from './Waitlist';
import { useTheme } from 'next-themes';
import AddToHome from './AddToHome';
import Algorithms from './Algorithms';
import EnableMessages from './EnableMessages';

const Home: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<HomeFeedType>(
    HomeFeedType.FOLLOWING
  );

 
  const loggedIn = Boolean(currentProfile);
  const loggedOut = !loggedIn;
  const { resolvedTheme } = useTheme();

  return (
    <>
      <MetaTags />
      {!currentProfile ? <Hero /> : null}
      <GridLayout>
      <GridItemEight>
          <>
          <AddToHome />

            {resolvedTheme === 'dark' ? (
              <Image
                className="cursor-pointer"
                src={`${STATIC_ASSETS_URL}/images/Lenstoknewlogo3.png`}
                alt="logo"
              />
            ) : (
              <Image
                className="cursor-pointer"
                src={`${STATIC_ASSETS_URL}/images/Lenstoknewlogo.png`}
                alt="logo"
              />
            )}

           
          </>
        </GridItemEight>
        <GridItemEight className="space-y-5">
          
          {currentProfile ? (
            <>
            
              <NewPost />
              <div className="space-y-3">
                <FeedType feedType={feedType} setFeedType={setFeedType} />
                <Tabs feedType={feedType} setFeedType={setFeedType} />
              </div>
              {feedType === HomeFeedType.FOLLOWING ? (
                <Timeline />
              ) : feedType === HomeFeedType.HIGHLIGHTS ? (
                <Highlights />
              ) : feedType === HomeFeedType.ALGO ? (
                <AlgorithmicFeed feedType={feedType} />
              ) : (
                <ExploreFeed />
              )}
            </>
          ) : (
            <ExploreFeed />
          )}
        </GridItemEight>
        <GridItemFour>
          {/* <Gitcoin /> */}
          {loggedOut && <Waitlist />}
          {/* Onboarding steps */}
          {loggedIn && (
            <>
              <EnableMessages />
              <EnableLensManager />
              <SetProfile />
            </>
          )}
          {/* Recommendations */}
          {loggedIn && <StaffPicks />}
          {loggedIn && <RecommendedProfiles />}
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Home;
