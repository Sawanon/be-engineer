import { ErrorMessageProps } from "@/@type";

export const isErrorMessageProps = (
    props: ErrorMessageProps | any
 ): props is ErrorMessageProps => {
    return props?.isError === true;
 };