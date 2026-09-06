import {
  plenoRepository,
  PlenoRepository,
} from "@/repositories/pleno.repository";
import {
  CreatePlenoInput,
  UpdatePlenoInput,
  AddAttendeeInput,
  UpdateAsesiPlenoInput,
} from "@/schemas/pleno.schema";
import { NotFoundError, InvariantError } from "@/error/index";

export class PlenoService {
  constructor(private repo: PlenoRepository = plenoRepository) {}

  async getList() {
    return await this.repo.getList();
  }

  async getById(id: number) {
    const pleno = await this.repo.getById(id);
    if (!pleno) throw new NotFoundError("Jadwal Pleno tidak ditemukan");
    return pleno;
  }

  async create(data: CreatePlenoInput) {
    const pleno = await this.repo.create(data);
    if (!pleno) throw new InvariantError("Gagal membuat jadwal pleno baru");
    return pleno;
  }

  async update(id: number, data: UpdatePlenoInput) {
    await this.getById(id);
    const pleno = await this.repo.update(id, data);
    if (!pleno) throw new InvariantError("Gagal memperbarui jadwal pleno");
    return pleno;
  }

  async delete(id: number) {
    await this.getById(id);
    const pleno = await this.repo.delete(id);
    if (!pleno) throw new InvariantError("Gagal membatalkan jadwal pleno");
    return pleno;
  }

  async addAsesiBulk(plenoBatchId: number, pengajuanIds: number[]) {
    await this.getById(plenoBatchId);
    const result = await this.repo.addAsesiBulk(plenoBatchId, pengajuanIds);
    if (!result)
      throw new InvariantError("Gagal menambahkan asesi ke batch pleno");
    return result;
  }

  async updateAsesi(asesiId: number, data: UpdateAsesiPlenoInput) {
    const result = await this.repo.updateAsesi(asesiId, data);
    if (!result)
      throw new InvariantError("Gagal memperbarui status pleno asesi");
    return result;
  }

  async addAttendee(plenoBatchId: number, data: AddAttendeeInput) {
    await this.getById(plenoBatchId);
    const result = await this.repo.addAttendee(plenoBatchId, data);
    if (!result) throw new InvariantError("Gagal menambahkan peserta rapat");
    return result;
  }

  async removeAttendee(attendeeId: number) {
    const result = await this.repo.removeAttendee(attendeeId);
    if (!result) throw new InvariantError("Gagal menghapus peserta rapat");
    return result;
  }
}

export const plenoService = new PlenoService();
