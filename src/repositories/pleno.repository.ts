import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  CreatePlenoInput,
  UpdatePlenoInput,
  AddAttendeeInput,
  UpdateAsesiPlenoInput,
} from "@/schemas/pleno.schema";

export class PlenoRepository {
  async getList() {
    return await db.pleno_batch.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        no_sk: true,
        tanggal: true,
        alamat: true,
        status: true,
        link_surat_berita_pleno: true,
        link_surat_keputusan_direktur: true,
        link_surat_blanko_bnsp: true,
        created_at: true,
        pleno_batch_skema: {
          select: {
            id: true,
            pleno_batch_id: true,
            skema_id: true,
            master_skema: {
              select: {
                id: true,
                namaSkema: true,
                kodeSkema: true,
              },
            },
          },
        },
        pleno_attendee: {
          select: {
            id: true,
            pleno_batch_id: true,
            user_id: true,
            role: true,
            nama: true,
          },
        },
        pleno_asesi: {
          select: {
            id: true,
            pleno_batch_id: true,
            pengajuan_id: true,
            asesor_id: true,
            rekomendasi_asesor: true,
            status_pleno: true,
            catatan: true,
            pengajuan_skema: {
              select: {
                id: true,
                skemaId: true,
                userId: true,
                status: true,
                skema: {
                  select: {
                    id: true,
                    namaSkema: true,
                    kodeSkema: true,
                  },
                },
                dataPribadi: {
                  select: {
                    namaLengkap: true,
                    nik: true,
                    noHp: true,
                  },
                },
                user: {
                  select: {
                    username: true,
                    profil: {
                      select: {
                        namaLengkap: true,
                      },
                    },
                  },
                },
              },
            },
            users: {
              select: {
                username: true,
                profil: {
                  select: {
                    namaLengkap: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getById(id: number) {
    return await db.pleno_batch.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        no_sk: true,
        tanggal: true,
        alamat: true,
        status: true,
        link_surat_berita_pleno: true,
        link_surat_keputusan_direktur: true,
        link_surat_blanko_bnsp: true,
        created_at: true,
        pleno_batch_skema: {
          select: {
            id: true,
            pleno_batch_id: true,
            skema_id: true,
            master_skema: {
              select: {
                id: true,
                namaSkema: true,
                kodeSkema: true,
              },
            },
          },
        },
        pleno_attendee: {
          select: {
            id: true,
            pleno_batch_id: true,
            user_id: true,
            role: true,
            nama: true,
          },
        },
        pleno_asesi: {
          select: {
            id: true,
            pleno_batch_id: true,
            pengajuan_id: true,
            asesor_id: true,
            rekomendasi_asesor: true,
            status_pleno: true,
            catatan: true,
            no_sertifikat: true,
            issue_date: true,
            gdrive_url: true,
            status: true,
            pengajuan_skema: {
              select: {
                id: true,
                nomorPengajuan: true,
                skemaId: true,
                userId: true,
                status: true,
                dataPribadi: {
                  select: {
                    namaLengkap: true,
                    nik: true,
                    noHp: true,
                  },
                },
                skema: {
                  select: {
                    id: true,
                    namaSkema: true,
                    kodeSkema: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                    profil: {
                      select: {
                        namaLengkap: true,
                      },
                    },
                  },
                },
              },
            },
            users: {
              select: {
                id: true,
                username: true,
                email: true,
                profil: {
                  select: {
                    namaLengkap: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreatePlenoInput) {
    const { skema_ids, attendees, pengajuan_ids, ...restData } = data;

    return await db.$transaction(async (tx) => {
      const pleno = await tx.pleno_batch.create({
        data: {
          ...restData,
          pleno_batch_skema: skema_ids?.length
            ? { create: skema_ids.map((skemaId) => ({ skema_id: skemaId })) }
            : undefined,
          pleno_attendee: attendees?.length
            ? {
                create: attendees.map((att) => ({
                  user_id: att.user_id || null,
                  role: att.role,
                  nama: att.nama,
                })),
              }
            : undefined,
        },
        select: {
          id: true,
          title: true,
          no_sk: true,
          tanggal: true,
          alamat: true,
          status: true,
          link_surat_berita_pleno: true,
          link_surat_keputusan_direktur: true,
          link_surat_blanko_bnsp: true,
          created_at: true,
          pleno_batch_skema: {
            select: {
              id: true,
              pleno_batch_id: true,
              skema_id: true,
            },
          },
          pleno_attendee: {
            select: {
              id: true,
              pleno_batch_id: true,
              user_id: true,
              role: true,
              nama: true,
            },
          },
        },
      });

      if (pengajuan_ids && pengajuan_ids.length > 0) {
        const pengajuans = await tx.pengajuanSkema.findMany({
          where: { id: { in: pengajuan_ids } },
          select: {
            id: true,
            jadwal_asesmen_peserta: {
              select: {
                jadwal_asesmen: {
                  select: {
                    asesor_id: true,
                  },
                },
              },
            },
            hasil_asesmen: {
              select: {
                hasil: true,
                catatan: true,
              },
            },
            verifikasi_pengajuan: {
              select: {
                assigned_asesor_id: true,
              },
            },
          },
        });

        const dataToInsert = pengajuans.map((p) => {
          const asesorId =
            p.jadwal_asesmen_peserta?.[0]?.jadwal_asesmen?.asesor_id ||
            p.verifikasi_pengajuan?.assigned_asesor_id;

          let rekomendasi = null;
          if (p.hasil_asesmen?.hasil) {
            if (p.hasil_asesmen.hasil.toLowerCase() === "kompeten") {
              rekomendasi = "K";
            } else if (p.hasil_asesmen.hasil.toLowerCase() === "belum kompeten") {
              rekomendasi = "BK";
            } else {
              rekomendasi = p.hasil_asesmen.hasil;
            }
          }

          return {
            pleno_batch_id: pleno.id,
            pengajuan_id: p.id,
            asesor_id: asesorId || null,
            rekomendasi_asesor: rekomendasi,
            catatan: p.hasil_asesmen?.catatan || null,
          };
        });

        if (dataToInsert.length > 0) {
          await tx.pleno_asesi.createMany({
            data: dataToInsert,
            skipDuplicates: true,
          });
        }
      }

      return pleno;
    });
  }

  async update(
    id: number,
    data: UpdatePlenoInput,
    tx: Prisma.TransactionClient | typeof db = db,
  ) {
    const { skema_ids, attendees, pengajuan_ids, status, ...restData } = data;

    const performUpdate = async (client: Prisma.TransactionClient) => {
      const pleno = await client.pleno_batch.update({
        where: { id },
        data: {
          ...restData,
          ...(status !== undefined ? { status } : {}),
          ...(skema_ids !== undefined && {
            pleno_batch_skema: {
              deleteMany: {},
              create: skema_ids.map((skemaId) => ({ skema_id: skemaId })),
            },
          }),
          ...(attendees !== undefined && {
            pleno_attendee: {
              deleteMany: {},
              create: attendees.map((att) => ({
                user_id: att.user_id || null,
                role: att.role,
                nama: att.nama,
              })),
            },
          }),
        },
        select: {
          id: true,
          title: true,
          no_sk: true,
          tanggal: true,
          alamat: true,
          status: true,
          link_surat_berita_pleno: true,
          link_surat_keputusan_direktur: true,
          link_surat_blanko_bnsp: true,
          created_at: true,
          pleno_batch_skema: {
            select: {
              id: true,
              pleno_batch_id: true,
              skema_id: true,
            },
          },
          pleno_attendee: {
            select: {
              id: true,
              pleno_batch_id: true,
              user_id: true,
              role: true,
              nama: true,
            },
          },
        },
      });

      if (pengajuan_ids !== undefined) {
        await client.pleno_asesi.deleteMany({
          where: { pleno_batch_id: id },
        });
        if (pengajuan_ids.length > 0) {
          const pengajuans = await client.pengajuanSkema.findMany({
            where: { id: { in: pengajuan_ids } },
            select: {
              id: true,
              jadwal_asesmen_peserta: {
                select: {
                  jadwal_asesmen: {
                    select: {
                      asesor_id: true,
                    },
                  },
                },
              },
              hasil_asesmen: {
                select: {
                  hasil: true,
                  catatan: true,
                },
              },
              verifikasi_pengajuan: {
                select: {
                  assigned_asesor_id: true,
                },
              },
            },
          });

          const dataToInsert = pengajuans.map((p) => {
            const asesorId =
              p.jadwal_asesmen_peserta?.[0]?.jadwal_asesmen?.asesor_id ||
              p.verifikasi_pengajuan?.assigned_asesor_id;

            let rekomendasi = null;
            if (p.hasil_asesmen?.hasil) {
              if (p.hasil_asesmen.hasil.toLowerCase() === "kompeten") {
                rekomendasi = "K";
              } else if (p.hasil_asesmen.hasil.toLowerCase() === "belum kompeten") {
                rekomendasi = "BK";
              } else {
                rekomendasi = p.hasil_asesmen.hasil;
              }
            }

            return {
              pleno_batch_id: id,
              pengajuan_id: p.id,
              asesor_id: asesorId || null,
              rekomendasi_asesor: rekomendasi,
              catatan: p.hasil_asesmen?.catatan || null,
            };
          });

          if (dataToInsert.length > 0) {
            await client.pleno_asesi.createMany({
              data: dataToInsert,
              skipDuplicates: true,
            });
          }
        }
      }

      return pleno;
    };

    if (tx === db) {
      return await db.$transaction(async (t) => performUpdate(t));
    }
    return await performUpdate(tx);
  }

  async delete(id: number) {
    return await db.pleno_batch.delete({ where: { id } });
  }

  // --- ASESI ---

  async getPengajuanMenunggu(skemaIds?: number[], pengajuanIds?: number[]) {
    return await db.pengajuanSkema.findMany({
      where: {
        status: { equals: "Menunggu Pleno", mode: "insensitive" },
        ...(skemaIds && skemaIds.length > 0
          ? { skemaId: { in: skemaIds } }
          : {}),
        ...(pengajuanIds && pengajuanIds.length > 0
          ? { id: { in: pengajuanIds } }
          : {}),
      },
      select: {
        id: true,
        nomorPengajuan: true,
        userId: true,
        skemaId: true,
        tuk: true,
        jenisMetode: true,
        status: true,
        tglPengajuan: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profil: {
              select: {
                namaLengkap: true,
              },
            },
          },
        },
        dataPribadi: {
          select: {
            id: true,
            namaLengkap: true,
            nik: true,
            noHp: true,
          },
        },
        skema: {
          select: {
            id: true,
            namaSkema: true,
            kodeSkema: true,
          },
        },
        hasil_asesmen: {
          select: {
            id: true,
            hasil: true,
            catatan: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAsesiByPlenoBatchId(plenoBatchId: number) {
    return await db.pleno_asesi.findMany({
      where: { pleno_batch_id: plenoBatchId },
      select: {
        id: true,
        pleno_batch_id: true,
        pengajuan_id: true,
        asesor_id: true,
        rekomendasi_asesor: true,
        status_pleno: true,
        catatan: true,
        no_sertifikat: true,
        issue_date: true,
        gdrive_url: true,
        status: true,
        pengajuan_skema: {
          select: {
            id: true,
            nomorPengajuan: true,
            userId: true,
            skemaId: true,
            status: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                profil: {
                  select: {
                    namaLengkap: true,
                  },
                },
              },
            },
            dataPribadi: {
              select: {
                id: true,
                namaLengkap: true,
                nik: true,
                noHp: true,
              },
            },
            skema: {
              select: {
                id: true,
                namaSkema: true,
                kodeSkema: true,
              },
            },
            hasil_asesmen: {
              select: {
                id: true,
                hasil: true,
                catatan: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            profil: {
              select: {
                namaLengkap: true,
              },
            },
          },
        },
      },
    });
  }

  async addAsesiBulk(plenoBatchId: number, pengajuanIds: number[]) {
    const pengajuans = await db.pengajuanSkema.findMany({
      where: { id: { in: pengajuanIds } },
      select: {
        id: true,
        jadwal_asesmen_peserta: {
          select: {
            jadwal_asesmen: {
              select: {
                asesor_id: true,
              },
            },
          },
        },
        hasil_asesmen: {
          select: {
            hasil: true,
            catatan: true,
          },
        },
        verifikasi_pengajuan: {
          select: {
            assigned_asesor_id: true,
          },
        },
      },
    });

    const dataToInsert = pengajuans.map((p) => {
      const asesorId =
        p.jadwal_asesmen_peserta?.[0]?.jadwal_asesmen?.asesor_id ||
        p.verifikasi_pengajuan?.assigned_asesor_id;

      // Default mapping for "Kompeten" (K) or "Belum Kompeten" (BK) based on text.
      let rekomendasi = null;
      if (p.hasil_asesmen?.hasil) {
        if (p.hasil_asesmen.hasil.toLowerCase() === "kompeten") {
          rekomendasi = "K";
        } else if (p.hasil_asesmen.hasil.toLowerCase() === "belum kompeten") {
          rekomendasi = "BK";
        } else {
          rekomendasi = p.hasil_asesmen.hasil;
        }
      }

      return {
        pleno_batch_id: plenoBatchId,
        pengajuan_id: p.id,
        asesor_id: asesorId || null,
        rekomendasi_asesor: rekomendasi,
        catatan: p.hasil_asesmen?.catatan || null,
      };
    });

    return await db.pleno_asesi.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });
  }

  async updateAsesi(asesiId: number, data: UpdateAsesiPlenoInput) {
    return await db.pleno_asesi.update({
      where: { id: asesiId },
      data: {
        status_pleno: data.status_pleno,
        catatan: data.catatan,
      },
    });
  }

  // --- ATTENDEE ---

  async addAttendee(plenoBatchId: number, data: AddAttendeeInput) {
    return await db.pleno_attendee.create({
      data: {
        pleno_batch_id: plenoBatchId,
        user_id: data.user_id,
        role: data.role,
        nama: data.nama,
      },
    });
  }

  async removeAttendee(attendeeId: number) {
    return await db.pleno_attendee.delete({ where: { id: attendeeId } });
  }
}

export const plenoRepository = new PlenoRepository();
