"use server";

import axios from "axios";
import { handleError, parseStringify } from "../util";
import { deliverProps } from "@/@type";

const { B_API_KEY, B_END_POINT } = process.env;

export const getDeliver = async () => {
   try {
      const res = await axios({
         method: "GET",
         url: `${B_END_POINT}/api/deliver`,
         headers: {
            "B-API-KEY": B_API_KEY,
         },
      });
      return parseStringify(res.data as deliverProps[]);
   } catch (e) {
      return handleError(e);
   }
};
