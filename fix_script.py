import re

file_path = r'd:\COLLEGE\KP\WEB SERTIFIKASI\web-sertifikasi-lpm\src\app\asesi\pengajuanskema\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

fields_to_lock = [
    ('namaLengkap', 'value={namaLengkap}'),
    ('tempatLahir', 'value={tempatLahir}'),
    ('tanggalLahir', 'value={tanggalLahir}'),
    ('nik', 'value={nik}'),
    ('kewarganegaraan', 'value={kewarganegaraan}'),
    ('provinsi', 'value={provinsi}'),
    ('kota', 'value={kota}'),
    ('alamat', 'value={alamat}'),
    ('kodePos', 'value={kodePos}'),
    ('noHp', 'value={noTelp}'),
    ('pendidikanTerakhir', 'value={pendidikanTerakhir}'),
    ('pekerjaan', 'value={pekerjaan}'),
    ('institusiPerusahaan', 'value={institusiPerusahaan}'),
    ('jabatan', 'value={jabatan}'),
    ('emailInstitusi', 'value={emailInstitusi}'),
    ('telpInstitusi', 'value={telpInstitusi}'),
    ('faxInstitusi', 'value={faxInstitusi}'),
    ('alamatInstitusi', 'value={alamatInstitusi}'),
    ('kodePosInstitusi', 'value={kodePosInstitusi}')
]

for key, value_str in fields_to_lock:
    parts = content.split(value_str)
    if len(parts) > 1:
        new_content = parts[0]
        for i in range(1, len(parts)):
            part = parts[i]
            if 'onChange' in part[:200]:
                part = part.replace('onChange=', f'disabled={{lockedFields.{key}}} onChange=', 1)
            new_content += value_str + part
        content = new_content

content = content.replace('name="jenisKelamin"\n                          value="Laki-laki"', 'name="jenisKelamin"\n                          disabled={lockedFields.jenisKelamin}\n                          value="Laki-laki"')
content = content.replace('name="jenisKelamin"\n                          value="Perempuan"', 'name="jenisKelamin"\n                          disabled={lockedFields.jenisKelamin}\n                          value="Perempuan"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Fields disabled successfully')
