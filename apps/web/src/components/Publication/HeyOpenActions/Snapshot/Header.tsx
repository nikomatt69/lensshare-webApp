import { SNAPSHOT_URL } from '@lensshare/data/constants';
import formatAddress from '@lensshare/lib/formatAddress';
import { Proposal } from '@lensshare/snapshot';
import cn from '@lensshare/ui/cn';
import Link from 'next/link';
import type { FC } from 'react';
import { Image } from '@lensshare/ui';
interface HeaderProps {
  proposal: Proposal;
}

const Header: FC<HeaderProps> = ({ proposal }) => {
  const { id, title, space, state, author } = proposal;
  const spaceUrl = `${SNAPSHOT_URL}/#/${space?.id}`;

  return (
    <div className="flex- mb-2 items-center space-x-1 text-xs">
      <div
        className={cn(
          state === 'active' ? 'bg-green-500' : 'bg-brand-500',
          'mr-1 rounded-full px-2 py-0.5 text-xs capitalize text-white'
        )}
      >
        {state}
      </div>
      <Image
        src={`https://cdn.stamp.fyi/space/${space?.id}`}
        className="mr-1 h-5 w-5 rounded-full"
        alt={space?.id}
      />
      <Link href={spaceUrl} className=" text-xs" target="_blank">
        {space?.name ?? space?.id}
      </Link>
      <span>by</span>
      <Link href={`${SNAPSHOT_URL}/#/profile/${author}`} target="_blank">
        {formatAddress(author)}
      </Link>

      <Link
        href={`${spaceUrl}/proposal/${id}`}
        className="line-clamp-5  text-xs"
        target="_blank"
      >
        <div className="line-clamp-5 break-words  text-xs">
          {title}
        </div>
      </Link>
    </div>
  );
};

export default Header;
