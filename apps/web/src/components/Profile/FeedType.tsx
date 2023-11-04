import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  FilmIcon,
  PencilSquareIcon,
  RectangleGroupIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { IS_MAINNET } from '@lensshare/data/constants';
import { PROFILE } from '@lensshare/data/tracking';
import { TabButton } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { Dispatch, FC, SetStateAction } from 'react';
import { ProfileFeedType } from 'src/enums';

import MediaFilter from './Filters/MediaFilter';

interface FeedTypeProps {
  setFeedType: Dispatch<SetStateAction<string>>;
  feedType: string;
}

const FeedType: FC<FeedTypeProps> = ({ setFeedType, feedType }) => {
  const switchTab = (type: string) => {
    setFeedType(type);
    if (type === ProfileFeedType.Stats.toLowerCase()) {
     
    } else {
    
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        <TabButton
          name="Feed"
          icon={<PencilSquareIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Feed}
          type={ProfileFeedType.Feed.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Feed)}
        />
        <TabButton
          name="Replies"
          icon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Replies}
          type={ProfileFeedType.Replies.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Replies)}
        />
        <TabButton
          name="Media"
          icon={<FilmIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Media}
          type={ProfileFeedType.Media.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Media)}
        />
        <TabButton
          name="Collected"
          icon={<RectangleStackIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Collects}
          type={ProfileFeedType.Collects.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Collects)}
        />
        <TabButton
          name="Gallery"
          icon={<RectangleGroupIcon className="h-4 w-4" />}
          active={feedType === ProfileFeedType.Gallery}
          type={ProfileFeedType.Gallery.toLowerCase()}
          onClick={() => switchTab(ProfileFeedType.Gallery)}
        />
        {IS_MAINNET ? (
          <TabButton
            name="Stats"
            icon={<ChartBarIcon className="h-4 w-4" />}
            active={feedType === ProfileFeedType.Stats}
            type={ProfileFeedType.Stats.toLowerCase()}
            onClick={() => switchTab(ProfileFeedType.Stats)}
          />
        ) : null}
      </div>
      {feedType === ProfileFeedType.Media ? <MediaFilter /> : null}
    </div>
  );
};

export default FeedType;
