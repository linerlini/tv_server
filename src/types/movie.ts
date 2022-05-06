export interface MovieInfo {
  uuid: string;
  name: string;
  type?: string;
  actors?: string;
  director?: string;
  time?: string;
  imgUrl: string;
  videoUrl?: string;
  isHot?: boolean;
  createdAt?: string;
  updatedAt?: string;
  desc?: string;
}
