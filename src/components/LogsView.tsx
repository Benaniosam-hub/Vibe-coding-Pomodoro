import React from 'react';
import { SessionLog, Supervisor } from '../types';
import EInkCard from './EInkCard';
import { FileDown, FileSpreadsheet, ListTodo, PlusCircle, Trash2 } from 'lucide-react';
import { exportSessionLogsToExcel, exportSessionLogsToWordMock } from '../utils/export';

interface LogsViewProps {
  logs: SessionLog[];
  supervisor: Supervisor;
  userName: string;
  onClearLogs: () => void;
  onAddSimulatedLog: () => void;
}

export default function LogsView({
  logs,
  supervisor,
  userName,
  onClearLogs,
  onAddSimulatedLog
}: LogsViewProps) {
  
  const handleExportExcel = (type: 'daily' | 'monthly') => {
    if (logs.length === 0) {
      alert("No logs available to export! Please complete or simulate a focus round first.");
      return;
    }
    exportSessionLogsToExcel(logs, supervisor, userName, type);
  };

  const handleExportWord = () => {
    if (logs.length === 0) {
      alert("No logs available to export! Please complete or simulate a focus round first.");
      return;
    }
    exportSessionLogsToWordMock(logs, supervisor, userName, 'monthly');
  };

  return (
    <div className="space-y-4">
      {/* Export operations command center */}
      <EInkCard title="AUDIT DATA EXPORT CENTER" subtitle="Direct Local File Operations">
        <p className="font-mono text-xs text-charcoal-muted mb-4 leading-relaxed">
          The accountability system compiles your working hour sessions continuously. 
          Use the physical action controls below to generate structured Excel (.xlsx) workbooks or Word (.docx/.doc) reports.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Daily Excel export */}
          <button
            id="export-excel-daily-btn"
            onClick={() => handleExportExcel('daily')}
            className="flex items-center justify-center gap-2 bg-paper-light border-2 border-charcoal text-charcoal font-display font-bold py-2 px-3 rounded uppercase text-xs hover:bg-charcoal hover:text-paper cursor-pointer transition-all duration-150 eink-shadow-sm eink-btn-active"
          >
            <FileSpreadsheet size={16} /> Export Daily Excel (.xlsx)
          </button>

          {/* Monthly Excel export */}
          <button
            id="export-excel-monthly-btn"
            onClick={() => handleExportExcel('monthly')}
            className="flex items-center justify-center gap-2 bg-paper-light border-2 border-charcoal text-charcoal font-display font-bold py-2 px-3 rounded uppercase text-xs hover:bg-charcoal hover:text-paper cursor-pointer transition-all duration-150 eink-shadow-sm eink-btn-active"
          >
            <FileSpreadsheet size={16} /> Export Monthly Excel (.xlsx)
          </button>

          {/* Word document report */}
          <button
            id="export-word-btn"
            onClick={handleExportWord}
            className="flex items-center justify-center gap-2 bg-charcoal text-paper font-display font-bold py-2 px-3 rounded uppercase text-xs hover:bg-paper-light hover:text-charcoal cursor-pointer transition-all duration-150 border-2 border-charcoal eink-shadow-sm eink-btn-active"
          >
            <FileDown size={16} /> Export Word Audit (.doc)
          </button>
        </div>

        {/* Diagnostic commands for testing the file export */}
        <div className="flex flex-wrap gap-2 justify-between items-center mt-4 pt-3 border-t border-dashed border-charcoal-light">
          <span className="font-mono text-[11px] text-charcoal-muted">
            * Generated files automatically save directly to your browser's local downloads folder.
          </span>
          
          <div className="flex gap-2">
            <button
              id="simulate-log-btn"
              onClick={onAddSimulatedLog}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase bg-paper-dark border border-charcoal px-2.5 py-1 rounded hover:bg-charcoal hover:text-paper cursor-pointer transition-all"
              title="Add a fully populated mock log entry to test the export spreadsheet instantly."
            >
              <PlusCircle size={12} /> Seed Mock Session Log
            </button>
            
            {logs.length > 0 && (
              <button
                id="clear-logs-btn"
                onClick={onClearLogs}
                className="flex items-center gap-1 font-mono text-[10px] uppercase text-charcoal-muted hover:text-charcoal border border-charcoal-light hover:border-charcoal px-2 py-1 rounded cursor-pointer"
              >
                <Trash2 size={12} /> Wipe Ledger
              </button>
            )}
          </div>
        </div>
      </EInkCard>

      {/* Focus rounds table list */}
      <EInkCard title={`WORK SESSION LEDGER (${logs.length})`} subtitle="Form #401-B">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <ListTodo size={40} className="mx-auto text-charcoal-muted opacity-40 mb-2" />
            <span className="block font-display font-bold text-sm uppercase text-charcoal-muted">
              NO WORK MINUTES LOGGED YET
            </span>
            <p className="font-mono text-[11px] text-charcoal-muted mt-1 max-w-sm mx-auto">
              Please configure your task, initialize the session timer, and focus. Once completed, your auditor will sign-off the entry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-charcoal text-[11px] font-mono uppercase text-charcoal bg-paper-dark">
                  <th className="py-2.5 px-2">Date/Time</th>
                  <th className="py-2.5 px-2">Subtask Detail</th>
                  <th className="py-2.5 px-2 text-center">Goal</th>
                  <th className="py-2.5 px-2 text-center">Actual</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                  <th className="py-2.5 px-2 text-center">Strikes</th>
                  <th className="py-2.5 px-2">Auditor's Sign-Off Comment</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-charcoal-light hover:bg-paper-light transition-colors"
                  >
                    <td className="py-3 px-2 font-mono text-[11px] whitespace-nowrap">
                      {log.date} <span className="text-charcoal-muted">@{log.time}</span>
                    </td>
                    <td className="py-3 px-2 font-medium font-sans">
                      {log.focusArea}
                    </td>
                    <td className="py-3 px-2 text-center font-mono">
                      {log.targetDuration}m
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold">
                      {log.actualDuration}m
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border uppercase ${
                        log.status === 'COMPLETED'
                          ? 'bg-paper-light text-charcoal border-charcoal font-bold'
                          : 'bg-paper-dark text-charcoal-muted border-charcoal-muted line-through'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold">
                      {log.strikes > 0 ? (
                        <span className="underline decoration-2 text-charcoal font-black">{log.strikes}</span>
                      ) : (
                        '0'
                      )}
                    </td>
                    <td className="py-3 px-2 font-serif italic text-charcoal-muted max-w-xs truncate" title={log.evaluationComment}>
                      "{log.evaluationComment}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </EInkCard>
    </div>
  );
}
