import { db } from "@/lib/db";
import {
  CreateSkemaInput,
  UpdateSkemaInput,
  PersyaratanDasarInput,
  UnitKompetensiInput,
  BuktiAdministratifInput,
  ElemenKompetensiInput,
} from "@/schemas/skema.schema";

export class SkemaRepository {
  async getSkemaList(isAdmin: boolean = false) {
    return await db.masterSkema.findMany({
      where: isAdmin ? undefined : { statusAktif: true },
      include: {
        persyaratanDasar: {
          orderBy: { urutan: "asc" },
        },
        master_bukti_administratif: {
          where: { isAktif: true },
          orderBy: { urutan: "asc" },
        },
        unitKompetensi: {
          orderBy: { urutan: "asc" },
          include: {
            elemenKompetensi: {
              orderBy: { urutan: "asc" },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  async getSkemaById(id: number) {
    return await db.masterSkema.findUnique({
      where: { id: Number(id) },
      include: {
        persyaratanDasar: true,
        master_bukti_administratif: true,
        unitKompetensi: {
          include: {
            elemenKompetensi: true,
          },
        },
      },
    });
  }

  async isSkemaExist(id: number) {
    return await db.masterSkema.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        namaSkema: true,
        statusAktif: true,
      },
    });
  }

  async createSkema(data: CreateSkemaInput) {
    const {
      nomorSertifikat,
      nomorRegistrasi,
      konfigurasiSoalId,
      persyaratanDasar,
      buktiAdministratif,
      unitKompetensi,
      ...restData
    } = data;

    return await db.masterSkema.create({
      data: {
        ...restData,
        nomor_sertifikat: nomorSertifikat,
        nomor_registrasi: nomorRegistrasi,
        konfigurasi_soal_id: konfigurasiSoalId,

        persyaratanDasar: persyaratanDasar?.length
          ? {
              create: persyaratanDasar.map((item, index) => ({
                namaDokumen: item.namaDokumen || "-",
                deskripsi: item.deskripsi || "-",
                urutan: index + 1,
              })),
            }
          : undefined,

        master_bukti_administratif: buktiAdministratif?.length
          ? {
              create: buktiAdministratif.map((item, index) => ({
                namaDokumen: item.namaBukti || "-",
                urutan: index + 1,
              })),
            }
          : undefined,

        unitKompetensi: unitKompetensi?.length
          ? {
              create: unitKompetensi.map((unit, unitIndex) => ({
                kodeUnit: unit.kodeUnit || "-",
                judulUnit: unit.judulUnit || "-",
                urutan: unitIndex + 1,

                elemenKompetensi: unit.elemen?.length
                  ? {
                      create: unit.elemen.map((el, elIndex) => ({
                        namaElemen: el.namaElemen || "-",
                        kriteriaUnjukKerja: el.kriteriaUnjukKerja || "-",
                        urutan: elIndex + 1,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        persyaratanDasar: true,
        master_bukti_administratif: true,
        unitKompetensi: {
          include: { elemenKompetensi: true },
        },
      },
    });
  }

  async updateSkema(id: number, data: UpdateSkemaInput) {
    const {
      nomorSertifikat,
      nomorRegistrasi,
      konfigurasiSoalId,
      persyaratanDasar,
      buktiAdministratif,
      unitKompetensi,
      ...restData
    } = data;

    return await db.masterSkema.update({
      where: { id: Number(id) },
      data: {
        ...restData,
        ...(nomorSertifikat !== undefined && {
          nomor_sertifikat: nomorSertifikat,
        }),
        ...(nomorRegistrasi !== undefined && {
          nomor_registrasi: nomorRegistrasi,
        }),
        ...(konfigurasiSoalId !== undefined && {
          konfigurasi_soal_id: konfigurasiSoalId,
        }),

        ...(persyaratanDasar && {
          persyaratanDasar: {
            deleteMany: {},
            create: persyaratanDasar.map((item, index) => ({
              namaDokumen: item.namaDokumen || "-",
              deskripsi: item.deskripsi || "-",
              urutan: index + 1,
            })),
          },
        }),

        ...(buktiAdministratif && {
          master_bukti_administratif: {
            deleteMany: {},
            create: buktiAdministratif.map((item, index) => ({
              namaDokumen: item.namaBukti || "-",
              urutan: index + 1,
            })),
          },
        }),

        ...(unitKompetensi && {
          unitKompetensi: {
            deleteMany: {},
            create: unitKompetensi.map((unit, unitIndex) => ({
              kodeUnit: unit.kodeUnit,
              judulUnit: unit.judulUnit,
              urutan: unitIndex + 1,
              elemenKompetensi: unit.elemen?.length
                ? {
                    create: unit.elemen.map((el, elIndex) => ({
                      namaElemen: el.namaElemen,
                      kriteriaUnjukKerja: el.kriteriaUnjukKerja || "-",
                      urutan: elIndex + 1,
                    })),
                  }
                : undefined,
            })),
          },
        }),
      },
      include: {
        persyaratanDasar: true,
        master_bukti_administratif: true,
        unitKompetensi: {
          include: { elemenKompetensi: true },
        },
      },
    });
  }

  async deleteSkema(id: number) {
    return await db.masterSkema.delete({
      where: { id: Number(id) },
    });
  }

  async addPersyaratanDasar(skemaId: number, data: PersyaratanDasarInput) {
    const lastItem = await db.masterPersyaratanDasar.findFirst({
      where: { skemaId },
      orderBy: { urutan: "desc" },
      select: { urutan: true },
    });

    const nextUrutan = lastItem ? lastItem.urutan + 1 : 1;

    return await db.masterPersyaratanDasar.create({
      data: {
        namaDokumen: data.namaDokumen,
        deskripsi: data.deskripsi,
        urutan: nextUrutan,
        skemaId: skemaId,
      },
    });
  }

  async updatePersyaratanDasar(
    itemId: number,
    data: Partial<PersyaratanDasarInput>,
  ) {
    return await db.masterPersyaratanDasar.update({
      where: { id: Number(itemId) },
      data: {
        ...(data.namaDokumen && { namaDokumen: data.namaDokumen }),
        ...(data.deskripsi && { deskripsi: data.deskripsi }),
      },
    });
  }

  async deletePersyaratanDasar(itemId: number) {
    return await db.masterPersyaratanDasar.delete({
      where: { id: Number(itemId) },
    });
  }

  async addBuktiAdministratif(skemaId: number, data: BuktiAdministratifInput) {
    return await db.masterBuktiAdministratif.create({
      data: {
        namaDokumen: data.namaBukti,
      },
    });
  }

  async updateBuktiAdministratif(
    itemId: number,
    data: BuktiAdministratifInput,
  ) {
    return await db.masterBuktiAdministratif.update({
      where: { id: Number(itemId) },
      data: {
        namaDokumen: data.namaBukti,
      },
    });
  }

  async deleteBuktiAdministratif(itemId: number) {
    return await db.masterBuktiAdministratif.delete({
      where: {
        id: Number(itemId),
      },
    });
  }

  async addUnitKompetensi(skemaId: number, data: UnitKompetensiInput) {
    const { elemen, ...unitData } = data;

    const lastUnit = await db.masterUnitKompetensi.findFirst({
      where: { skemaId },
      orderBy: { urutan: "desc" },
      select: { urutan: true },
    });

    const nextUrutan = lastUnit ? lastUnit.urutan + 1 : 1;

    return await db.masterUnitKompetensi.create({
      data: {
        kodeUnit: unitData.kodeUnit,
        judulUnit: unitData.judulUnit,
        urutan: nextUrutan,
        skemaId: skemaId,

        elemenKompetensi: elemen?.length
          ? {
              create: elemen.map((el, elIndex) => ({
                namaElemen: el.namaElemen,
                kriteriaUnjukKerja: el.kriteriaUnjukKerja || "-",
                urutan: elIndex + 1,
              })),
            }
          : undefined,
      },
    });
  }

  async updateUnitKompetensi(
    id: number,
    data: Partial<Omit<UnitKompetensiInput, "elemen">>,
  ) {
    return await db.masterUnitKompetensi.update({
      where: { id: Number(id) },
      data: {
        ...(data.kodeUnit && { kodeUnit: data.kodeUnit }),
        ...(data.judulUnit && { judulUnit: data.judulUnit }),
      },
    });
  }

  async deleteUnitKompetensi(id: number) {
    return await db.masterUnitKompetensi.delete({
      where: { id: Number(id) },
    });
  }

  async addElemenKompetensi(unitId: number, data: ElemenKompetensiInput) {
    const lastElemen = await db.masterElemenKompetensi.findFirst({
      where: { unitId },
      orderBy: { urutan: "desc" },
      select: { urutan: true },
    });

    return await db.masterElemenKompetensi.create({
      data: {
        unitId: unitId,
        namaElemen: data.namaElemen,
        kriteriaUnjukKerja: data.kriteriaUnjukKerja || "-",
        urutan: lastElemen ? lastElemen.urutan + 1 : 1,
      },
    });
  }

  async updateElemenKompetensi(
    id: number,
    data: Partial<ElemenKompetensiInput>,
  ) {
    return await db.masterElemenKompetensi.update({
      where: { id: Number(id) },
      data: {
        ...(data.namaElemen && { namaElemen: data.namaElemen }),
        ...(data.kriteriaUnjukKerja && {
          kriteriaUnjukKerja: data.kriteriaUnjukKerja,
        }),
      },
    });
  }

  async deleteElemenKompetensi(id: number) {
    return await db.masterElemenKompetensi.delete({
      where: { id: Number(id) },
    });
  }
}
