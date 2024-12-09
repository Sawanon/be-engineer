"use client";
import { useRef, useState } from "react";
import CustomInput from "../CustomInput";
import { EyeOff } from "lucide-react";
import { Eye } from "iconsax-react";
import { Button, Input } from "@nextui-org/react";
import { LuLogIn } from "react-icons/lu";
import { Controller, useForm } from "react-hook-form";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
type loginProps = {
   username: string;
   password: string;
};

const LoginForm = () => {
   // const { data: session, status } = useSession();
   // console.log("session", session, status);
   const router = useRouter();
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
      console.log(response)
      if (response?.ok) {
         router.replace("/");
      }
      console.log("response", response);
   };

   return (
      <div className="space-y-2 ">
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={`py-2`}>
               <h1 className="font-bold text-3xl text-center leading-9">
                  Login
               </h1>
            </div>
            <div className={`mt-app space-y-2`}>
               <Controller
                  name={`username`}
                  control={form.control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={(e) => {
                     // console.log("e", e);
                     return (
                        <Input
                           isInvalid={form.formState.errors?.username && true}
                           color={form.formState.errors?.username && "danger"}
                           classNames={{
                              input: [`text-[1em]`, `w-[280px]`],
                              inputWrapper: [`h-14`, `rounded-[14px]`],
                           }}
                           {...e.field}
                           placeholder="Username"
                        />
                     )
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
                        <Input
                           isInvalid={form.formState.errors?.username && true}
                           color={form.formState.errors?.username && "danger"}
                           type={isVisible ? "text" : "password"}
                           classNames={{
                              input: [`text-[1em]`, `w-[280px]`],
                              inputWrapper: [`h-14`, `rounded-[14px]`],
                           }}
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
                        />
                     )
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
            </div>

            <Button
               isLoading={form.formState.isSubmitting}
               type="submit"
               fullWidth
               className="mt-app bg-default-foreground text-default-100 h-12 font-sans text-base font-medium gap-3"
               endContent={<LuLogIn size={24} />}
            >
               เข้าสู่ระบบ
            </Button>
         </form>
      </div>
   );
};

export default LoginForm;
