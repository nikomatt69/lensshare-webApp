import type {
  AmountInput,
  CollectOpenActionModuleType,
  RecipientDataInput
} from '@lensshare/lens';
import type { Database } from './database.types';

export type Group = Database['public']['Tables']['groups']['Row'];

export type StaffPick = Database['public']['Tables']['staff-picks']['Row'];

export type MembershipNft =
  Database['public']['Tables']['membership-nft']['Row'];

export type CollectModuleType = {
  type?:
    | CollectOpenActionModuleType.SimpleCollectOpenActionModule
    | CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule
    | null;
  amount?: AmountInput | null;
  collectLimit?: string | null;
  referralFee?: number | null;
  recipient?: string | null;
  recipients?: RecipientDataInput[];
  followerOnly?: boolean;
  endsAt?: string | null;
};


export type PublicationViewCount = {
  id: string;
  views: number;
};
