import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export const POST = async  (req: NextRequest, res: NextResponse) => {
  try {
    // const res = await prisma.documentSheet.findMany()
    // console.log("res", res);
    // return Response.json({
    //   data: res,
    // })
  } catch (error) {
    console.error(error);
    return Response.json({
      message: `${error}`,
    })
  } finally {
    prisma.$disconnect()
  }
}