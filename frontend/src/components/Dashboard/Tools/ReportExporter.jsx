import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, FileText, Image, RefreshCw } from 'lucide-react';

export default function ReportExporter({ containerId }) {
  const [exporting, setExporting] = useState(false);

  const captureElement = async () => {
    const element = document.getElementById(containerId);
    if (!element) {
      console.error(`Element with id ${containerId} not found`);
      return null;
    }
    
    // Scale canvas up for high-res output, force dark-theme styles if dark is active
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#0B1020',
      logging: false,
      onclone: (clonedDoc) => {
        // Enforce dark styling on cloned target for report consistency
        const clonedEl = clonedDoc.getElementById(containerId);
        if (clonedEl) {
          clonedEl.style.backgroundColor = '#0B1020';
          clonedEl.style.color = '#F8FAFC';
        }
      }
    });
    return canvas;
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const canvas = await captureElement();
      if (!canvas) return;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate responsive image height matching A4 width ratio
      const ratio = pdfWidth / imgWidth;
      const finalImgHeight = imgHeight * ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalImgHeight);
      pdf.save('codepulse-analytics-report.pdf');
    } catch (e) {
      console.error('Failed to export PDF:', e);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPNG = async () => {
    setExporting(true);
    try {
      const canvas = await captureElement();
      if (!canvas) return;

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'codepulse-analytics-snapshot.png';
      link.click();
    } catch (e) {
      console.error('Failed to export PNG:', e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportPNG}
        disabled={exporting}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 transition-all"
        title="Export PNG Snapshot"
      >
        {exporting ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Image className="h-3.5 w-3.5" />
        )}
        <span>Export PNG</span>
      </button>

      <button
        onClick={handleExportPDF}
        disabled={exporting}
        className="flex items-center gap-1.5 rounded-lg bg-primary-violet px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 transition-all shadow"
        title="Export PDF Report"
      >
        {exporting ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <FileText className="h-3.5 w-3.5" />
        )}
        <span>Export PDF</span>
      </button>
    </div>
  );
}
