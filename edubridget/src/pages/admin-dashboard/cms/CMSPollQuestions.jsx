import { useState } from 'react';
import { MOCK_POLL_QUESTIONS } from '../../../data/mockPublishersRoles';
import { MOCK_PROGRAMS } from '../../../data/mockData';
import { toast } from 'sonner';
import { HelpCircle, Plus, Pencil, Trash2, X, Save, ChevronDown } from 'lucide-react';

// ─── Poll Questions ───────────────────────────────────────────────────────────
const QUESTION_TYPES = ['single-choice', 'multi-choice', 'text'];
const EMPTY_FORM = { program_id: '', cat_id: 1, question: '', options: ['', ''], type: 'single-choice' };

function PollModal({ question, onSave, onClose }) {
  const [form, setForm] = useState(
    question ? { ...question, options: [...(question.options || ['', ''])] } : { ...EMPTY_FORM, options: ['', ''] }
  );
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setOption = (i, v) => { const o = [...form.options]; o[i] = v; set('options', o); };
  const addOption = () => set('options', [...form.options, '']);
  const removeOption = (i) => set('options', form.options.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!form.question.trim()) { toast.error('Question text is required'); return; }
    if (!form.program_id) { toast.error('Please select a program'); return; }
    onSave({ ...form, program_id: Number(form.program_id) });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-slate-900">{question ? 'Edit Question' : 'Add Question'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Program <span className="text-red-500">*</span></label>
            <div className="relative">
              <select value={form.program_id} onChange={e => set('program_id', e.target.value)}
                className="w-full appearance-none pr-8 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select program…</option>
                {MOCK_PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category ID</label>
              <input type="number" min={1} value={form.cat_id} onChange={e => set('cat_id', Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
              <div className="relative">
                <select value={form.type} onChange={e => set('type', e.target.value)}
                  className="w-full appearance-none pr-8 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {QUESTION_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Question Text <span className="text-red-500">*</span></label>
            <textarea value={form.question} onChange={e => set('question', e.target.value)} rows={3}
              placeholder="Enter the survey question…"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          {form.type !== 'text' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Answer Options</label>
              <div className="space-y-2">
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={opt} onChange={e => setOption(i, e.target.value)} placeholder={`Option ${i + 1}`}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {form.options.length > 2 && (
                      <button onClick={() => removeOption(i)} className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors"><X size={14} /></button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addOption} className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                <Plus size={13} /> Add option
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 pb-6 sticky bottom-0 bg-white border-t border-slate-100 pt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">
            <Save size={15} /> Save Question
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Manager ──────────────────────────────────────────────────────────────
// ─── Main Component ───────────────────────────────────────────────────────────
export default function CMSPollQuestions() {
  const [questions, setQuestions] = useState([...MOCK_POLL_QUESTIONS]);
  const [pollModal, setPollModal] = useState(null);
  const [filterProgram, setFilterProgram] = useState('All');

  const handlePollSave = (form) => {
    if (pollModal === 'add') {
      setQuestions((p) => [...p, { ...form, id: Date.now() }]);
      toast.success('Question added');
    } else {
      setQuestions((p) => p.map((q) => (q.id === form.id ? form : q)));
      toast.success('Question updated');
    }
    setPollModal(null);
  };

  const handlePollDelete = (q) => {
    toast('Delete this question?', {
      action: { label: 'Delete', onClick: () => setQuestions((p) => p.filter((x) => x.id !== q.id)) },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  const filteredQuestions =
    filterProgram === 'All' ? questions : questions.filter((q) => String(q.program_id) === filterProgram);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Poll Questions</h2>
          <p className="text-sm text-slate-500 mt-0.5">Pre-application survey questions linked to programs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="All">All Programs</option>
              {MOCK_PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button onClick={() => setPollModal('add')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Add Question
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredQuestions.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <HelpCircle size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No questions yet for this program.</p>
          </div>
        )}
        {filteredQuestions.map(q => {
          const prog = MOCK_PROGRAMS.find(p => p.id === q.program_id);
          return (
            <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wide">{q.type}</span>
                    <span className="text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">Cat {q.cat_id}</span>
                    {prog && <span className="text-xs text-slate-500 font-medium">{prog.name}</span>}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">{q.question}</p>
                  {q.options && (
                    <div className="flex flex-wrap gap-1.5">
                      {q.options.map((opt, i) => <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{opt}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setPollModal(q)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit"><Pencil size={15} /></button>
                  <button onClick={() => handlePollDelete(q)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pollModal !== null && <PollModal question={pollModal === 'add' ? null : pollModal} onSave={handlePollSave} onClose={() => setPollModal(null)} />}
    </div>
  );
}
