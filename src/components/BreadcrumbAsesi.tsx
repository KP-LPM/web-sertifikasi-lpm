'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/context';

export default function BreadcrumbAsesi({ className = "" }: { className?: string }) {
  const { user } = useAppContext();
  const pathname = usePathname();

  // Pastikan hanya dirender untuk role asesi
  if (!user || user.role !== 'asesi') return null;

  // Crumb dasar / default
  const homeCrumb = { label: 'Dashboard', path: '/asesi/overview' };
  
  // Mencari tahu kita sedang di halaman mana berdasarkan URL
  let currentCrumb = null;

  if (pathname.includes('/pengajuanskema')) {
    currentCrumb = { label: 'Pengajuan Skema', path: '/asesi/pengajuanskema' };
  } else if (pathname.includes('/riwayatasesmen')) {
    currentCrumb = { label: 'Riwayat & Sertifikat', path: '/asesi/riwayatasesmen' };
  } else if (pathname.includes('/banding')) {
    currentCrumb = { label: 'Banding Asesmen', path: '/asesi/banding' };
  } else if (pathname.includes('/ujian')) {
    currentCrumb = { label: 'Ujian Online', path: '/asesi/ujian' };
  } else if (pathname.includes('/profile')) {
    currentCrumb = { label: 'Profil Saya', path: '/asesi/profile' };
  }

  // Jika hanya di dashboard (atau halaman tidak dikenali), tidak perlu tampilkan breadcrumb
  if (!currentCrumb) return null;

  const crumbs = [homeCrumb, currentCrumb];

  return (
    <div className={`flex items-center gap-2 flex-wrap text-[13px] font-bold text-slate-500 uppercase tracking-wide ${className}`}>
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-400 mx-1">/</span>}
            {isLast ? (
              <span className="text-[#008BE3] font-black">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.path}
                className="text-slate-500 hover:text-[#008BE3] transition-colors cursor-pointer uppercase"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}