export interface Image {
  url: string;
  height: number;
  width: number;
}
export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  external_urls: ExternalUrl;
  id: string;
  images: Image[];
  uri: string;
}
export interface ExternalUrl {
  spotify: string;
}
export interface Artist {
  name: string;
  images: Image[];
  external_urls: ExternalUrl;
}
export interface Album {
  name: string;
  release_date: string;
  total_tracks: number;
  external_urls: ExternalUrl;
  images: Image[];
}
export interface TrackDetails {
  album: Album;
  artists: Artist[];
  name: string;
  external_urls: ExternalUrl;
  preview_url: string;
  id: string;
}
export interface PlayList {
  href: string;
  id: string;
  images: Image[];
  name: string;
  tracks?: {href: string, total: number, items: {track: TrackDetails}[] };
}
export interface PlayListItems {
  href: string;
  items: PlayList[];
  total: number;
}
