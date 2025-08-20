export type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  creator: string;
  timestamp?: any;
};

export type Card = {
  name: string;
  iconUrl: string;
  elixir: number;
  releaseOrder: number;
};

export type Deck = {
  name: string;
  cards: Card[];
};

export type Message = {
    id: string;
    text: string;
    username: string;
    uid: string;
    timestamp: any;
}
