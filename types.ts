export interface UploadedAsset {
  id: string;
  name: string;
  url: string; // The "public" url (or blob url in demo mode)
  type: string;
  size: number;
  createdAt: number;
  status: 'uploading' | 'completed' | 'error';
  dimensions?: { width: number; height: number };
}

export interface UploadError {
  message: string;
  code: string;
}

export enum ViewMode {
  GRID = 'GRID',
  LIST = 'LIST'
}