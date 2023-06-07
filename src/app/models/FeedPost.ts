export default interface FeedPost {
    id?: number,
    title: string;
    content: string;
    publishedOn?: Date;
    userId?: string;
    tagId?: number;
};