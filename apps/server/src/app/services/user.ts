import { prisma } from "@automation/db";

export default class userService {
  public static async getUserByClerkId(clerkId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId },
      });
      return user;
    } catch (err) {
      return null;
    }
  }

  public static async upsertUser(userId: string) {
    try {
      await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          UserBalance: {
            create: {
              credits: 10,
            },
          },
        },
      });
    } catch (err) {
      console.error("Error creating user:", err);
      return null;
    }
  }
}
