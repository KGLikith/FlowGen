import { prisma } from "@automation/db";
import { ALG } from "../schema/workflow";
import crypto from "crypto";

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

  public static async createCredential(
    payload: { name: string; value: string },
    userId: string
  ) {
    try {
      const key = process.env.ENCRYPTION_KEY;
      if (!key) {
        throw new Error("Encryption key not set in environment variables.");
      }
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(ALG, Buffer.from(key, "hex"), iv);
      let encrypted = cipher.update(payload.value);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      const hashedPassword =
        iv.toString("hex") + ":" + encrypted.toString("hex");

      const credential = await prisma.credential.create({
        data: {
          user: { connect: { clerkId: userId } },
          name: payload.name,
          value: hashedPassword,
        },
      });
      if (!credential) return false;
      return true;
    } catch (error) {
      console.error("Error creating credential:", error);
      throw new Error("Error creating credential. Please try again later.");
    }
  }

  public static async deleteCredential(id: string) {
    try {
      await prisma.credential.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting credential:", error);
      throw new Error("Error deleting credential. Please try again later.");
    }
  }

  public static async getCredentials(clerkId: string) {
    try {
      const credentials = await prisma.credential.findMany({
        where: {
          user: {
            clerkId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return credentials;
    } catch (error) {
      throw new Error("Error fetching credentials. Please try again later.");
    }
  }

  public static async getCredentialById(id: string) {
    try {
      const key = process.env.ENCRYPTION_KEY;
      if (!key) {
        throw new Error("Encryption key not set in environment variables.");
      }
      const credential = await prisma.credential.findUnique({
        where: { id },
      });
      const textParts = credential?.value.split(":");
      if (!textParts || textParts.length !== 2) {
        throw new Error("Invalid credential format.");
      }
      const iv = Buffer.from(textParts.shift() as string, "hex");
      const encryptedText = Buffer.from(textParts.join(":"), "hex");
      const decipher = crypto.createDecipheriv(
        ALG,
        Buffer.from(key, "hex"),
        iv
      );
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      if (credential) credential.value = decrypted.toString();
      return credential;
    } catch (error) {
      throw new Error("Error fetching credential. Please try again later.");
    }
  }
}
