import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context';
import { 
  GraduationCap, 
  LogIn, 
  Mail, 
  Lock, 
  UserPlus, 
  ArrowLeft, 
  BadgeCheck,
  X
  
} from 'lucide-react';
import { motion } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';

export function Login() {
  const { login, setRegisteredProfile } = useAppContext();
  const [mode, setMode] = useState<'asesi' | 'asesor'>('asesi');
  const [isLoginView, setIsLoginView] = useState(true);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (username === 'admin' || username === 'admin@lsp.com') {
      login('admin');
    } else {
      login(mode);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (!tandaTangan) {
      alert('Tanda tangan wajib diisi!');
      return;
    }
    
    // Extract form data
    const formDataObj = new FormData(form);
    const data = {
      nama: formDataObj.get('namaLengkap') as string || '',
      email: formDataObj.get('email') as string || '',
      noTelp: formDataObj.get('noTelp') as string || '',
      nik: formDataObj.get('nik') as string || '',
      alamatRumah: formDataObj.get('alamatRumah') as string || '',
      kotaAlamat: formDataObj.get('kotaAlamat') as string || '',
      kodePos: formDataObj.get('kodePos') as string || '',
      alamatWilayah: mode === 'asesor' ? (formDataObj.get('alamatWilayah') as string || '') : '',
      tandaTangan: tandaTangan,
      noRegistrasi: mode === 'asesor' ? 'REG-2023-002' : 'REG-2023-001',
      pekerjaan: 'Karyawan Swasta', // Default
      pendidikanTerakhir: 'S1', // Default
    };
    
    setRegisteredProfile(data);
    login(mode);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    alert('Instruksi reset kata sandi telah dikirim ke email Anda.');
    setIsForgotPasswordView(false);
    setIsLoginView(true);
  };

  // Forgot Password View
  if (isForgotPasswordView) {
    return (
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[#F8F9FC] p-4 md:p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white rounded-xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden relative p-6 md:p-10"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
              <Mail size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Lupa Kata Sandi</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">Kami akan mengirimkan instruksi reset ke email Anda.</p>
            </div>
          </div>
          
          <form className="space-y-5" onSubmit={handleForgotPassword}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <span className="text-red-500 mr-0.5">*</span> Email Terdaftar
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="email" 
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400"
                  placeholder="contoh@domain.com"
                  required
                />
              </div>
            </div>
            
            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:justify-between items-center">
              <button 
                type="button" 
                onClick={() => setIsForgotPasswordView(false)}
                className="w-full sm:w-auto px-5 py-2 border border-slate-200 bg-white rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-xs shadow-2xs"
              >
                <ArrowLeft size={14} className="stroke-[2.5]" /> 
                Kembali
              </button>
              
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-[#008BE3] hover:bg-[#0076C2] text-white font-bold px-6 py-2 rounded-lg text-xs flex items-center justify-center transition-all shadow-xs"
              >
                Kirim Instruksi
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Registrasi view aligned with Dashboard styling
  if (!isLoginView) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FC] p-4 md:p-8 overflow-y-auto font-sans text-sm text-slate-700">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm w-full max-w-5xl relative my-auto overflow-hidden"
        >
          <div className="p-6 md:p-8 flex flex-col h-full space-y-6">
            
            {/* Header Block matching Dashboard layout exactly */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 shrink-0">
              <button
                type="button"
                onClick={() => setIsLoginView(true)}
                className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 shrink-0"
                title="Kembali ke halaman login"
              >
                <ArrowLeft size={16} className="text-slate-600" />
              </button>
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">Registrasi Akun Baru</h2>
                <p className="text-xs text-gray-500 font-medium mt-1.5">Lengkapi formulir pendaftaran di bawah ini untuk mengajukan sertifikasi LSP</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
              
              {/* Tipe Pengguna */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Tipe Pengguna</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`flex items-center p-3.5 border rounded-lg cursor-pointer transition-all ${
                    mode === 'asesi' 
                      ? 'border-[#008BE3] bg-sky-50/40 ring-1 ring-[#008BE3]/30' 
                      : 'border-slate-200 hover:border-[#008BE3]/40 bg-white'
                  }`}>
                    <input 
                      type="radio" 
                      name="tipe" 
                      className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3] border-slate-300" 
                      checked={mode === 'asesi'} 
                      onChange={() => setMode('asesi')} 
                    />
                    <div className="ml-3">
                      <p className="font-bold text-xs text-slate-900 leading-none">Asesi (Peserta Sertifikasi)</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">Daftar untuk mengajukan skema sertifikasi kompetensi baru</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-3.5 border rounded-lg cursor-pointer transition-all ${
                    mode === 'asesor' 
                      ? 'border-[#008BE3] bg-sky-50/40 ring-1 ring-[#008BE3]/30' 
                      : 'border-slate-200 hover:border-[#008BE3]/40 bg-white'
                  }`}>
                    <input 
                      type="radio" 
                      name="tipe" 
                      className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3] border-slate-300" 
                      checked={mode === 'asesor'} 
                      onChange={() => setMode('asesor')} 
                    />
                    <div className="ml-3">
                      <p className="font-bold text-xs text-slate-900 leading-none">Asesor (Penguji/Asesor Kompetensi)</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">Daftar untuk meninjau dan menilai dokumen kompetensi asesi</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Akun */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Data Kredensial Akun</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Nama Pengguna
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                      placeholder="Masukkan username" 
                      required 
                    />
                    <p className="text-[10px] text-slate-400 font-medium mt-1 leading-normal">Tanpa spasi & karakter spesial</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Email Aktif
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                      placeholder="contoh@domain.com" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                      placeholder="Min. 8 Karakter" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Konfirmasi Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                      placeholder="Ketik ulang password" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Data Pribadi */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Data Profil Pribadi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>NIK (Nomor Induk Kependudukan)
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                      placeholder="Ketik 16 Digit NIK" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Nama Lengkap
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                      placeholder="Sesuai KTP / Paspor" 
                      required 
                    />
                  </div>

                  {mode === 'asesor' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        <span className="text-red-500 mr-1">*</span>Nomor Registrasi/MET
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                        placeholder="MET. 000.00XXXXXX 20XX" 
                        required 
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Tempat Lahir
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                      placeholder="Kota/Kabupaten" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Tanggal Lahir
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      <span className="text-red-500 mr-1">*</span>Jenis Kelamin
                    </label>
                    <div className="flex gap-6 py-1">
                      <label className="flex items-center cursor-pointer text-xs font-bold text-slate-700">
                        <input 
                          type="radio" 
                          name="gender" 
                          className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3] border-slate-300" 
                          required 
                        />
                        <span className="ml-2">Laki-laki</span>
                      </label>
                      <label className="flex items-center cursor-pointer text-xs font-bold text-slate-700">
                        <input 
                          type="radio" 
                          name="gender" 
                          className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3] border-slate-300" 
                          required 
                        />
                        <span className="ml-2">Perempuan</span>
                      </label>
                    </div>
                  </div>

                  {mode === 'asesi' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        <span className="text-red-500 mr-1">*</span>Kewarganegaraan
                      </label>
                      <select 
                        className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 cursor-pointer" 
                        required
                      >
                        <option value="WNI">WNI</option>
                        <option value="WNA">WNA</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Nomor HP / WhatsApp
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-400 font-bold text-xs">
                        +62
                      </span>
                      <input 
                        type="tel" 
                        className="flex-1 min-w-0 block w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-r-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                        placeholder="812345678" 
                        required 
                      />
                    </div>
                  </div>

                  {mode === 'asesor' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        <span className="text-red-500 mr-1">*</span>Pendidikan Terakhir
                      </label>
                      <select 
                        className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 cursor-pointer" 
                        required
                      >
                        <option value="">Pilih Pendidikan Terakhir</option>
                        <option value="S1">S1 (Sarjana)</option>
                        <option value="S2">S2 (Magister)</option>
                        <option value="S3">S3 (Doktor)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Pekerjaan Utama
                    </label>
                    <select 
                      className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 cursor-pointer" 
                      required
                    >
                      <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
                      <option value="PNS">Pegawai Negeri Sipil (PNS)</option>
                      <option value="Swasta">Karyawan Swasta</option>
                      <option value="Lainnya">Lainnya / Professional</option>
                    </select>
                  </div>

                  {mode === 'asesor' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        <span className="text-red-500 mr-1">*</span>Alamat Wilayah/Kelurahan
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium" 
                        placeholder="Ketik wilayah penugasan" 
                        required 
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      <span className="text-red-500 mr-1">*</span>Tanda Tangan
                    </label>
                    {tandaTangan && (
                      <div className="mb-2 border border-slate-200 rounded-lg p-2 bg-white flex justify-center">
                        <img src={tandaTangan} alt="Tanda Tangan" className="h-10 object-contain" />
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => setIsSignatureModalOpen(true)}
                      className="w-full py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                    >
                      {tandaTangan ? 'Ubah Tanda Tangan' : 'Buat Tanda Tangan'}
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1.5">Tanda tangan ini akan digunakan dalam perangkat asesmen.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons exactly matching EForm style */}
              <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row gap-3 sm:justify-between items-center bg-slate-50/50 p-4 rounded-lg">
                <button 
                  type="button" 
                  onClick={() => setIsLoginView(true)}
                  className="w-full sm:w-auto px-5 py-2 border border-slate-200 bg-white rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-xs shadow-2xs"
                >
                  <ArrowLeft size={14} className="stroke-[2.5]" /> 
                  Kembali ke Login
                </button>
                
                {/* Submit button uses deep green matching EForm submit button style */}
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-[#008BE3] hover:bg-[#0076C2] text-white font-bold px-6 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  Daftar Akun Baru
                </button>
              </div>

            </form>
          </div>
        </motion.div>
        
        {/* Signature Modal */}
        {isSignatureModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Buat Tanda Tangan</h3>
                <button 
                  type="button"
                  onClick={() => setIsSignatureModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-4">
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <SignatureCanvas 
                    ref={signatureRef}
                    canvasProps={{
                      className: 'w-full h-48 sm:h-64 cursor-crosshair'
                    }}
                    backgroundColor="white"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center bg-slate-50">
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsSignatureModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    Batal
                  </button>
                  <button 
                    type="button"
                    onClick={() => signatureRef.current?.clear()}
                    className="px-4 py-2 border border-rose-500 text-rose-500 bg-white rounded-lg text-xs font-bold hover:bg-rose-50 transition-colors shadow-2xs"
                  >
                    Hapus Kanvas
                  </button>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-emerald-600 text-emerald-600 bg-white rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors shadow-2xs"
                  >
                    Upload Gambar
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveSignature}
                    className="px-4 py-2 bg-[#008BE3] text-white rounded-lg text-xs font-bold hover:bg-[#0076C2] transition-colors shadow-xs"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Login View aligned with Dashboard styling
  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[#F8F9FC] p-4 md:p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl bg-white rounded-xl border border-slate-200/90 shadow-sm flex overflow-hidden relative"
      >
        
        {/* Left Side: Brand Accent Panel */}
        <div className="hidden md:flex md:w-6/12 relative bg-[#1C1542]">
          {/* Subtle gradient overlay to match modern professional UI */}
          <div className="absolute inset-0 bg-linear-to-tr from-[#1C1542]/95 via-[#1C1542]/85 to-[#008BE3]/30 z-10" />
          
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
            alt="Professionals Collaborating" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          
          <div className="relative z-20 flex flex-col justify-between p-10 h-full text-white">
            {/* Logo and branding inside Left Panel */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20 shadow-xs">
                <GraduationCap size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-xs font-black tracking-wider uppercase leading-none text-sky-300">LSP Mandiri</h2>
                <p className="text-[9px] text-white/50 font-bold tracking-wider uppercase leading-none mt-0.5">Sertifikasi Profesi</p>
              </div>
            </div>

            {/* Middle Message */}
            <div className="my-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-300 text-[10px] px-2.5 py-1 rounded-full font-bold border border-sky-400/20">
                <BadgeCheck size={11} className="stroke-[2.5]" />
                Terakreditasi BNSP
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-snug">
                Ukur Kompetensi, Gapai Karir Terbaik Anda
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-medium">
                Sistem pendaftaran dan evaluasi uji kompetensi digital terintegrasi. Masuk ke dashboard Anda untuk melanjutkan proses sertifikasi mandiri.
              </p>
            </div>

            {/* Bottom help desk details */}
            <div className="text-[10px] text-slate-400 font-semibold">
              © 2026 Lembaga Sertifikasi Profesi Mandiri.
            </div>
          </div>
        </div>

        {/* Right Side: Login Form with exact Dashboard theme elements */}
        <div className="w-full md:w-6/12 py-8 px-6 md:py-10 md:px-10 flex flex-col justify-center">
          
          {/* Form Header Block */}
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-5 md:hidden">
              <div className="w-9 h-9 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
                <GraduationCap size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 tracking-tight leading-none">LSP Mandiri</h2>
                <p className="text-[9px] text-gray-400 font-bold tracking-wider uppercase leading-none mt-0.5">Sertifikasi Profesi</p>
              </div>
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">Selamat Datang</h2>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            
            {/* Demo Role Toggle in Dashboard Gray style */}
            <div className="flex p-1 bg-slate-100/80 rounded-lg border border-slate-200/50">
              <button 
                type="button"
                onClick={() => setMode('asesi')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                  mode === 'asesi' 
                    ? 'bg-white text-[#008BE3] shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Login sebagai Asesi
              </button>
              <button 
                type="button"
                onClick={() => setMode('asesor')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                  mode === 'asesor' 
                    ? 'bg-white text-[#008BE3] shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Login sebagai Asesor
              </button>
            </div>

            {/* Email / Username field with exact input designs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <span className="text-red-500 mr-0.5">*</span> Nama Pengguna atau Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium"
                  placeholder="Ketik username / email"
                  required
                />
              </div>
            </div>
            
            {/* Password field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                <span className="text-red-500 mr-0.5">*</span> Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]/40 transition-all placeholder:text-slate-400 placeholder:font-medium"
                  placeholder="Ketik kata sandi"
                  required
                />
              </div>
            </div>

            {/* Remember & Lupa password */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-bold text-slate-600">
                <input 
                  type="checkbox" 
                  className="w-3.5 h-3.5 text-[#008BE3] rounded-md border-slate-300 focus:ring-[#008BE3] bg-slate-50" 
                />
                <span>Ingat Saya</span>
              </label>
              <button 
                type="button" 
                onClick={() => setIsForgotPasswordView(true)}
                className="text-xs text-[#008BE3] hover:text-[#0076C2] font-bold transition-all"
              >
                Lupa Kata Sandi?
              </button>
            </div>

            {/* Login Action Button */}
            <div className="pt-1.5">
              <button 
                type="submit" 
                className="w-full bg-[#008BE3] hover:bg-[#0076C2] text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <LogIn size={13} className="stroke-[2.5]" />
                Masuk ke Aplikasi
              </button>
            </div>

            {/* Divider line style */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[9px] font-bold">
                <span className="bg-white px-2.5 text-slate-400 uppercase tracking-wider">Belum Memiliki Akun?</span>
              </div>
            </div>

            {/* Toggle to Registration View */}
            <button 
              type="button" 
              onClick={() => setIsLoginView(false)}
              className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <UserPlus size={13} className="stroke-[2.5]" />
              Buat Akun
            </button>
          </form>
          
          {/* Bypass demo button removed */}
        </div>
      </motion.div>
    </div>
  );
}
