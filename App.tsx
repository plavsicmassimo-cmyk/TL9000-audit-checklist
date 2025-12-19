
import React, { useState, useMemo, useRef } from 'react';
import { 
  Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend 
} from 'recharts';
import { INITIAL_SECTIONS } from './constants';
import { Category, ComplianceStatus, ChecklistItem, Section } from './types';
import { getAIExplanation, getAuditQuestions } from './services/gemini';

const App: React.FC = () => {
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [aiContent, setAiContent] = useState<{explanation: string, auditQuestions: string} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Statistics Calculation
  const stats = useMemo(() => {
    let total = 0;
    let compliant = 0;
    let nonCompliant = 0;
    let pending = 0;
    let na = 0;

    sections.forEach(s => {
      s.items.forEach(item => {
        if (activeCategory === 'ALL' || item.categories.includes(activeCategory as Category)) {
          total++;
          if (item.status === ComplianceStatus.COMPLIANT) compliant++;
          else if (item.status === ComplianceStatus.NON_COMPLIANT) nonCompliant++;
          else if (item.status === ComplianceStatus.PENDING) pending++;
          else if (item.status === ComplianceStatus.NOT_APPLICABLE) na++;
        }
      });
    });

    return { total, compliant, nonCompliant, pending, na };
  }, [sections, activeCategory]);

  const chartData = [
    { name: 'Compliant', value: stats.compliant, color: '#10b981' },
    { name: 'Non-Compliant', value: stats.nonCompliant, color: '#ef4444' },
    { name: 'Pending', value: stats.pending, color: '#6366f1' },
    { name: 'N/A', value: stats.na, color: '#94a3b8' },
  ];

  const updateItem = (sectionId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        items: s.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
      };
    }));
    // If the selected item is being updated, sync it
    if (selectedItem?.id === itemId) {
      setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, itemId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Fix: Explicitly type 'f' as 'File' to resolve the 'unknown' type error during mapping from FileList
    const newFileNames = Array.from(files).map((f: File) => f.name);
    const item = sections.find(s => s.id === sectionId)?.items.find(i => i.id === itemId);
    
    if (item) {
      updateItem(sectionId, itemId, { 
        attachments: [...(item.attachments || []), ...newFileNames] 
      });
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (sectionId: string, itemId: string, fileName: string) => {
    const item = sections.find(s => s.id === sectionId)?.items.find(i => i.id === itemId);
    if (item) {
      updateItem(sectionId, itemId, {
        attachments: item.attachments.filter(name => name !== fileName)
      });
    }
  };

  const handleAskAi = async (item: ChecklistItem) => {
    setIsAiLoading(true);
    setAiContent(null);
    try {
      const [explanation, questions] = await Promise.all([
        getAIExplanation(item.clause, item.description),
        getAuditQuestions(item.clause, item.description)
      ]);
      setAiContent({ explanation, auditQuestions: questions });
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredSections = useMemo(() => {
    return sections.map(s => ({
      ...s,
      items: s.items.filter(item => {
        const matchesCategory = activeCategory === 'ALL' || item.categories.includes(activeCategory as Category);
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.clause.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    })).filter(s => s.items.length > 0);
  }, [sections, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fas fa-microchip text-2xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">TL 9000 Compliance Master</h1>
              <p className="text-xs text-slate-400">Telecom Quality Management Auditor</p>
            </div>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
            {(['ALL', ...Object.values(Category)] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Dashboard & Search */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <i className="fas fa-chart-pie text-blue-500"></i> Compliance Overview
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-xs text-blue-600 font-semibold uppercase">Total Clauses</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="text-xs text-green-600 font-semibold uppercase">Compliant</p>
                <p className="text-2xl font-bold text-green-900">{stats.compliant}</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search requirements or clauses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </section>

          <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <i className="fas fa-bolt text-yellow-400"></i> AI Auditor Assistant
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Select a requirement from the checklist to get detailed AI-powered implementation guidance and sample audit questions.
            </p>
            {selectedItem ? (
              <button
                onClick={() => handleAskAi(selectedItem)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                disabled={isAiLoading}
              >
                {isAiLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magic"></i>}
                Analyze Clause {selectedItem.clause}
              </button>
            ) : (
              <div className="text-center py-4 border border-dashed border-slate-700 rounded-xl text-slate-500 text-sm">
                No clause selected
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Checklist */}
        <div className="lg:col-span-2 space-y-6 pb-20">
          {filteredSections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-2">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                      selectedItem?.id === item.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">
                            Clause {item.clause}
                          </span>
                          {item.tlSpecific && (
                            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded uppercase">
                              TL 9000 Specific
                            </span>
                          )}
                          <div className="flex gap-1">
                            {item.categories.map(c => (
                              <span key={c} className="text-[10px] px-1.5 py-0.5 border border-slate-200 text-slate-500 rounded font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        <h4 className="font-semibold text-slate-900">{item.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateItem(section.id, item.id, { status: e.target.value as ComplianceStatus });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs font-bold py-1 px-3 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-offset-2 transition-all ${
                            item.status === ComplianceStatus.COMPLIANT ? 'bg-green-100 text-green-700 focus:ring-green-500' :
                            item.status === ComplianceStatus.NON_COMPLIANT ? 'bg-red-100 text-red-700 focus:ring-red-500' :
                            item.status === ComplianceStatus.NOT_APPLICABLE ? 'bg-slate-100 text-slate-700 focus:ring-slate-500' :
                            'bg-indigo-100 text-indigo-700 focus:ring-indigo-500'
                          }`}
                        >
                          <option value={ComplianceStatus.PENDING}>PENDING</option>
                          <option value={ComplianceStatus.COMPLIANT}>COMPLIANT</option>
                          <option value={ComplianceStatus.NON_COMPLIANT}>NON-COMPLIANT</option>
                          <option value={ComplianceStatus.NOT_APPLICABLE}>N/A</option>
                        </select>
                      </div>
                    </div>

                    {/* Expand Details if selected */}
                    {selectedItem?.id === item.id && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Audit Evidence / Records</label>
                              <textarea
                                value={item.evidence}
                                onChange={(e) => updateItem(section.id, item.id, { evidence: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Describe current evidence or document references..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Notes / Action Items</label>
                              <textarea
                                value={item.notes}
                                onChange={(e) => updateItem(section.id, item.id, { notes: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Add internal notes, gaps found, or follow-up actions..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={2}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Evidence Files</label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {item.attachments.map((file, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-slate-200 group">
                                    <i className="fas fa-file text-blue-500"></i>
                                    <span className="truncate max-w-[120px]">{file}</span>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeAttachment(section.id, item.id, file);
                                      }}
                                      className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                ))}
                                {item.attachments.length === 0 && (
                                  <p className="text-xs text-slate-400 italic py-2">No files attached yet.</p>
                                )}
                              </div>
                              <label className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
                                <i className="fas fa-upload"></i>
                                Upload Evidence
                                <input
                                  type="file"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, section.id, item.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* AI Section Content */}
                        {aiContent && selectedItem.id === item.id && (
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
                            <div>
                              <h5 className="text-xs font-bold text-blue-700 uppercase flex items-center gap-2 mb-2">
                                <i className="fas fa-info-circle"></i> AI Implementation Guide
                              </h5>
                              <div className="text-sm text-slate-700 prose prose-blue max-w-none whitespace-pre-wrap">
                                {aiContent.explanation}
                              </div>
                            </div>
                            <div className="pt-3 border-t border-blue-200">
                              <h5 className="text-xs font-bold text-blue-700 uppercase flex items-center gap-2 mb-2">
                                <i className="fas fa-question-circle"></i> Suggested Audit Questions
                              </h5>
                              <div className="text-sm text-slate-700 prose prose-blue max-w-none whitespace-pre-wrap">
                                {aiContent.auditQuestions}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button for Summary */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 md:px-0">
        <div className="bg-slate-900 rounded-full py-3 px-6 shadow-2xl flex justify-between items-center text-white border border-slate-700">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400 font-bold">Progress</span>
              <span className="text-lg font-bold">{Math.round((stats.compliant / stats.total) * 100) || 0}%</span>
            </div>
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${(stats.compliant / stats.total) * 100}%` }}
              />
            </div>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors"
          >
            <i className="fas fa-file-pdf"></i> Export Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
