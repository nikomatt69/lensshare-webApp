import { BASE_URL, HEY_API_URL, IS_MAINNET } from '@lensshare/data/constants';
import axios from 'axios';

/**
 * Get the number of views of a publication
 * @param ids The ids of the publications
 * @returns The number of views of the publication
 */
const getPublicationsViews = async (ids: string[]) => {
  

  try {
    const response = await axios.post(`/api/stats/publicationViews`, {
      ids
    });

    return response.data?.views;
  } catch {
    return [];
  }
};

export default getPublicationsViews;
