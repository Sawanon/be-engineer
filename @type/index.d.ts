import { deliveryPrismaProps } from "@/lib/actions/deliver.actions";
import { deliveryType } from "@/lib/res/const";
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

export type deliveryProps = {
   //custom data
   newAddress?: string;
   //
   student_name: ReactNode;
   id: number;
   branch: string;
   courses: courseProps[];
   last_updated: Date;
   member: string;
   mobile: string;
   note: string;
   tracking?: deliveryPrismaProps;
   branch: string;
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

export type deliverShipServiceKey = keyof typeof deliveryType;

export type addTrackingProps = {
   id : number
   updateAddress?: string;
   trackingCode: string;
   note?: string;
   // webappOrderId: number;
   service: deliverShipServiceKey;
   // courseId: string[] | number[];
   //   status, updatedAddress, courseId, webappOrderId, webappCourseId, webappAdminId, note, createdAt, updatedAt, serviceId, trackingCode
};
export type addMultiTrackingProps = {
   service: deliverShipServiceKey;
   ids: number[];
   courseIds: number[];
   deliveryData: Pick<addTrackingProps, "trackingCode" | "id">[];
};

export type deliveryTypeProps = "pickup" | "ship";
