import { XMTP_PREFIX } from '@lensshare/data/constants';

/**
 * Builds a unique conversation ID for a chat between two users.
 *
 * @param profileA The profile handle of the first user.
 * @param profileB The profile handle of the second user.
 * @returns The conversation ID.
 */
const buildConversationId = (profileA: string, profileB: string) => {
  const numberA = parseInt(profileA);
  const numberB = parseInt(profileB);
  return numberA < numberB
    ? `${XMTP_PREFIX}/${profileA}-${profileB}`
    : `${XMTP_PREFIX}/${profileB}-${profileA}`;
};

export default buildConversationId;
