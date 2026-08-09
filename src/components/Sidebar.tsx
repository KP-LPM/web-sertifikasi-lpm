import React from 'react';
import { useAppContext } from '../context';
import { LayoutList, LayoutDashboard, FolderTree, CalendarDays, Users, Scale, History, FileText, LogOut, GraduationCap, Menu, Plus, FileEdit, Building2, ClipboardList, AlertCircle, Headset, ShieldCheck, FolderCheck
} from 'lucide-react';

export function Sidebar() {
  const { user, currentView, setCurrentView, logout, sidebarCollapsed, setSidebarCollapsed } = useAppContext();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      <aside className={`fixed left-0 top-0 h-screen ${sidebarCollapsed ? '-translate-x-full md:translate-x-0 w-72 md:w-20 px-4 md:px-2' : 'translate-x-0 w-72 px-4'} flex flex-col bg-[#0F172A] border-r border-[#0F172A]/80 shadow-xs z-50 py-6 transition-all duration-300`}>
      {/* Top Brand Logo & Toggle Header */}
      <div className={`mb-6 flex ${sidebarCollapsed ? 'flex-col items-center gap-4' : 'items-center justify-between px-2'}`}>
        {!sidebarCollapsed ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] shrink-0 border border-[#008BE3]/20 shadow-xs">
                <GraduationCap size={20} className="stroke-[2.5]" />
              </div>
              <div className="transition-all duration-300 overflow-hidden whitespace-nowrap">
                <h2 className="text-base font-black text-white tracking-tight leading-none mb-1">LSP UIN SGD</h2>
                <p className="text-[10px] text-white/60 font-bold tracking-wider uppercase leading-none">Sertifikasi Profesi</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarCollapsed(true)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Kecilkan Menu"
            >
              <Menu size={18} />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setSidebarCollapsed(false)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Perbesar Menu"
            >
              <Menu size={18} />
            </button>
            <div className="w-9 h-9 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] shrink-0 border border-[#008BE3]/20 shadow-xs">
              <GraduationCap size={20} className="stroke-[2.5]" />
            </div>
          </>
        )}
      </div>
      
      <nav className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (currentView.startsWith(item.id) && item.id !== 'dashboard');
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); if (window.innerWidth < 1024) setSidebarCollapsed(true); }}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-0 h-11' : 'px-3 py-3.5 gap-3'} rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-[#008BE3] text-white font-black shadow-md' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'} />
                {!sidebarCollapsed && <span className="text-sm font-bold tracking-tight transition-all duration-300 overflow-hidden whitespace-nowrap">{item.label}</span>}
              </button>
            )
          })}
        </div>
        
        <div className="pt-4 border-t border-white/10">
          {/* Logout Button */}
          <button
            onClick={logout}
            title={sidebarCollapsed ? 'Logout' : undefined}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-0 h-11' : 'px-3 py-3.5 gap-3'} rounded-lg transition-all text-rose-400 hover:bg-rose-500/10 hover:text-rose-300`}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
    </>
  );
}

function getNavItems(role: string | null | undefined) {
  switch (role) {
    case 'direktur':
    case 'manajer':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pleno', label: 'Sidang Pleno', icon: Users }
      ];
    case 'admin':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Verifikasi Berkas', icon: Users },
        { id: 'schemes', label: 'Skema Sertifikasi', icon: FolderTree },
        { id: 'schedules', label: 'Jadwal & Penugasan', icon: CalendarDays },
        { id: 'tuk', label: 'Manajemen TUK', icon: Building2 },
        { id: 'reports', label: 'Laporan', icon: ClipboardList },
      ];
    case 'asesor':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'verifikasi-apl02', label: 'Verifikasi Berkas', icon: ShieldCheck },
        { id: 'candidates', label: 'Daftar Asesmen', icon: LayoutList },
        { id: 'history-asesmen', label: 'Riwayat Asesmen', icon: History },
        { id: 'verifikasi-portofolio', label: 'Verifikasi Portofolio', icon: FolderCheck },
        { id: 'verifikasi-banding', label: 'Verifikasi Banding', icon: Scale },
        { id: 'konfigurasi-pertanyaan', label: 'Konfigurasi Pertanyaan', icon: FileEdit },
      ];
    case 'asesi':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'apply', label: 'Pengajuan Skema', icon: FileText },
        { id: 'history', label: 'Riwayat Asesmen', icon: History },
        { id: 'appeals', label: 'Banding Asesmen', icon: Scale },
      ];
    default:
      return [];
  }
}
