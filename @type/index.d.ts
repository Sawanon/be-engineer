import { UseQueryResult } from "@tanstack/react-query";

export type modalProps<T = undefined> = {
   open: boolean;
   data?: T;
};
export type ErrorMessageProps = {
   isError: boolean;
   code: number;
   type?: string;
   message: string;
};

export type stateProps<T = undefined> = [T, Dispatch<SetStateAction<T>>];

export type deliverProps = {
   student_name: ReactNode;
   id: string;
   branch: string;
   courses: courseProps[];
   last_updated: Date;
   member: string;
   mobile: string;
   note: string;
};

export type courseProps = {
   course: string;
   id: number;
   term: string;
};

export type QueryProps<T = unknown> = UseQueryResult<
   T | ErrorMessageProps,
   Error
>;

export type InfinityQuery<T> = UseInfiniteQueryResult<
   InfiniteData<
      | ErrorMessageProps
      | {
           data: T;
           nextOffset?: number;
        },
      unknown
   >,
   Error
>;
