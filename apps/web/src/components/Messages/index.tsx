import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';


import PreviewList from './PreviewList';
import { GridLayout } from '@lensshare/ui/src/GridLayout';
import Navbar from '@components/Shared/Navbar';
import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lensshare/data/constants';
import { useAppStore } from 'src/store/useAppStore';

const Messages: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <div className="flex-col">
      <GridLayout classNameChild="md:gap-8">
        <MetaTags title={`Messages • ${APP_NAME}`} />

        <PreviewList />
      </GridLayout>
    </div>
  );
};

export default Messages;
