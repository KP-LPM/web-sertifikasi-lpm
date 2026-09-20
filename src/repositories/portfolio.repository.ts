import { db } from "@/lib/db";
import {
  CreatePortfolioInput,
  UpdatePortfolioInput,
  VerifikasiPortfolioInput,
} from "@/schemas/portfolio.schema";

export class PortfolioRepository {
  async getByAsesorId(asesorId: number) {
    return await db.portfolio_asesor.findMany({
      where: { asesor_id: asesorId },
      include: {
        master_skema: {
          select: { namaSkema: true, kodeSkema: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  async getById(id: number) {
    return await db.portfolio_asesor.findUnique({
      where: { id },
      include: {
        master_skema: {
          select: { namaSkema: true, kodeSkema: true },
        },
      },
    });
  }

  async create(asesorId: number, data: CreatePortfolioInput) {
    return await db.portfolio_asesor.create({
      data: {
        asesor_id: asesorId,
        skema_id: data.skema_id ? Number(data.skema_id) : null,
        nama_dokumen: data.nama_dokumen,
        status_asesor: data.status_asesor ?? null,
        alamat_lsp: data.alamat_lsp ?? null,
        tanggal: data.tanggal ? new Date(data.tanggal) : null,
        link_portfolio: data.link_portfolio ?? null,
        link_surat_peminjaman: data.link_surat_peminjaman ?? null,
        link_surat_jawaban: data.link_surat_jawaban ?? null,
        status: data.status ?? "Menunggu Verifikasi",
      },
    });
  }

  async update(id: number, data: UpdatePortfolioInput) {
    return await db.portfolio_asesor.update({
      where: { id },
      data: {
        ...(data.skema_id !== undefined && {
          skema_id: data.skema_id ? Number(data.skema_id) : null,
        }),
        ...(data.nama_dokumen !== undefined && {
          nama_dokumen: data.nama_dokumen,
        }),
        ...(data.status_asesor !== undefined && { status_asesor: data.status_asesor }),
        ...(data.alamat_lsp !== undefined && { alamat_lsp: data.alamat_lsp }),
        ...(data.tanggal !== undefined && {
          tanggal: data.tanggal ? new Date(data.tanggal) : null,
        }),
        ...(data.link_portfolio !== undefined && { link_portfolio: data.link_portfolio }),
        ...(data.link_surat_peminjaman !== undefined && { link_surat_peminjaman: data.link_surat_peminjaman }),
        ...(data.link_surat_jawaban !== undefined && { link_surat_jawaban: data.link_surat_jawaban }),
      },
    });
  }

  async delete(id: number) {
    return await db.portfolio_asesor.delete({
      where: { id },
    });
  }

  async updateVerifikasi(id: number, data: VerifikasiPortfolioInput) {
    return await db.portfolio_asesor.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.catatan_admin !== undefined && {
          catatan_admin: data.catatan_admin,
        }),
      },
    });
  }
}

export const portfolioRepository = new PortfolioRepository();
