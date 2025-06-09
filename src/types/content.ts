export enum Contentstatuss {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export interface Content {
  id: string;
  title: string;
  description: string;
  body: string;
  statuss: Contentstatuss;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

}

export interface ContentCreateData {
  title: string;
  description: string;
  body: string;
}

export interface ContentUpdateData extends ContentCreateData {
  id: string;
}

export interface ContentPublishData {
  id: string;
  statuss: Contentstatuss;
}