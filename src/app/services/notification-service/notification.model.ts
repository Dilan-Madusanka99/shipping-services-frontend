export interface AppNotification {
  id: string;
  message: string;
  type: string;
  timeStamp?: Date;
  readStatus?: boolean;
  targetUser?: number | null;
  other?: string;
  email?: string;
  mobile?: string;
  title: string;
}
