interface BaseResponse {
  code: number;
}

interface WYCreator {
  userId: number;
  userName: string;
}
export interface Video {
  coverUrl: string;
  title: string;
  durationms: number;
  playTime: number;
  type: number;
  creator: WYCreator[];
  aliaName?: any;
  transName?: any;
  vid: string;
  markTypes: number[];
  alg: string;
}

export interface SearchVideoResponse extends BaseResponse {
  result: {
    videoCount: number;
    videos: Video[];
  };
}
export interface VideoURL {
  id: string;
  url: string;
  size: number;
  validityTime: number;
  needPay: boolean;
  payInfo?: any;
  r: number;
}
export interface QueryVideoURLResponse extends BaseResponse {
  urls: VideoURL[];
}
interface Artist {
  id: number;
  name: string;
}
export interface MV {
  id: number;
  cover: string;
  name: string;
  playCount: number;
  briefDesc?: string;
  desc?: any;
  artistName: string;
  artistId: number;
  duration: number;
  mark: number;
  subed: boolean;
  artists: Artist[];
  transNames?: string[];
}
export interface QueryFirstMVResponse extends BaseResponse {
  data: MV[];
  code: number;
}

export interface MVURL {
  id: number;
  url: string;
  r: number;
  size: number;
  md5: string;
  code: number;
  expi: number;
  fee: number;
  mvFee: number;
  st: number;
  promotionVo?: any;
  msg: string;
}
export interface QueryMVURLResponse extends BaseResponse {
  code: number;
  data: MVURL;
}
interface HotVideoInfo {
  authId: number;
  status: number;
  id: number;
  title: string;
  subTitle: string;
  appTitle: string;
  aliaName: string;
  transName: string;
  pic4v3: number;
  pic16v9: number;
  caption: number;
  captionLanguage: string;
  style?: any;
  mottos: string;
  oneword?: string;
  appword: string;
  stars?: any;
  desc: string;
  area: string;
  type: string;
  subType: string;
  neteaseonly: number;
  upban: number;
  topWeeks: string;
  publishTime: string;
  online: number;
  score: number;
  plays: number;
  monthplays: number;
  weekplays: number;
  dayplays: number;
  fee: number;
}
export interface HotVideo {
  id: number;
  cover: string;
  name: string;
  playCount: number;
  briefDesc?: string;
  desc?: any;
  artistName: string;
  artistId: number;
  duration: number;
  mark: number;
  mv: HotVideoInfo;
  lastRank: number;
  score: number;
  subed: boolean;
  artists: Artist[];
  alias?: string[];
}
export interface GetHotVideoResponse extends BaseResponse {
  data: HotVideo[];
  hasMore: boolean;
  updateTime: number;
}
interface VideoGroup {
  id: number;
  name: string;
  alg?: any;
}

interface UrlInfo {
  id: string;
  url: string;
  size: number;
  validityTime: number;
  needPay: boolean;
  payInfo?: any;
  r: number;
}

interface Creator {
  defaultAvatar: boolean;
  province: number;
  authStatus: number;
  followed: boolean;
  avatarUrl: string;
  accountStatus: number;
  gender: number;
  city: number;
  birthday: number;
  userId: number;
  userType: number;
  nickname: string;
  signature: string;
  description: string;
  detailDescription: string;
  avatarImgId: number;
  backgroundImgId: number;
  backgroundUrl: string;
  authority: number;
  mutual: boolean;
  expertTags?: string[];
  djStatus: number;
  vipType: number;
  remarkName?: any;
  avatarImgIdStr: string;
  backgroundImgIdStr: string;
}

interface Resolution {
  resolution: number;
  size: number;
}

export interface RecommendVideoInfo {
  alg: string;
  scm: string;
  threadId: string;
  coverUrl: string;
  height: number;
  width: number;
  title: string;
  description?: string;
  commentCount: number;
  shareCount: number;
  resolutions: Resolution[];
  creator: Creator;
  urlInfo: UrlInfo;
  videoGroup: VideoGroup[];
  previewUrl?: any;
  previewDurationms: number;
  hasRelatedGameAd: boolean;
  markTypes?: number[];
  relateSong: any[];
  relatedInfo?: any;
  videoUserLiveInfo?: any;
  vid: string;
  durationms: number;
  playTime: number;
  praisedCount: number;
  praised: boolean;
  subscribed: boolean;
}
interface RecommendVideo {
  type: number;
  displayed: boolean;
  alg: string;
  extAlg?: any;
  data: RecommendVideoInfo;
}
export interface GetRecommendVideoRes {
  datas: RecommendVideo[];
  msg: string;
  hasmore: boolean;
  code: number;
}
