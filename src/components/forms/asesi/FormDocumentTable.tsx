import React from 'react';
import { FileText, Eye, Upload, CheckCircle, Info, BadgeCheck } from 'lucide-react';

interface FormDocumentTableProps {
  title: string;
  infoText?: string;
  documents: any[];
  eFormData: any;
  showErrors?: boolean;
  onAction: (doc: any) => void;
}

export function FormDocumentTable({ title, infoText, documents, eFormData, onAction }: FormDocumentTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil((documents?.length || 0) / itemsPerPage);
  const currentRecords = documents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#0F172A] border-b border-[#0F172A]">
              <th className="px-4 py-3 md:px-6 md:py-4 w-12 text-left sticky top-0 z-20 bg-[#0F172A] text-xs font-bold text-white/90 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 md:px-6 md:py-4 sticky top-0 z-20 bg-[#0F172A] text-xs font-bold text-white/90 uppercase tracking-wider">Dokumen</th>
              <th className="px-4 py-3 md:px-6 md:py-4 w-32 sticky top-0 z-20 bg-[#0F172A] text-xs font-bold text-white/90 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 md:px-6 md:py-4 w-48 text-left sticky right-0 bg-[#0F172A] z-30 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] sticky top-0 text-xs font-bold text-white/90 uppercase tracking-wider border-l border-white/10">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {documents.length > 0 ? (
              currentRecords.map((doc, idx) => {
                const isComplete = eFormData[doc.name] !== undefined;
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-4 md:px-6 md:py-5 text-center font-bold text-slate-400">
                      {((currentPage - 1) * itemsPerPage + idx + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-4 py-4 md:px-6 md:py-5">
                       <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#008BE3]/10 text-[#008BE3]">
                          {doc.isEForm ? <BadgeCheck size={20} /> : <FileText size={20} />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 mb-0.5">{doc.name}</p>
                          {doc.description && (
                            <p className="text-xs text-slate-500 mb-1 max-w-md">{doc.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-500 font-medium">{doc.type}</span>
                            {doc.required && (
                              <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Wajib</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 md:px-6 md:py-5">
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold whitespace-nowrap">
                          <CheckCircle size={12} className="text-emerald-500" />
                          Lengkap
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold whitespace-nowrap">
                          Belum
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 md:px-6 md:py-5 sticky right-0 bg-white z-10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)] group-hover:bg-slate-50/80 transition-colors">
                      <div className="flex justify-center gap-2">
                        {doc.isEForm ? (
                          <button
                            onClick={() => onAction(doc)}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border bg-white text-[#008BE3] border-[#008BE3]/30 hover:bg-[#008BE3]/5 whitespace-nowrap"
                          >
                            <Eye size={16} /> {isComplete ? 'Ubah Form' : 'Isi Form'}
                          </button>
                        ) : (
                          <>
                            {isComplete && (
                              <button onClick={() => onAction({...doc, isPreview: true})} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border bg-white text-[#008BE3] border-[#008BE3]/30 hover:bg-[#008BE3]/5 whitespace-nowrap"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => onAction(doc)}
                              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border bg-white text-slate-700 border-slate-300 hover:bg-slate-50 whitespace-nowrap"
                            >
                              <Upload size={16} /> Upload
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Tidak ada persyaratan
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
              Menampilkan <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, documents.length)}</span> dari <span className="font-semibold text-slate-700">{documents.length}</span> entri
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
