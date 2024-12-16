import { cn } from "@/lib/util";
import {
   Input,
   InputProps as NextInputProps,
   InternalForwardRefRenderFunction,
} from "@nextui-org/react";
import { forwardRef } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type inputType<T extends FieldValues> = {
   form?: UseFormReturn<T, any, undefined>;
   className?: string;
} & NextInputProps;

const CustomInput = <T extends FieldValues>(prop: inputType<T>) => {
   return (
      <Input
         {...prop}
         aria-label={prop.name}
         classNames={{
            ...prop.classNames,
            mainWrapper: cn(
               "font-serif",
               prop.classNames?.mainWrapper
            ),
            input: cn("text-[1em]", prop.classNames?.input),
         }}
         {...prop.form?.register(prop.name as Path<T>, {
            required: true,
         })}
      />
   );
};

export default CustomInput;
