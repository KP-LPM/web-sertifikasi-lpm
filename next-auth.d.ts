import { Role } from "@/types/types";
import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
    namaLengkap?: string;
    isVerified?: boolean;
    asalAsesor?: string | null;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
      namaLengkap?: string;
      isVerified?: boolean;
      asalAsesor?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    username: string;
    namaLengkap?: string;
    isVerified?: boolean;
    asalAsesor?: string | null;
  }
}
