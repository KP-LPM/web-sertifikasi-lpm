import { db } from "@/lib/db";
import { UpsertUserGuideInput } from "@/schemas/user-guide.schema";

export class UserGuideRepository {
  async getAll() {
    return await db.user_guide.findMany({
      orderBy: { id: "asc" },
    });
  }

  async getByRole(role: string) {
    return await db.user_guide.findUnique({
      where: { role },
    });
  }

  async upsert(data: UpsertUserGuideInput) {
    return await db.user_guide.upsert({
      where: { role: data.role },
      update: { link_ppt: data.link_ppt },
      create: {
        role: data.role,
        link_ppt: data.link_ppt,
      },
    });
  }
}

export const userGuideRepository = new UserGuideRepository();

