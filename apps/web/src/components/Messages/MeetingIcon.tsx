import useSendMessage from 'src/hooks/useSendMessage';

import { VideoCameraIcon } from '@heroicons/react/24/outline';

import Link from 'next/link';
import type { FC } from 'react';
import { BASE_URL } from '@lensshare/data/constants';

const MeetingIcon: FC = () => {
  return (
    <Link
      href={`${BASE_URL}/meet/`}
      onClick={async () => {
        const apiCall = await fetch('/api/create-room', {
          method: 'POST',
          body: JSON.stringify({
            title: 'LensShare Meet'
          }),
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
          }
        });
        const data = await apiCall.json();
        const roomId = data.data;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useSendMessage(`Join here for a call: ${BASE_URL}/meet/${roomId}`);
      }}
      className=" mb-2 mr-4 inline h-8  w-8 cursor-pointer"
      draggable="false"
    >
      <VideoCameraIcon />
    </Link>
  );
};

export default MeetingIcon;
