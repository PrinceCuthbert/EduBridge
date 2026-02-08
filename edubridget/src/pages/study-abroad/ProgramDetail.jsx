import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROGRAMS } from '../../data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Heart, Share2, Printer, MapPin, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      const foundProgram = MOCK_PROGRAMS.find(p => p.id === parseInt(id));
      setProgram(foundProgram);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Program Not Found</h2>
        <Button onClick={() => navigate('/study-abroad')}>Back to Programs</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-slate-500 mb-8">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/study-abroad')}>Study Abroad</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="font-semibold text-slate-900">{program.universityName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center relative overflow-hidden">
               <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {program.visaType}
                  </Badge>
               </div>
               
               <div className="w-32 h-32 mx-auto mb-6 relative">
                 <img 
                   src={program.logo} 
                   alt={program.universityName} 
                   className="w-full h-full object-contain"
                 />
               </div>
               
               <h1 className="text-3xl font-bold text-slate-900 mb-2">{program.universityName}</h1>
               <div className="flex items-center justify-center gap-2 mb-4">
                 {program.tags.map(tag => (
                   <span key={tag} className="text-xs font-bold text-primary px-2 py-1 bg-primary/5 rounded-full">
                     {tag}
                   </span>
                 ))}
               </div>
               
               <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                 {program.description}
               </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex border-b border-slate-200">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Details
                </button>
                <button 
                  onClick={() => setActiveTab('qa')}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'qa' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Q&A (0)
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-10">
                {activeTab === 'details' ? (
                  <>
                    {/* Departments */}
                    <section>
                      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        Departments and Majors
                      </h3>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:gap-px bg-slate-200">
                          {program.departments.map((dept, idx) => (
                            <div key={idx} className="bg-white p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                              {dept}
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Timeline */}
                    <section>
                      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                         Application Schedule Steps & Timeline
                      </h3>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-3 font-semibold text-slate-700">Step</th>
                              <th className="px-4 py-3 font-semibold text-slate-700 w-1/3">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {program.timeline.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-slate-600">{item.step}</td>
                                <td className="px-4 py-3 text-slate-900 font-medium">{item.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* Required Documents */}
                    {program.requiredDocuments && (
                      <section>
                        <h3 className="text-lg font-bold text-primary mb-4">Required Documents</h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200">
                              {program.requiredDocuments.map((doc, idx) => (
                                <div key={idx} className="bg-white p-3 text-sm text-slate-600 flex items-start gap-2">
                                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{doc}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p>No questions yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                 <h2 className="text-xl font-bold text-slate-900 mb-1">{program.universityName}</h2>
                 <p className="text-2xl font-bold text-emerald-600 mb-6">{program.tuition}</p>
                 
                 <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-600">Quantity</span>
                     <div className="flex items-center border border-slate-300 rounded">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1 hover:bg-slate-50 text-slate-600 border-r border-slate-300"
                        >-</button>
                        <span className="px-3 py-1 text-slate-900 font-medium min-w-[2rem] text-center">{quantity}</span>
                        <button 
                           onClick={() => setQuantity(quantity + 1)}
                           className="px-3 py-1 hover:bg-slate-50 text-slate-600 border-l border-slate-300"
                        >+</button>
                     </div>
                   </div>
                   
                   <div className="flex justify-between items-center text-sm font-semibold pt-4 border-t border-slate-100">
                     <span className="text-slate-900">Subtotal ({quantity})</span>
                     <span className="text-emerald-600">{program.tuition}</span>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base">
                     Apply Now
                   </Button>
                   <div className="grid grid-cols-2 gap-3">
                     <Button variant="outline" className="w-full">
                       Add to Cart
                     </Button>
                     <Button variant="outline" className="w-full gap-2 text-slate-500">
                       <Heart size={18} /> 0
                     </Button>
                   </div>
                 </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                 <h3 className="font-semibold text-slate-900 mb-4">Share this program</h3>
                 <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                      <Share2 size={20} />
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                    >
                      <Printer size={20} />
                    </button>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
