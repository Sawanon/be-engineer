export type modalProps<T = undefined> = {
   open: boolean;
   data?: T;
};

export type stateProps<T = undefined> = [T, Dispatch<SetStateAction<T>>];
