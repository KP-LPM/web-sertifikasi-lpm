'use client';

import React, { useState, useRef, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, LogIn, Mail, Lock, UserPlus, ArrowLeft, 
  BadgeCheck, X, Trash2, Upload, Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const SignatureCanvas = dynamic(() => import('react-signature-canvas'), { ssr: false }) as any;

export default function Login() {
  const router = useRouter();
  
  const [mode, setMode] = useState<'asesi' | 'asesor'>('asesi');
  const [isLoginView, setIsLoginView] = useState(true);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State Signature
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const signatureRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tandaTangan, setTandaTangan] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          signatureRef.current?.fromDataURL(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSignature = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        alert('Tanda tangan masih kosong!');
        return;
      }
      const dataUrl = signatureRef.current.toDataURL();
      setTandaTangan(dataUrl);
      setIsSignatureModalOpen(false);
    }
  };

  useEffect(() => {
    if (isSignatureModalOpen && tandaTangan && signatureRef.current) {
      setTimeout(() => {
        signatureRef.current?.fromDataURL(tandaTangan);
      }, 50);
    }
  }, [isSignatureModalOpen, tandaTangan]);

  // --- FUNGSI LOGIN KE NEXTAUTH ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      username: username,
      password: password,
    });

    setIsLoading(false);

    if (res?.error) {
      alert("Gagal Masuk: Username atau Password salah!");
    } else {
      alert("Berhasil Masuk!");
      router.push('/dashboard'); // Akan diarahkan ke /dashboard setelah sukses
    }
  };

  // --- FUNGSI REGISTER KE API ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    
    if (!tandaTangan) {
      alert('Tanda tangan wajib diisi!');
      return;
    }
    
    const formDataObj = new FormData(form);
    
    // Validasi konfirmasi password
    if (formDataObj.get('password') !== formDataObj.get('confirm_password')) {
      alert('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    const data = {
      role: mode,
      username: formDataObj.get('username'),
      email: formDataObj.get('email'),
      password: formDataObj.get('password'),
      nik: formDataObj.get('nik'),
      nama_lengkap: formDataObj.get('nama_lengkap'),
      tempat_lahir: formDataObj.get('tempat_lahir'),
      tanggal_lahir: formDataObj.get('tanggal_lahir'),
      jenis_kelamin: formDataObj.get('jenis_kelamin'),
      no_hp: formDataObj.get('no_hp'),
      pekerjaan: formDataObj.get('pekerjaan'),
      kewarganegaraan: mode === 'asesi' ? formDataObj.get('kewarganegaraan') : null,
      nomor_registrasi_met: mode === 'asesor' ? formDataObj.get('nomor_registrasi_met') : null,
      pendidikan_terakhir: mode === 'asesor' ? formDataObj.get('pendidikan_terakhir') : null,
      alamat_wilayah: mode === 'asesor' ? formDataObj.get('alamat_wilayah') : null,
      tanda_tangan: tandaTangan,
    };
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert('Registrasi sukses! Silakan masuk dengan akun baru Anda.');
        setIsLoginView(true);
      } else {
        alert('Gagal Daftar: ' + result.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan pada server saat mendaftar.');
    }
    setIsLoading(false);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Fitur reset sandi sedang dalam pengembangan.');
    setIsForgotPasswordView(false);
    setIsLoginView(true);
  };

  // --- TAMPILAN LUPA PASSWORD ---
  if (isForgotPasswordView) {
    return (
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[#F8F9FC] p-4 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 md:p-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs"><Mail size={20} className="stroke-[2.5]" /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">Lupa Kata Sandi</h2>
              <p className="text-xs text-gray-500 mt-1">Kami akan mengirimkan instruksi reset ke email Anda.</p>
            </div>
          </div>
          <form className="space-y-5" onSubmit={handleForgotPassword}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Terdaftar</label>
              <input type="email" className="w-full px-4 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" placeholder="contoh@domain.com" required />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setIsForgotPasswordView(false)} className="w-full px-5 py-2 border rounded-lg text-xs font-bold hover:bg-slate-50">Kembali</button>
              <button type="submit" className="w-full bg-[#008BE3] text-white rounded-lg text-xs font-bold hover:bg-[#0076C2]">Kirim Instruksi</button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- TAMPILAN REGISTRASI ---
  if (!isLoginView) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FC] p-4 md:p-8 overflow-y-auto font-sans text-sm text-slate-700">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl border border-slate-200 shadow-sm w-full max-w-5xl my-auto">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <button type="button" onClick={() => setIsLoginView(true)} className="p-1.5 hover:bg-slate-50 rounded-lg border border-slate-200"><ArrowLeft size={16} /></button>
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-900 leading-none">Registrasi Akun Baru</h2>
                <p className="text-xs text-gray-500 mt-1.5">Lengkapi formulir pendaftaran di bawah ini</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
              {/* Tipe Pengguna */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-800 uppercase border-b border-slate-100 pb-2">Tipe Pengguna</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`flex items-center p-3.5 border rounded-lg cursor-pointer ${mode === 'asesi' ? 'border-[#008BE3] bg-sky-50/40' : 'bg-white'}`}>
                    <input type="radio" name="tipe" checked={mode === 'asesi'} onChange={() => setMode('asesi')} className="w-4 h-4 text-[#008BE3]" />
                    <div className="ml-3"><p className="font-bold text-xs text-slate-900">Asesi (Peserta Sertifikasi)</p></div>
                  </label>
                  <label className={`flex items-center p-3.5 border rounded-lg cursor-pointer ${mode === 'asesor' ? 'border-[#008BE3] bg-sky-50/40' : 'bg-white'}`}>
                    <input type="radio" name="tipe" checked={mode === 'asesor'} onChange={() => setMode('asesor')} className="w-4 h-4 text-[#008BE3]" />
                    <div className="ml-3"><p className="font-bold text-xs text-slate-900">Asesor (Penguji Kompetensi)</p></div>
                  </label>
                </div>
              </div>

              {/* Data Kredensial */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase border-b border-slate-100 pb-2">Data Kredensial Akun</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Pengguna</label>
                    <input type="text" name="username" className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Aktif</label>
                    <input type="email" name="email" className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                    <input type="password" name="password" className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Konfirmasi Password</label>
                    <input type="password" name="confirm_password" className="text-black w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                  </div>
                </div>
              </div>

              {/* Data Pribadi */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase border-b border-slate-100 pb-2">Data Profil Pribadi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">NIK</label>
                    <input type="text" name="nik" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                    <input type="text" name="nama_lengkap" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                  </div>

                  {mode === 'asesor' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Registrasi/MET</label>
                      <input type="text" name="nomor_registrasi_met" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tempat Lahir</label>
                    <input type="text" name="tempat_lahir" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Lahir</label>
                    <input type="date" name="tanggal_lahir" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Jenis Kelamin</label>
                    <div className="flex gap-6 py-1">
                      <label className="flex items-center text-xs font-bold"><input type="radio" name="jenis_kelamin" value="Laki-laki" className="w-4 h-4" required /><span className="ml-2">Laki-laki</span></label>
                      <label className="flex items-center text-xs font-bold"><input type="radio" name="jenis_kelamin" value="Perempuan" className="w-4 h-4" required /><span className="ml-2">Perempuan</span></label>
                    </div>
                  </div>

                  {mode === 'asesi' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Kewarganegaraan</label>
                      <select name="kewarganegaraan" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required>
                        <option value="WNI">WNI</option>
                        <option value="WNA">WNA</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor HP</label>
                    <input type="tel" name="no_hp" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                  </div>

                  {mode === 'asesor' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Pendidikan Terakhir</label>
                      <select name="pendidikan_terakhir" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required>
                        <option value="">Pilih Pendidikan Terakhir</option>
                        <option value="S1">S1 (Sarjana)</option>
                        <option value="S2">S2 (Magister)</option>
                        <option value="S3">S3 (Doktor)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Pekerjaan Utama</label>
                    <select name="pekerjaan" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required>
                      <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
                      <option value="PNS">Pegawai Negeri Sipil (PNS)</option>
                      <option value="Swasta">Karyawan Swasta</option>
                      <option value="Lainnya">Lainnya / Professional</option>
                    </select>
                  </div>

                  {mode === 'asesor' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Wilayah/Kelurahan</label>
                      <input type="text" name="alamat_wilayah" className="w-full px-3 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanda Tangan</label>
                    {tandaTangan && (
                      <div className="mb-2 border border-slate-200 rounded-lg p-2 flex justify-center"><img src={tandaTangan} alt="Tanda Tangan" className="h-10 object-contain" /></div>
                    )}
                    <button type="button" onClick={() => setIsSignatureModalOpen(true)} className="w-full py-2.5 bg-[#008BE3] text-white rounded-lg text-xs font-bold shadow-xs">{tandaTangan ? 'Ubah Tanda Tangan' : 'Buat Tanda Tangan'}</button>
                  </div>
                </div>
              </div>

              <div className="pt-5 flex flex-col sm:flex-row gap-3 sm:justify-between items-center bg-slate-50/50 p-4 rounded-lg">
                <button type="button" onClick={() => setIsLoginView(true)} className="w-full sm:w-auto px-5 py-2 border bg-white rounded-lg text-xs font-bold shadow-2xs">Kembali ke Login</button>
                <button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-[#008BE3] text-white px-6 py-2 rounded-lg text-xs font-bold shadow-xs">
                  {isLoading ? 'Memproses...' : 'Daftar Akun Baru'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Modal Kanvas */}
        {isSignatureModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
              <div className="p-4 border-b flex justify-between"><h3 className="font-bold text-sm">Buat Tanda Tangan</h3><button onClick={() => setIsSignatureModalOpen(false)}><X size={18} /></button></div>
              <div className="p-4">
                <div className="border rounded-lg bg-white">
                  <SignatureCanvas ref={signatureRef} canvasProps={{ className: 'w-full h-48 sm:h-64 cursor-crosshair' }} backgroundColor="white" />
                </div>
              </div>
              <div className="p-4 border-t flex flex-wrap gap-2 justify-between bg-slate-50">
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsSignatureModalOpen(false)} className="px-4 py-2 border bg-white rounded-lg text-xs font-bold">Batal</button>
                  <button type="button" onClick={() => signatureRef.current?.clear()} className="px-3 py-2 border text-rose-500 bg-white rounded-lg text-xs"><Trash2 size={16} /></button>
                </div>
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border text-emerald-600 bg-white rounded-lg text-xs font-bold flex gap-2"><Upload size={14} />Upload</button>
                  <button type="button" onClick={handleSaveSignature} className="px-4 py-2 bg-[#008BE3] text-white rounded-lg text-xs font-bold flex gap-2"><Save size={14} />Simpan</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- TAMPILAN LOGIN ---
  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[#F8F9FC] p-4 md:p-6 font-sans">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl bg-white rounded-xl border border-slate-200/90 shadow-sm flex overflow-hidden relative">
        <div className="hidden md:flex md:w-6/12 relative bg-[#0F172A]">
          <div className="absolute inset-0 bg-linear-to-tr from-[#0F172A]/95 via-[#0F172A]/85 to-[#008BE3]/30 z-10" />
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Professionals" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />
          <div className="relative z-20 flex flex-col justify-between p-10 h-full text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20"><GraduationCap size={18} /></div>
              <div><h2 className="text-xs font-black text-sky-300">LSP UIN SGD</h2><p className="text-[9px] text-white/50 font-bold">Sertifikasi Profesi</p></div>
            </div>
            <div className="my-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-300 text-[10px] px-2.5 py-1 rounded-full font-bold border border-sky-400/20"><BadgeCheck size={11} />Terakreditasi BNSP</span>
              <h2 className="text-2xl font-black leading-snug">Ukur Kompetensi, Gapai Karir Terbaik Anda</h2>
              <p className="text-xs text-slate-300">Sistem pendaftaran dan evaluasi uji kompetensi digital terintegrasi.</p>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">© 2026 Lembaga Sertifikasi Profesi Mandiri.</div>
          </div>
        </div>

        <div className="w-full md:w-6/12 flex flex-col">
          <div className="py-8 px-6 md:py-10 md:px-10 flex flex-col justify-center flex-1">
            <div className="mb-6"><h2 className="text-xl md:text-2xl font-black text-slate-900">Selamat Datang</h2></div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="flex p-1 bg-slate-100/80 rounded-lg border">
                <button type="button" onClick={() => setMode('asesi')} className={`flex-1 py-2 text-xs font-bold rounded-md ${mode === 'asesi' ? 'bg-white text-[#008BE3] shadow-xs' : 'text-slate-500'}`}>Login Asesi</button>
                <button type="button" onClick={() => setMode('asesor')} className={`flex-1 py-2 text-xs font-bold rounded-md ${mode === 'asesor' ? 'bg-white text-[#008BE3] shadow-xs' : 'text-slate-500'}`}>Login Asesor</button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Pengguna</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg outline-none focus:border-[#008BE3]" required />
                </div>
              </div>

              <div className="flex justify-between py-1">
                <label className="flex gap-1.5 text-xs font-bold text-slate-600"><input type="checkbox" className="w-3.5 h-3.5" /><span>Ingat Saya</span></label>
                <button type="button" onClick={() => setIsForgotPasswordView(true)} className="text-xs text-[#008BE3] font-bold">Lupa Kata Sandi?</button>
              </div>

              <div className="pt-1.5">
                <button type="submit" disabled={isLoading} className="w-full bg-[#008BE3] text-white font-bold py-2.5 rounded-lg text-xs flex justify-center gap-1.5">
                  <LogIn size={13} />{isLoading ? 'Memproses...' : 'Masuk ke Aplikasi'}
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
                <div className="relative flex justify-center text-[9px] font-bold"><span className="bg-white px-2.5 text-slate-400">Belum Memiliki Akun?</span></div>
              </div>

              <button type="button" onClick={() => setIsLoginView(false)} className="w-full bg-white border text-slate-700 font-bold py-2.5 rounded-lg text-xs flex justify-center gap-1.5">
                <UserPlus size={13} />Buat Akun
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}