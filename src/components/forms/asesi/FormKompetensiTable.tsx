import React from 'react';
import { Eye, Upload, CheckCircle, Info } from 'lucide-react';

interface KompetensiItem {
  id: string;
  unitTitle: string;
  unitCode: string;
  elemen: string;
  kuk: string[];
  idx: number;
}

interface FormKompetensiTableProps {
  title: string;
  infoText?: string;
  kompetensiList: KompetensiItem[];
  eFormData: any;
  onAction: (doc: any) => void;
}

export function FormKompetensiTable({ title, infoText, kompetensiList, eFormData, onAction }: FormKompetensiTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 3;
  const groupedList = kompetensiList.reduce((acc, comp) => {
    if (!acc[comp.unitCode]) {
      acc[comp.unitCode] = {
        title: comp.unitTitle,
        elements: []
      };
    }
    acc[comp.unitCode].elements.push(comp);
    return acc;
  }, {} as Record<string, { title: string, elements: KompetensiItem[] }>);

  const unitEntries = Object.entries(groupedList);
  const totalPages = Math.ceil(unitEntries.length / itemsPerPage);
  const currentRecords = unitEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">{title}</h3>
      </div>
      
      {infoText && (
        <div className="bg-sky-50/50 border-b border-sky-100 p-4">
          <div className="flex gap-3 max-w-4xl">
            <Info className="text-[#008BE3] shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-slate-600 font-medium">
              {infoText}
            </p>
          </div>
        </div>
      )}
      <div className="overflow-x-auto relative ">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#0F172A] border-b border-[#0F172A]">
              <th className="px-4 py-3 md:px-6 md:py-4 align-top w-1/4 sticky top-0 z-20 bg-[#0F172A] text-xs font-bold text-white/90 uppercase tracking-wider">Unit Kompetensi</th>
              <th className="px-4 py-3 md:px-6 md:py-4 align-top w-1/4 sticky top-0 z-20 bg-[#0F172A] text-xs font-bold text-white/90 uppercase tracking-wider">Elemen</th>
              <th className="px-4 py-3 md:px-6 md:py-4 align-top w-1/3 sticky top-0 z-20 bg-[#0F172A] text-xs font-bold text-white/90 uppercase tracking-wider">Kriteria Unjuk Kerja</th>
              <th className="px-4 py-3 md:px-6 md:py-4 align-top w-48 sticky right-0 bg-[#0F172A] z-30 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] sticky top-0 text-xs font-bold text-white/90 uppercase tracking-wider border-l border-white/10">Bukti Portofolio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-slate-800">
            {Object.keys(groupedList).length > 0 ? (
              currentRecords.map(([code, unit], uIdx) => (
                <React.Fragment key={code}>
                  {unit.elements.map((comp, eIdx) => {
                    const docName = comp.unitCode + " - " + comp.elemen;
                    const isComplete = eFormData[docName] !== undefined;
                    return (
                      <tr key={comp.id} className="group hover:bg-slate-50 transition-colors">
                        {eIdx === 0 && (
                          <td className="px-4 py-4 md:px-6 md:py-5 align-top border-r border-gray-200" rowSpan={unit.elements.length}>
                            <div className="font-medium">{unit.title}</div>
                          </td>
                        )}
                        <td className="px-4 py-4 md:px-6 md:py-5 align-top font-medium border-r border-gray-200">
                          {comp.elemen}
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5 align-top border-r border-gray-200">
                          <ul className="space-y-1">
                            {comp.kuk.map((k, kIdx) => (
                              <li key={kIdx} className="text-sm">
                                {k}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5 align-top sticky right-0 bg-white z-10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] group-hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 w-full">
                              <button
                                onClick={() => onAction({ name: docName, type: 'File Upload', required: true, isEForm: false, isBuktiKompetensi: true })}
                                className="flex-1 h-9 flex items-center gap-2 px-3 rounded-lg text-xs font-bold transition-all border bg-white text-slate-700 border-slate-300 hover:bg-slate-50 justify-center"
                              >
                                <Upload size={16} /> Upload
                              </button>
                              {isComplete && (
                                <button 
                                  onClick={() => onAction({ name: docName, type: 'File Upload', required: true, isEForm: false, isPreview: true })} 
                                  className="w-9 h-9 flex-none flex items-center justify-center rounded-lg bg-white text-[#008BE3] border border-[#008BE3]/30 hover:bg-[#008BE3]/5 transition-colors"
                                  title="Lihat Bukti"
                                >
                                  <Eye size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Tidak ada kompetensi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        {/* Pagination Controls */}
        {totalPages >= 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4 border-t border-slate-200 bg-white">
            <span className="text-xs md:text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, unitEntries.length)}</span> dari <span className="font-semibold text-slate-700">{unitEntries.length}</span> Unit
            </span>
            <div className="flex items-center gap-1 md:gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <div className="flex items-center gap-1 hidden sm:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-lg text-xs md:text-xs font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#008BE3] text-white border border-[#008BE3]'
                        : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
