import { prisma } from "@automation/db";

export const decrementUserBalance = async (userId: string, amount: number) => {
  try {
    const res = await prisma.userBalance.updateMany({
      where: {
        userId: userId,
        credits: { gte: amount },
      },
      data: { credits: { decrement: amount } },
    });

    return {
      success: res.count > 0,
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
};

export const addUserBalance = async (userId: string, amount: number) => {
  try {
    const res = await prisma.userBalance.updateMany({
      where: {
        userId: userId,
      },
      data: { credits: { increment: amount } },
    });
    return {
      success: res.count > 0,
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
};
