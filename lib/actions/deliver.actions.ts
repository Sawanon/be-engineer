"use server";

import axios from "axios";
import { checkStatus, handleError, parseStringify } from "../util";
import {
  addMultiTrackingProps,
  addTrackingProps,
  courseProps,
  deliveryProps,
  updateTrackingProps,
} from "@/@type";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  addDeliverShipService,
  getShipServiceByName,
} from "./delivery_ship.actions";
import { deliveryType } from "../res/const";
import _, { isNaN } from "lodash";
import { getCourseByWebappId } from "./course.actions";
import async from "async";
import { cache } from "react";
import { revalidatePath, revalidateTag } from "next/cache";
import { DeliverFilter } from "@/components/Deliver/form";
import { getBookById, updateBookInStock } from "./book.actions";
import { addBookTransactionAction } from "./bookTransactions";
import { addBookRecord, addRecordData, addSheetRecord } from "./record.actions";
import dayjs from "dayjs";
import PrismaDB from "../db";

const { B_API_KEY, B_END_POINT } = process.env;
const prisma = PrismaDB;
export type deliveryPrismaProps = NonNullable<
  Awaited<ReturnType<typeof prisma.delivery.findFirst>>
>;
type RequireddeliveryPrismaProps =
  | "status"
  | "type"
  | "webappOrderId"
  | "webappCourseId";
export type DeliverRes = Awaited<ReturnType<typeof getDeliver>>;
// export type deliveryPrismaProps = DeliverRes["data"][0]

export const refetchData = () => {
  console.log("Revalidate");
  revalidatePath("/deliver");
  // revalidateTag("getDeliver");
};

export const cloneNewData = async () => {
  try {
    let newData = false;
    const getLastIdKmitl = await getLatestId("KMITL");
    const getLastIdOdm = await getLatestId("ODM");

    // const lastItemsByBranch = _.chain(delivery.data)
    //   .groupBy("branch") // Group items by 'branch'
    //   .mapValues((group) => _.maxBy(group, "webappOrderId")) // Get the item with the max 'id' in each group
    //   .value();
    const lastWebappOrderIdOdm =
      (await getLastsIdNew("ODM"))?.webappOrderId ?? 0;
    const lastWebappOrderIdKmitl =
      (await getLastsIdNew("KMITL"))?.webappOrderId ?? 0;
    if (getLastIdKmitl !== lastWebappOrderIdKmitl) {
      newData = true;
       updateDataByBranch({
        branch: "KMITL",
        startId: lastWebappOrderIdKmitl + 1,
      });
    }
    if (getLastIdOdm !== lastWebappOrderIdOdm) {
      newData = true;
       updateDataByBranch({
        branch: "ODM",
        startId: lastWebappOrderIdOdm + 1,
      });
    }
    console.table({
      lastODM: getLastIdOdm,
      lastKMITL: getLastIdKmitl,
      lastWebappOrderIdOdm,
      lastWebappOrderIdKmitl,
    });
    return newData;
  } catch (error) {
    throw handleError(error);
  }
};

export const getLastsIdNew = async (branch: "ODM" | "KMITL") => {
  try {
    const res = await prisma.delivery.findFirst({
      orderBy: { id: "desc" },
      take: 1,
      where: { branch: branch },
    });
    return res;
  } catch (error) {
    throw handleError(error);
  }
};

export const getLatestId = async (branch: "ODM" | "KMITL") => {
  try {
    const res = await axios({
      method: "GET",
      url: `${B_END_POINT}/api/deliver/latest-id?branch=${branch.toUpperCase()}`,
      headers: {
        "B-API-KEY": B_API_KEY,
      },
    });
    return res.data;
  } catch (error) {
    throw handleError(error);
  } finally {
    // prisma.$disconnect();
  }
};

