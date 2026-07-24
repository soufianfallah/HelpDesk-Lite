import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    deleteUser: { enabled: false },
    additionalFields: {
      role: {
        type: ["CLIENT", "ADMIN"],
        required: false,
        defaultValue: "CLIENT",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (process.env.ADMIN_EMAIL && user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
            await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
