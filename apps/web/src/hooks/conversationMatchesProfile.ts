import { XMTP_PREFIX } from '@lensshare/data/constants';

/**
 * Returns a regex that matches a conversation ID for the given profile ID.
 *
 * @param profileId The profile ID to match.
 * @returns A regular expression object that matches the conversation ID.
 */
const conversationMatchesProfile = (profile: string) =>
  new RegExp(`${XMTP_PREFIX}/.*${profile}`);

export default conversationMatchesProfile;
