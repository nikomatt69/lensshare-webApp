import type { AnyPublication } from '@lensshare/lens';
import type { PublicationViewCount } from '@lensshare/types/hey';

import { isMirrorPublication } from './publicationHelpers';

/**
 * Get the number of views of a publication
 * @param views The views of the publications
 * @param publication The publication
 * @returns The number of views of the publication
 */
const getPublicationViewCountById = (
  views: PublicationViewCount[],
  publication: AnyPublication
) => {
  const id = isMirrorPublication(publication)
    ? publication.mirrorOn.id
    : publication.id;

  return views.find((v) => v.id === id)?.views || 0;
};

export default getPublicationViewCountById;
