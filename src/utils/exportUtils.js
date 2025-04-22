import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportAsCSV = (entries) => {
    const headers = ['Date', 'Mood', 'Note', 'Weather', 'Temperature'];
    
    const rows = entries.map(entry => [
      new Date(entry.date).toLocaleDateString(),
      entry.mood,
      `"${entry.note.replace(/"/g, '""')}"`,
      entry.weather?.description || 'N/A',
      entry.weather?.temp ? `${Math.round(entry.weather.temp)}°C` : 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mood-journal-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

export const exportAsPDF = (entries) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Mood Journal Entries', 14, 22);
 
  doc.setFontSize(12);
  doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableData = entries.map(entry => [
    new Date(entry.date).toLocaleDateString(),
    entry.mood,
    entry.note,
    entry.weather?.description || 'N/A',
    entry.weather?.temp ? `${Math.round(entry.weather.temp)}°C` : 'N/A'
  ]);

  doc.autoTable({
    startY: 40,
    head: [['Date', 'Mood', 'Note', 'Weather', 'Temperature']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [255, 148, 114] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 30 },
      2: { cellWidth: 60 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 }
    }
  });

  doc.save(`mood-journal-export-${new Date().toISOString().split('T')[0]}.pdf`);
};