"use client";
import { useRef, useState } from "react";
import CustomInput from "../CustomInput";
import { EyeOff } from "lucide-react";
import { Eye } from "iconsax-react";
import { Button } from "@nextui-org/react";
import { LuLogIn } from "react-icons/lu";
import { Controller, useForm } from "react-hook-form";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
type loginProps = {
   username: string;
   password: string;
};

const LoginForm = () => {
   const { data: session, status } = useSession();
   console.log("session", session, status);
   const [isVisible, setIsVisible] = useState(false);
   const form = useForm<loginProps>();
   const toggleVisibility = () => setIsVisible(!isVisible);
   const onSubmit = async (data: loginProps) => {
      let response = await signIn("credentials", {
         username: data.username,
         password: data.password,
         redirect: false,

         callbackUrl: "/",
      });
      console.log("response", response);
   };
   return (
      <div className="space-y-2 ">
         <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
            <h1 className="mb-2 font-bold text-3xl text-center leading-9">
               Login
            </h1>
            <Controller
               name={`username`}
               control={form.control}
               defaultValue=""
               rules={{ required: true }}
               render={(e) => {
                  // console.log("e", e);
                  return (
                     <CustomInput
                        isInvalid={form.formState.errors?.username && true}
                        color={form.formState.errors?.username && "danger"}
                        {...e.field}
                        placeholder="Username"
                        // defaultValue="TH212318237"
                     />
                  );
               }}
            />
            <Controller
               name={`password`}
               control={form.control}
               defaultValue=""
               rules={{ required: true }}
               render={(e) => {
                  // console.log("e", e);
                  return (
                     <CustomInput
                        isInvalid={form.formState.errors?.username && true}
                        color={form.formState.errors?.username && "danger"}
                        type={isVisible ? "text" : "password"}
                        endContent={
                           <button
                              className="focus:outline-none"
                              type="button"
                              onClick={toggleVisibility}
                              aria-label="toggle password visibility"
                           >
                              {isVisible ? (
                                 <Eye
                                    className="text-content4-foreground"
                                    size={20}
                                 />
                              ) : (
                                 <EyeOff
                                    className="text-content4-foreground"
                                    size={20}
                                 />
                              )}
                           </button>
                        }
                        {...e.field}
                        placeholder="Password"
                        // defaultValue="TH212318237"
                     />
                  );
               }}
            />

            <Button
               isLoading={form.formState.isSubmitting}
               type="submit"
               fullWidth
               className="mt-2 bg-default-foreground text-default-100"
               endContent={<LuLogIn size={24} />}
            >
               เข้าสู่ระบบ
            </Button>
         </form>
      </div>
   );
};

export default LoginForm;
