import {
  userGuideRepository,
  UserGuideRepository,
} from "@/repositories/user-guide.repository";
import { UpsertUserGuideInput } from "@/schemas/user-guide.schema";

export function normalizeGuideRole(role?: string | null): "asesi" | "asesor" | "admin" {
  const r = (role || "").toLowerCase();
  if (r === "asesi") return "asesi";
  if (r === "asesor") return "asesor";
  return "admin";
}

export class UserGuideService {
  constructor(private repo: UserGuideRepository = userGuideRepository) {}

  async getAll() {
    return await this.repo.getAll();
  }

  async getByUserRole(rawRole?: string | null) {
    const normalizedRole = normalizeGuideRole(rawRole);
    const guide = await this.repo.getByRole(normalizedRole);
    return (
      guide || {
        role: normalizedRole,
        link_ppt: "",
      }
    );
  }

  async upsert(data: UpsertUserGuideInput) {
    return await this.repo.upsert(data);
  }
}

export const userGuideService = new UserGuideService();

