/**
 * Export utilities for generating CSV, Excel, and PDF files
 */

// Export data to CSV
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

// Export data to Excel (requires xlsx library)
export const exportToExcel = async (data, filename = 'export.xlsx', sheetName = 'Sheet1') => {
  try {
    // Check if xlsx is available, otherwise use dynamic import
    let XLSX;
    try {
      XLSX = await import('xlsx');
    } catch (importError) {
      console.warn('xlsx library not installed. Please run: npm install xlsx');
      console.warn('Falling back to CSV export...');
      exportToCSV(data, filename.replace('.xlsx', '.csv'));
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Excel export failed:', error);
    // Fallback to CSV if xlsx export fails
    exportToCSV(data, filename.replace('.xlsx', '.csv'));
  }
};

// Helper to download blob
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Download file from API response (blob)
export const downloadFile = (blob, filename) => {
  downloadBlob(blob, filename);
};

// Format data for export (clean up for CSV/Excel)
export const formatDataForExport = (data, fieldsMap = {}) => {
  return data.map(item => {
    const formatted = {};
    Object.keys(fieldsMap).forEach(key => {
      const label = fieldsMap[key];
      formatted[label] = item[key];
    });
    return formatted;
  });
};

// Export templates for different entities
export const exportTemplates = {
  users: {
    fields: {
      id: 'ID',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      phone: 'Phone',
      country: 'Country',
      status: 'Status',
      joined: 'Join Date',
    },
  },
  applications: {
    fields: {
      id: 'Application ID',
      studentName: 'Student Name',
      email: 'Email',
      scholarship: 'Scholarship',
      status: 'Status',
      gpa: 'GPA',
      date: 'Application Date',
    },
  },
  visaCases: {
    fields: {
      id: 'Case ID',
      clientName: 'Client Name',
      email: 'Email',
      country: 'Destination',
      visaType: 'Visa Type',
      status: 'Status',
      appointmentDate: 'Appointment Date',
      consultationFee: 'Fee',
    },
  },
};
