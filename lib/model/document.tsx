export type Document = {
    type: "book" | "sheet" | "pre-exam",
    imageUrl?: string,
    name: string,
}

export type CreateBook = {
    name: string,
    term: string,
    year: string,
    volume: string,
 }