export const getDeliver = cache(async () => {
  try {
    console.time("get deliver");
    const res = await prisma.delivery.findMany({
      include: {
        Delivery_Course: {
          include: {
            Course: true,
          },
          // Course: {
          //    include: {
          //       CourseLesson: {
          //          include: {
          //             LessonOnDocument: true,
          //             LessonOnDocumentBook: true,
          //             LessonOnDocumentSheet: true,
          //          },
          //       },
          //    },
          // },
        },
        Delivery_WebappCourse: {
          include: {
            WebappCourse: true,
          },
        },
        DeliverShipService: true,
      },
      orderBy: { id: "desc" },
      take: 500000,
    });
    const count = await prisma.delivery.count();
    console.timeEnd("get deliver");

    return parseStringify({
      total: count,
      data: res,
    });
  } catch (e) {
    throw handleError(e);
  } finally {
    prisma.$disconnect();
  }
});

// statusSearch.some((status) => {
//   return (
//     checkStatus[status]?.status === deliver.status &&
//     checkStatus[status]?.type === deliver.type
//   );
// });

export const getDeliverByFilter = async (
  props: DeliverFilter & { page: number }
) => {
  const { page } = props;
  try {
    const splitStatus =
      props?.status === ","
        ? undefined
        : (props.status?.split(",") as (keyof typeof checkStatus)[]);
    console.log("props.input", props.input);
    let query: Prisma.DeliveryFindManyArgs = {
      where: {
        OR: [
          {
            AND: [
              {
                OR: [
                  {
                    webappOrderId:
                      props.input && !isNaN(parseInt(props.input))
                        ? parseInt(props?.input)
                        : undefined,
                  },
                  {
                    member: {
                      contains: props.input?.trim(),
                    },
                  },
                  {
                    Delivery_WebappCourse: {
                      some: {
                        WebappCourse: {
                          name: {
                            contains: props.input,
                          },
                        },
                      },
                    },
                  },
                ],
              },
              {
                branch:
                  props.university && props.university !== ""
                    ? props.university
                    : undefined,
              },
              {
                approved: {
                  gte: props.startDate
                    ? dayjs(props.startDate, "YYYYMMDD")
                        .startOf("date")
                        .toDate()
                    : undefined,
                  lte: props.endDate
                    ? dayjs(props.endDate, "YYYYMMDD").endOf("date").toDate()
                    : undefined,
                },
              },
              {
                OR: splitStatus?.map((staus) => {
                  if (checkStatus[staus] === undefined) {
                    return {};
                  }
                  return {
                    AND: [
                      { status: checkStatus[staus].status },
                      { type: checkStatus[staus].type },
                    ],
                  };
                }),
              },
            ],
          },
        ],
      },
    };
    // if (props.input !== "" && props.input) {
    //   query = {
    //     where: {
    //       OR: [
    //         {
    //           webappOrderId: !isNaN(parseInt(props.input))
    //             ? parseInt(props.input)
    //             : undefined,
    //         },
    //         {
    //           member: { contains: props.input },
    //         },
    //         {
    //           Delivery_WebappCourse: {
    //             every: {
    //               WebappCourse: {
    //                 name: {
    //                   contains: props.input,
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   };
    // }
    const res = await prisma.delivery.findMany({
      include: {
        Delivery_Course: {
          include: {
            Course: true,
          },
        },
        Delivery_WebappCourse: {
          include: {
            WebappCourse: true,
          },
        },
        DeliverShipService: true,
      },
      // where: {
      //   webappOrderId: 27462,
      // },
      where: query.where,
      orderBy: { id: "desc" },
      take: 100,
      skip: (page - 1) * 100,
    });
    const count = await prisma.delivery.count({ where: query.where });
    // console.log("res", res);
    // res[0]?.Delivery_Course.map((d) => {
    //   console.log("d", d);
    // });
    // const test = _.uniqBy(res, "status");
    // test.map(d=> console.log('d.status', d.status))
    return parseStringify({
      total: count,
      data: res,
    });
  } catch (e) {
    console.log("e", e);
    throw handleError(e);
  } finally {
    prisma.$disconnect();
  }
};
export const getDeliverByIds = cache(async (Ids: number[]) => {
  try {
    const res = await prisma.delivery.findMany({
      where: {
        id: { in: Ids },
      },
      include: {
        RecordBook: {
          include: {
            DocumentBook: true,
          },
        },
        RecordSheet: {
          include: {
            DocumentSheet: true,
          },
        },
        DeliverShipService: true,
        Delivery_Course: {
          include: {
            Course: {
              include: {
                CourseLesson: {
                  include: {
                    LessonOnDocument: {
                      include: {
                        DocumentPreExam: true,
                      },
                    },
                    LessonOnDocumentBook: {
                      include: {
                        DocumentBook: true,
                      },
                    },
                    LessonOnDocumentSheet: {
                      include: {
                        DocumentSheet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        Delivery_WebappCourse: {
          include: {
            WebappCourse: true,
          },
        },
      },
      orderBy: { id: "desc" },
      take: 500000,
    });

    return parseStringify(res);
  } catch (e) {
    throw handleError(e);
  } finally {
    prisma.$disconnect();
  }
});
export const getDeliverById = async (Id: number) => {
  try {
    const res = await prisma.delivery.findFirst({
      where: {
        id: Id,
      },
      include: {
        RecordBook: {
          include: {
            DocumentBook: true,
          },
        },
        RecordSheet: {
          include: {
            DocumentSheet: true,
          },
        },
        DeliverShipService: true,
        Delivery_Course: {
          include: {
            Course: {
              include: {
                CourseLesson: {
                  include: {
                    LessonOnDocument: {
                      include: {
                        DocumentPreExam: true,
                      },
                    },
                    LessonOnDocumentBook: {
                      include: {
                        DocumentBook: true,
                      },
                    },
                    LessonOnDocumentSheet: {
                      include: {
                        DocumentSheet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        Delivery_WebappCourse: {
          include: {
            WebappCourse: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return parseStringify(res);
  } catch (e) {
    throw handleError(e);
  } finally {
    prisma.$disconnect();
  }
};
export const getInfinityDeliver = cache(
  async ({
    pageParam = 1,
    search,
  }: {
    search: DeliverFilter;
    pageParam?: number;
  }) => {
    try {
      const filter = {};

      // switch(search.status){

      // }

      const res = await prisma.delivery.findMany({
        orderBy: [{ id: "desc" }],
        take: 100,
        skip: (pageParam - 1) * 100,
        where: {
          approved: {
            lte: new Date(),
            gte: new Date(),
          },
          member: {
            contains: "test",
          },
          branch: {
            contains: "master",
          },
        },
        include: {
          Delivery_Course: {
            include: {
              Course: true,
            },
          },
          Delivery_WebappCourse: {
            include: {
              WebappCourse: true,
            },
          },
          DeliverShipService: true,
          //#endregion
        },
      });

      const count = await prisma.delivery.count();

      const data = res as deliveryPrismaProps[];

      // if (data.length < 100) {
      //    return { data: data };
      // }
      // return parseStringify({ data: data, nextOffset: pageParam + 1 }) as {
      //    data: deliveryPrismaProps[];
      //    nextOffset: number;
      // };

      if (data.length < 100) {
        return parseStringify({
          total: count,
          data,
          nextPage: undefined,
        });
      }
      return parseStringify({
        total: count,
        data,
        nextPage: pageParam + 1,
      });
    } catch (e) {
      throw handleError(e);
    }
  }
);

export const getTrackingByWebappIdArr = async (webappId: number[]) => {
  try {
    const res = await prisma.delivery.findMany({
      where: {
        webappOrderId: { in: webappId },
      },

      // include: {
      //    DeliverShipService: true,
      //  },
    });
    return parseStringify(res);
  } catch (error) {
    handleError(error);
  } finally {
    prisma.$disconnect();
  }
};

export const getTrackingByWebappId = async (webAppOrderId: number) => {
  try {
    const res = await prisma.delivery.findFirst({
      where: {
        webappOrderId: webAppOrderId,
      },
      include: {
        // DeliverShipService: true,
        Course: true,
        Delivery_Course: {
          include: {
            Course: true,
          },
        },
      },
    });
    return parseStringify(res);
  } catch (error) {
    throw handleError(error);
  } finally {
    prisma.$disconnect();
  }
};
export const getTrackingById = async (id: number) => {
  try {
    const res = await prisma.delivery.findFirst({
      where: {
        id,
      },
      include: {
        // DeliverShipService: true,
        Course: true,
        Delivery_Course: {
          include: {
            Course: true,
          },
        },
      },
    });
    return parseStringify(res);
  } catch (error) {
    handleError(error);
  } finally {
    prisma.$disconnect();
  }
};

export const updateAddress = async ({
  updateAddress,
  id,
}: // courseId,
{
  id: number;
  updateAddress: string;
}) => {
  try {
    const getDelivery = await getTrackingById(id);
    console.log("getDelivery", getDelivery);
    if (_.isEmpty(getDelivery)) {
      // const res = await createDelivery({
      //    type: "ship",
      //    status: "waiting",
      //    updatedAddress: updateAddress,
      //    webappOrderId,
      //    // webappCourseId: courseId?.toString(),
      // });
      // return parseStringify(res);
    } else {
      const res = await prisma.delivery.update({
        where: {
          id: getDelivery.id,
        },
        data: {
          type: "ship",
          status: getDelivery.status,
          updatedAddress: updateAddress,
        },
      });

      return parseStringify(res);
    }
  } catch (error) {
    console.log("error", error);
    throw handleError(error);
  } finally {
    prisma.$disconnect();
  }
};
export const addMultiTracking = async ({
  deliveryData,
  service,
  ids,
  courseIds,
  webappAdminUsername,
  webappAdminId,
}: addMultiTrackingProps) => {
  try {
    const getShipService = await getShipServiceByName(service);
    const getDeliveries = await getTrackingByWebappIdArr(ids);
    const groupDelivery: Record<string, deliveryPrismaProps> = {};
    getDeliveries?.forEach((delivery) => {
      groupDelivery[delivery.webappOrderId.toString()] = delivery;
    });
    async.forEachOf(deliveryData, async (delivery, key, callback) => {
      const res = await prisma.delivery.update({
        where: {
          // webappOrderId: webAppOrderId,
          id: delivery.id,
        },
        data: {
          type: "ship",
          status: "success",
          trackingCode: delivery.trackingCode,
          updatedAt: new Date(),
          DeliverShipService: { connect: { id: getShipService!.id } },
          webappAdminUsername,
          webappAdminId,
        },
      });
      await addRecordData(delivery.id);
    });
    // refetchData();
    return parseStringify("update success");
  } catch (error) {
    throw handleError(error);
  } finally {
    prisma.$disconnect();
  }
};
export const addTracking = async ({
  updateAddress,
  trackingCode,
  note,
  service,
  id,
  webappAdminId,
  webappAdminUsername,
}: // courseId,
addTrackingProps) => {
  try {
    // TODO: need to check duplicate or not
    const getShipService = await getShipServiceByName(service);

    const res = await prisma.delivery.update({
      where: {
        // webappOrderId: webAppOrderId,
        id: id,
      },
      data: {
        type: "ship",
        status: "success",
        updatedAddress: updateAddress,
        note: note,
        updatedAt: new Date(),

        trackingCode: trackingCode,
        DeliverShipService: { connect: { id: getShipService!.id } },
        webappAdminId,
        webappAdminUsername,
      },
    });
    // await addRecordData(id);

    // refetchData();
    return parseStringify(res);
  } catch (error) {
    throw handleError(error);
  } finally {
    prisma.$disconnect();
  }
};
export const receiveOrder = async ({
  note,
  id,
  webappAdminId,
  webappAdminUsername,
}: Pick<
  addTrackingProps,
  "note" | "id" | "webappAdminId" | "webappAdminUsername"
>) => {
  try {
    const res = await prisma.delivery.update({
      where: {
        id: id,
      },
      data: {
        type: "pickup",
        status: "success",
        // updatedAddress: updateAddress,
        note: note,
        updatedAt: new Date().toISOString(),
        webappAdminId,
        webappAdminUsername,
      },
    });
    await addRecordData(id);

    // refetchData();
    return parseStringify(res);
    throw "not found doc id";
  } catch (error) {
    throw handleError(error);
  } finally {
    prisma.$disconnect();
  }
};

export const updateDeliver = async ({
  note,
  id,
  webappAdminId,
  webappAdminUsername,
  trackingNumber,
  delivery,
}: updateTrackingProps) => {
  try {
    const data: Record<string, any> = {
      note: note,
      updatedAt: new Date().toISOString(),
      webappAdminId,
      webappAdminUsername,
      trackingCode: trackingNumber,
    };
    if (delivery) {
      const getShipService = await getShipServiceByName(delivery);
      data["DeliverShipService"] = { connect: { id: getShipService!.id } };
    }
    const res = await prisma.delivery.update({
      where: {
        id: id,
      },
      data: data,
    });
    return parseStringify(res);
  } catch (error) {
    throw handleError(error);
  } finally {
    prisma.$disconnect();
  }
};

export const changeType = async ({
  type,
  id,
}: Pick<NonNullable<deliveryPrismaProps>, "type" | "id">) => {
  try {
    // TODO: need admin id
    // const updatedAddress = type === "pickup" ? "รับที่สถาบัน" : "";
    const res = await prisma.delivery.update({
      where: {
        // webappOrderId: webAppOrderId,
        id: id,
      },
      data: {
        type: type,
        status: "waiting",
        // updatedAddress,iy[]
      },
    });
    // refetchData();
    return parseStringify(res);
  } catch (error) {
    console.error(error);
    throw handleError(error);
  } finally {
    prisma.$disconnect();
  }
};

const createDelivery = async ({
  data,
  courses,
}: {
  data: Parameters<typeof prisma.delivery.create>[0]["data"];
  courses: courseProps[];
}) => {
  try {
    // const demoCourse = [1579, 3863];
    const webappCourseId = data.webappCourseId
      ?.split(",")
      .map((d) => parseInt(d));

    // const getCourse = await getCourseByWebappId(demoCourse);
    const getCourse = await getCourseByWebappId(webappCourseId!);
    const groupCourse: Record<
      string,
      Awaited<ReturnType<typeof prisma.course.findFirst>>
    > = {};
    getCourse?.forEach((course) => {
      groupCourse[course.webappCourseId!.toString()] = course;
    });

    const relationCourse: {
      webappOrderId: number;
      webappCourseId: number;
      Course: { connect: { id: number } } | undefined;
    }[] = [];

    const relationWebappCourse: {
      WebappCourse: {
        connectOrCreate: {
          where: {
            webappCourseId: number;
          };
          create: {
            webappCourseId: number;
            name: string;
            term: string;
          };
        };
      };
    }[] = [];

    courses.forEach((c) => {
      relationWebappCourse.push({
        WebappCourse: {
          connectOrCreate: {
            where: {
              webappCourseId: c.id,
            },
            create: {
              webappCourseId: c.id,
              name: c.course,
              term: c.term,
            },
          },
        },
      });
    });

    // demoCourse?.forEach((courseId) => {
    webappCourseId?.forEach((courseId) => {
      const course = groupCourse[courseId];
      relationCourse.push({
        webappOrderId: data.webappOrderId,
        webappCourseId: courseId,
        Course: course ? { connect: { id: course?.id } } : undefined,
      });

      return course;
    });
    // console.log("relationCourse", relationCourse);
    const res = await prisma.delivery.create({
      data: {
        ...data,
        Delivery_WebappCourse: {
          create: relationWebappCourse,
        },
        Delivery_Course: {
          create: relationCourse,
        },
      },
    });
    // console.log("create Tracking res", res);
    return parseStringify(res);
  } catch (error) {
    console.error(error);
    throw handleError(error);
  } finally {
    prisma.$disconnect();
  }
};

export const testFn = async () => {
  const resData = await axios({
    method: "GET",
    url: `${B_END_POINT}/api/deliver?start-id=${27429}&branch=${`ODM`}`,
    headers: {
      "B-API-KEY": B_API_KEY,
    },
  });
  const findData = resData.data.find((d: any) => d.id === 27430);
  console.log("findData", findData);

  const deliver = findData as deliveryProps;
  const type = deliver.note?.includes("รับที่สถาบัน") ? "pickup" : "ship";
  const res = await createDelivery({
    data: {
      status: "waiting",
      type,
      approved: deliver.last_updated,
      webappOrderId: deliver.id,
      updatedAddress: `${deliver.member} ${deliver.note} โทร. ${deliver.mobile}`,
      // updatedAddress: deliver.note,
      branch: deliver.branch,
      member: deliver.member,
      webappCourseId: deliver.courses.map((course) => course.id).toString(),
      mobile: deliver.mobile,
    },
    courses: deliver.courses,
  });

  const getDataById = await getDeliverByIds([res.id]);
  const data = getDataById[0];
  for (let index = 0; index < data.Delivery_Course.length; index++) {
    const deliveryCourse = data.Delivery_Course[index];
    const findBook = deliveryCourse.Course?.CourseLesson?.find((lesson) => {
      return lesson.LessonOnDocumentBook.length > 0;
    });
    if (findBook) {
      await addBookTransactionAction({
        startDate: data.approved!,
        endDate: data.approved!,
        detail: data.type,
        qty: -1,
        bookId: findBook.LessonOnDocumentBook[0].bookId,
      });
    }
  }
};

export const updateDataByBranch = async ({
  branch,
  startId,
}: {
  startId: number;
  branch: "ODM" | "KMITL";
}) => {
  try {
    const res = await axios({
      method: "GET",
      url: `${B_END_POINT}/api/deliver?start-id=${startId}&branch=${branch}`,
      headers: {
        "B-API-KEY": B_API_KEY,
      },
    });
    const orderData = _.orderBy(res.data, ["id"], ["asc"]);
    for (let index = 0; index < orderData.length; index++) {
      const deliver = orderData[index] as deliveryProps;
      const type = deliver.note?.includes("รับที่สถาบัน") ? "pickup" : "ship";
      try {
        const res = await createDelivery({
          data: {
            status: "waiting",
            type,
            approved: deliver.last_updated,
            webappOrderId: deliver.id,
            updatedAddress: `${deliver.member} ${deliver.note} โทร. ${deliver.mobile}`,
            // updatedAddress: deliver.note,
            branch: deliver.branch,
            member: deliver.member,
            webappCourseId: deliver.courses
              .map((course) => course.id)
              .toString(),
            mobile: deliver.mobile,
          },
          courses: deliver.courses,
        });
        const getDataById = await getDeliverByIds([res.id]);

        const data = getDataById[0];
        for (let index = 0; index < data.Delivery_Course.length; index++) {
          const deliveryCourse = data.Delivery_Course[index];
          const findBook = deliveryCourse.Course?.CourseLesson?.find(
            (lesson) => {
              return lesson.LessonOnDocumentBook.length > 0;
            }
          );
          if (findBook) {
            await addBookTransactionAction({
              startDate: data.approved!,
              endDate: data.approved!,
              detail: data.type,
              qty: -1,
              bookId: findBook.LessonOnDocumentBook[0].bookId,
            });
          }
        }
      } catch (error) {
        console.error(handleError(error));
      }
      // console.log("done", deliver.id);
    }

    return parseStringify(res.data as deliveryPrismaProps[]);
  } catch (error) {
  } finally {
    prisma.$disconnect();
  }
};

export const testAddBook = async () => {
  try {
    const res = await createDelivery({
      data: {
        status: "waiting",
        type: "pickup",
        approved: "2024-09-17T03:06:50.176Z",
        webappOrderId: 99999,
        updatedAddress: "test",
        branch: "ODM",
        member: "Pokk",
        webappCourseId: [3863].toString(),
        mobile: "0955120247",
      },
      courses: [
        {
          id: 3863,
          course: "Strength CE (KU) final",
          term: "final-a 1/2567",
        },
      ],
    });

    const getDataById = await getDeliverByIds([res.id]);
    const data = getDataById[0];
    for (let index = 0; index < data.Delivery_Course.length; index++) {
      const deliveryCourse = data.Delivery_Course[index];
      const findBook = deliveryCourse.Course?.CourseLesson?.find((lesson) => {
        return lesson.LessonOnDocumentBook.length > 0;
      });
      if (findBook) {
        await addBookTransactionAction({
          startDate: new Date(),
          endDate: new Date(),
          detail: data.type,
          qty: -1,
          bookId: findBook.LessonOnDocumentBook[0].bookId,
          deliverId: res.id,
        });
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};
