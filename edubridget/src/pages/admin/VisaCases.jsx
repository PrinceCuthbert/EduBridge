import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Calendar, DollarSign, Upload, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle, XCircle, User, MapPin, Phone, Mail, Download, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../components/Modal';

export default function VisaCases() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    country: '',
    visaType: '',
    appointmentDate: '',
    appointmentType: 'Online',
    consultationFee: '',
    status: 'New',
    documents: [],
    notes: ''
  });

// Mock data moved outside component
const MOCK_CASES = [
  {
    id: 1,
    clientName: 'John Kariuki',
    email: 'john.k@email.com',
    phone: '+254 700 123 456',
    country: 'Canada',
    visaType: 'Study Visa',
    appointmentDate: '2024-02-15',
    appointmentType: 'Online',
    consultationFee: '$150',
    status: 'In Progress',
    documents: ['Passport', 'Admission Letter', 'Bank Statement'],
    notes: 'All documents submitted',
    createdAt: '2024-02-01'
  },
  {
    id: 2,
    clientName: 'Sarah Wanjiku',
    email: 'sarah.w@email.com',
    phone: '+254 722 456 789',
    country: 'UK',
    visaType: 'Work Visa',
    appointmentDate: '2024-02-18',
    appointmentType: 'Offline',
    consultationFee: '$200',
    status: 'Approved',
    documents: ['Passport', 'Job Offer', 'Police Clearance'],
    notes: 'Visa approved',
    createdAt: '2024-01-25'
  },
  {
    id: 3,
    clientName: 'David Omondi',
    email: 'david.o@email.com',
    phone: '+254 711 987 654',
    country: 'USA',
    visaType: 'General Visit',
    appointmentDate: '2024-02-20',
    appointmentType: 'Online',
    consultationFee: '$100',
    status: 'Pending Documents',
    documents: ['Passport'],
    notes: 'Missing bank statement',
    createdAt: '2024-02-05'
  },
  {
    id: 4,
    clientName: 'Grace Mutua',
    email: 'grace.m@email.com',
    phone: '+254 733 456 789',
    country: 'USA',
    visaType: 'Business Visa',
    appointmentDate: '2024-02-12',
    appointmentType: 'Offline',
    consultationFee: '$250',
    status: 'Rejected',
    documents: ['Passport', 'Business License', 'Tax Returns'],
    notes: 'Resubmission recommended',
    createdAt: '2024-01-20'
  }
];
  // Cases state initialized as empty array
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await casesAPI.getAll();
        // setCases(response.data);
        
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setCases(MOCK_CASES);
      } catch (error) {
        toast.error('Failed to load cases');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const stats = [
    { label: 'Total Cases', value: cases.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Progress', value: cases.filter(c => c.status === 'In Progress').length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Approved', value: cases.filter(c => c.status === 'Approved').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Revenue', value: `$${cases.reduce((sum, c) => sum + parseInt(c.consultationFee.replace('$', '')), 0)}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New': return <Clock size={16} className="text-blue-500" />;
      case 'In Progress': return <AlertCircle size={16} className="text-yellow-500" />;
      case 'Pending Documents': return <Upload size={16} className="text-orange-500" />;
      case 'Approved': return <CheckCircle size={16} className="text-green-500" />;
      case 'Rejected': return <XCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Pending Documents': return 'bg-orange-100 text-orange-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddCase = () => {
    setEditingCase(null);
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      country: '',
      visaType: '',
      appointmentDate: '',
      appointmentType: 'Online',
      consultationFee: '',
      status: 'New',
      documents: [],
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEditCase = (caseItem) => {
    setEditingCase(caseItem);
    setFormData({
      clientName: caseItem.clientName,
      email: caseItem.email,
      phone: caseItem.phone,
      country: caseItem.country,
      visaType: caseItem.visaType,
      appointmentDate: caseItem.appointmentDate,
      appointmentType: caseItem.appointmentType,
      consultationFee: caseItem.consultationFee,
      status: caseItem.status,
      documents: caseItem.documents,
      notes: caseItem.notes
    });
    setIsModalOpen(true);
  };

  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setIsDetailsOpen(true);
  };

  const handleDeleteCase = (caseItem) => {
    toast(`Are you sure you want to delete case for ${caseItem.clientName}?`, {
      action: {
        label: 'Delete',
        onClick: () => {
          setCases(cases.filter(c => c.id !== caseItem.id));
          toast.success(`Case for ${caseItem.clientName} deleted successfully`);
        },
      },
      cancel: {
        label: 'Cancel',
      },
      duration: 5000,
    });
  };

  const handleExport = (format) => {
    toast.info(`Export as ${format.toUpperCase()} - Feature available after installing axios and xlsx packages`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (editingCase) {
      setCases(cases.map(c => c.id === editingCase.id ? { ...c, ...formData } : c));
      toast.success(`Case for ${formData.clientName} updated successfully`);
    } else {
      const newCase = {
        id: Math.max(...cases.map(c => c.id), 0) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCases([...cases, newCase]);
      toast.success(`Case for ${formData.clientName} added successfully`);
    }
    
    setLoading(false);
    setIsModalOpen(false);
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Visa & Migration Cases</h2>
          <p className="text-sm md:text-base text-slate-600">Manage visa applications and consultations</p>
        </div>
        <button 
          onClick={handleAddCase}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          New Case
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}>
                <Icon size={24} className={stat.color} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Documents">Pending Documents</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm group h-full">
              <Download size={18} className="text-slate-500" />
              <span>Export</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
              <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 rounded-md">Export as CSV</button>
              <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 rounded-md">Export as Excel</button>
              <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 rounded-md">Export as PDF</button>
            </div>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="overflow-x-auto modern-scrollbar-light">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600 uppercase">Client</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Country</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Visa Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Appointment</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Fee</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Status</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-slate-500 text-sm">Loading cases...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-slate-300 mb-3" />
                      <p>No cases found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCases.map((caseItem) => (
                <tr key={caseItem.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">{caseItem.clientName}</p>
                      <p className="text-xs text-slate-500">{caseItem.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">{caseItem.country}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{caseItem.visaType}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-slate-900">{caseItem.appointmentDate}</p>
                      <p className="text-xs text-slate-500">{caseItem.appointmentType}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-green-600">{caseItem.consultationFee}</td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(caseItem.status)}`}>
                      {getStatusIcon(caseItem.status)}
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewDetails(caseItem)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="View Details"
                      >
                        <Eye size={16} className="text-slate-400 group-hover:text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleEditCase(caseItem)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Edit"
                      >
                        <Edit size={16} className="text-slate-400 group-hover:text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCase(caseItem)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-slate-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCase ? 'Edit Visa Case' : 'New Visa Case'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Client Name</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="+254 700 123 456"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Destination Country</label>
              <select
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="">Select Country</option>
                <option value="Canada">Canada</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Visa Type</label>
              <select
                required
                value={formData.visaType}
                onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="">Select Visa Type</option>
                <option value="Study Visa">Study Visa</option>
                <option value="Work Visa">Work Visa</option>
                <option value="Tourist Visa">Tourist Visa</option>
                <option value="Business Visa">Business Visa</option>
                <option value="Family Visa">Family Visa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Consultation Fee</label>
              <input
                type="text"
                required
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="$150"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Appointment Date</label>
              <input
                type="date"
                required
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Appointment Type</label>
              <select
                required
                value={formData.appointmentType}
                onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Case Status</label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Documents">Pending Documents</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingCase ? 'Update Case' : 'Create Case'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      {selectedCase && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title="Case Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Client Info */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <User size={18} className="text-primary" />
                Client Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-medium text-slate-900">{selectedCase.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{selectedCase.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium text-slate-900">{selectedCase.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedCase.status)}`}>
                    {getStatusIcon(selectedCase.status)}
                    {selectedCase.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Visa Details */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                Visa Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Destination</p>
                  <p className="font-medium text-slate-900">{selectedCase.country}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Visa Type</p>
                  <p className="font-medium text-slate-900">{selectedCase.visaType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Appointment</p>
                  <p className="font-medium text-slate-900">{selectedCase.appointmentDate} ({selectedCase.appointmentType})</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Consultation Fee</p>
                  <p className="font-medium text-green-600">{selectedCase.consultationFee}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Upload size={18} className="text-primary" />
                Documents ({selectedCase.documents.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCase.documents.map((doc, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedCase.notes && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900 mb-3">Notes</h3>
                <p className="text-sm text-slate-600">{selectedCase.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
