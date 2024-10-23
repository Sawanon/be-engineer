import CustomInput from "@/components/CustomInput";
import LoginForm from "@/components/Login";
import _ from "lodash";

const LoginPage = async () => {
   return (
      // <section className="absolute inset-0  flex flex-col bg-[#FAFAFA] overflow-x-hidden  ">
      <section className="inset-0 m-auto absolute flex flex-col bg-default-50 font-IBM-Thai-Looped justify-center items-center ">
         <LoginForm />
      </section>
   );
};

export default LoginPage;
