"use server";

import axios from "axios";
import { handleError } from "../util";
const { B_API_KEY, B_END_POINT } = process.env;

export const login = async (data: { username: string; password: string }) => {
   try {
      const res = await axios({
         method: "POST",
         url: `${B_END_POINT}/api/auth-external`,
         headers: {
            "B-API-KEY": B_API_KEY,
         },
         data,
         //  validateStatus: () => true,
      });
      console.log("res.data", res.data);
      return res.data;
   } catch (error) {
      throw handleError(error);
   } finally {
      // prisma.$disconnect();
   }
};
