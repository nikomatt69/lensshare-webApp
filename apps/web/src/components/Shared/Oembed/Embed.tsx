import stopEventPropagation from '@lensshare/lib/stopEventPropagation';
import type { OG } from '@lensshare/types/misc';
import { Card } from '@lensshare/ui';
import Link from 'next/link';
import type { FC } from 'react';

interface EmbedProps {
  og: OG;
  publicationId?: string;
}

const Embed: FC<EmbedProps> = ({ og, publicationId }) => {
  return (
    <div className="mt-4 truncate text-sm sm:w-4/6">
      <Link
        href={og.url}
        onClick={(event) => {
          stopEventPropagation(event);
        }}
        target={og.url.includes(location.host) ? '_self' : '_blank'}
        rel="noreferrer noopener"
      >
        <Card forceRounded>
          <div className="flex items-center">
            <div className="truncate break-words p-5">
              <div className="space-y-1.5">
                {og.title ? (
                  <div className="line-clamp-3 truncate font-bold">
                    {og.title}
                  </div>
                ) : null}
                {og.description ? (
                  <div className="lt-text-gray-500 line-clamp-2 whitespace-break-spaces">
                    {og.description}
                  </div>
                ) : null}
                {og.site ? (
                  <div className="flex items-center space-x-2 pt-1.5">
                    {og.favicon ? (
                      <img
                        className="h-4 w-4 rounded-full"
                        height={16}
                        width={16}
                        src={og.favicon}
                        alt="Favicon"
                      />
                    ) : null}
                    <div className="lt-text-gray-500 text-xs">{og.site}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default Embed;
