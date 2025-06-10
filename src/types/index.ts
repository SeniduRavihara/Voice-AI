export interface ImportantData {
  key: string;
  value: string;
}

export interface MessageType {
  text: string;
  isUser: boolean;
  timestamp: number;
  importantData?: ImportantData[] | null;
}