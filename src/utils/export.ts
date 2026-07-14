import * as XLSX from 'xlsx';
import { SessionLog, Supervisor } from '../types';

export function exportSessionLogsToExcel(
  logs: SessionLog[],
  supervisor: Supervisor,
  userName: string,
  exportType: 'daily' | 'monthly'
) {
  const wb = XLSX.utils.book_new();

  // Create date boundary comments
  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate stats
  const completedSessions = logs.filter(l => l.status === 'COMPLETED');
  const totalFocusMin = completedSessions.reduce((acc, curr) => acc + curr.actualDuration, 0);
  const totalHours = (totalFocusMin / 60).toFixed(2);
  const totalStrikes = logs.reduce((acc, curr) => acc + curr.strikes, 0);
  const totalPauses = logs.reduce((acc, curr) => acc + curr.pausesUsed, 0);
  
  // Grade calculations
  let grade = 'F (SLACKER)';
  const successRate = logs.length > 0 ? (completedSessions.length / logs.length) * 100 : 0;
  if (successRate >= 90 && totalStrikes === 0) grade = 'A+ (PROUD GUARDIAN LEVEL)';
  else if (successRate >= 80 && totalStrikes <= 2) grade = 'B (ACCEPTABLE EFFORT)';
  else if (successRate >= 60 && totalStrikes <= 4) grade = 'C (WANDERING MIND)';
  else if (successRate >= 40) grade = 'D (DISAPPOINTMENT ROAD)';

  // 1. Sheet 1: Supervisor Summary Audit
  const summaryData = [
    ["YOU CAN'T ESCAPE FROM ME - STRICT ACCOUNTABILITY REPORT"],
    ["--------------------------------------------------------"],
    ["AUDIT STATUS", "STRICTLY MONITORED & VERIFIED"],
    ["REPORT TYPE", exportType.toUpperCase() + " SUMMARY"],
    ["DATE OF EXPORT", todayStr],
    [],
    ["SUBJECT CHARACTERISTICS"],
    ["Subject Name (Son/Nephew)", userName],
    ["Active Supervisor (Auditor)", supervisor.name],
    ["Auditor Profile / Role", supervisor.role],
    ["Supervisor Email Address", supervisor.email],
    ["Strictness Level", supervisor.strictness.toUpperCase()],
    [],
    ["CORE METRICS AUDIT"],
    ["Total Sessions Attempted", logs.length],
    ["Completed Focus Rounds", completedSessions.length],
    ["Total Focus Hours Logged", totalHours + " Hours"],
    ["Total Accountability Strikes", totalStrikes],
    ["Total Emergency Pauses Used", totalPauses],
    ["Final Performance Grade", grade],
    [],
    ["SUPERVISOR ENDORSEMENT STATEMENT"],
    [
      supervisor.type === 'father'
        ? "Arthur (Father) says: 'This report records every second of slacking. I am monitoring the daily progression tables to confirm actual output. Don't let me find empty slots.'"
        : "Uncle Dave says: 'Excellent, I will cross-reference this immediately with Timmy's 12-hour report. Your progression sheet looks okay, but do better. No excuses!'"
    ]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

  // Apply basic styles/merges if wanted, but keep it standard SheetJS (which has universal compatibility)
  wsSummary['!cols'] = [{ wch: 30 }, { wch: 50 }];

  // 2. Sheet 2: Detailed Focus Ledger
  const ledgerHeader = [
    "Log ID",
    "Date",
    "Time Started",
    "Focus Area / Active Subtask",
    "Target Min",
    "Actual Focus Min",
    "Session Status",
    "Pauses Used",
    "Strikes Earned",
    "Supervisor's Evaluation & Comments"
  ];

  const ledgerRows = logs.map(log => [
    log.id.slice(0, 8).toUpperCase(),
    log.date,
    log.time,
    log.focusArea || "No specific subtask registered",
    log.targetDuration,
    log.actualDuration,
    log.status,
    log.pausesUsed,
    log.strikes,
    log.evaluationComment
  ]);

  const wsLedger = XLSX.utils.aoa_to_sheet([ledgerHeader, ...ledgerRows]);
  wsLedger['!cols'] = [
    { wch: 10 }, // ID
    { wch: 12 }, // Date
    { wch: 12 }, // Time
    { wch: 30 }, // Focus Area
    { wch: 12 }, // Target
    { wch: 12 }, // Actual
    { wch: 15 }, // Status
    { wch: 12 }, // Pauses
    { wch: 12 }, // Strikes
    { wch: 55 }  // Comments
  ];

  // Append sheets
  XLSX.utils.book_append_sheet(wb, wsSummary, "AUDIT OVERVIEW");
  XLSX.utils.book_append_sheet(wb, wsLedger, "DETAILED LEDGER");

  // Write file
  const fileName = `Strict_Audit_${exportType}_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportSessionLogsToWordMock(
  logs: SessionLog[],
  supervisor: Supervisor,
  userName: string,
  exportType: 'daily' | 'monthly'
) {
  // To create a Word doc (.docx) styled layout without heavy docx library, 
  // we can export a beautiful HTML Document that opens in Word as a standard styled layout,
  // or a formatted markdown file, or download an elegant .doc text layout.
  // Using the HTML with application/msword MIME type is the gold-standard for client-side Word exports,
  // because it retains beautiful tables, borders, and typography directly when opened in Microsoft Word!
  
  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const completedSessions = logs.filter(l => l.status === 'COMPLETED');
  const totalFocusMin = completedSessions.reduce((acc, curr) => acc + curr.actualDuration, 0);
  const totalHours = (totalFocusMin / 60).toFixed(2);
  const totalStrikes = logs.reduce((acc, curr) => acc + curr.strikes, 0);

  let grade = 'F (SLACKER)';
  const successRate = logs.length > 0 ? (completedSessions.length / logs.length) * 100 : 0;
  if (successRate >= 90 && totalStrikes === 0) grade = 'A+ (EXEMPLARY)';
  else if (successRate >= 80) grade = 'B (SATISFACTORY)';
  else if (successRate >= 60) grade = 'C (WANDERING)';
  else if (successRate >= 40) grade = 'D (POOR)';

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>YOU CAN'T ESCAPE FROM ME - WORK AUDIT</title>
      <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #F4F1EA; color: #1A1A1A; padding: 20px; }
        h1 { text-align: center; font-size: 20pt; border-bottom: 2px solid #1A1A1A; padding-bottom: 10px; text-transform: uppercase; }
        h2 { font-size: 14pt; border-bottom: 1.5px solid #1A1A1A; margin-top: 20px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { border: 1.5px solid #1A1A1A; background-color: #E6E1D3; padding: 8px; text-align: left; font-weight: bold; }
        td { border: 1.5px solid #1A1A1A; padding: 8px; text-align: left; }
        .meta-box { border: 2px solid #1A1A1A; padding: 15px; background-color: #FBF9F6; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 9pt; color: #666666; }
        .strike { color: #FF0000; font-weight: bold; }
        .completed { color: #008000; }
        .failed { color: #FF0000; text-decoration: line-through; }
      </style>
    </head>
    <body>
      <h1>You Can't Escape From Me</h1>
      <p style="text-align: center; font-weight: bold;">OFFICIAL PROGRESSION & STUDY AUDIT SHEET</p>
      
      <div class="meta-box">
        <h3>1. AUDIT SPECIFICATIONS</h3>
        <p><b>Subject employee:</b> ${userName}</p>
        <p><b>Active Supervisor:</b> ${supervisor.name} (${supervisor.role})</p>
        <p><b>Audit Window:</b> ${exportType.toUpperCase()}</p>
        <p><b>Export Date:</b> ${todayStr}</p>
        <p><b>Performance Grade:</b> <span style="font-size: 14pt;">${grade}</span></p>
      </div>

      <h2>2. EXECUTIVE SUMMARY & METRICS</h2>
      <table>
        <tr>
          <th>Metric Name</th>
          <th>Logged Total</th>
          <th>Supervisor's Assessment Status</th>
        </tr>
        <tr>
          <td>Focus Rounds Logged</td>
          <td>${logs.length} Rounds</td>
          <td>${completedSessions.length} Completed Successfully</td>
        </tr>
        <tr>
          <td>Total Productive Duration</td>
          <td>${totalHours} Hours</td>
          <td>Target: Checked hourly</td>
        </tr>
        <tr>
          <td>Supervisor Strikes Earned</td>
          <td class="strike">${totalStrikes} Strikes</td>
          <td>${totalStrikes > 3 ? 'CRITICAL DISCIPLINE ACTIONS MANDATED' : 'STRICT MONITORING CONTINUED'}</td>
        </tr>
      </table>

      <h2>3. DETAILED ACTION LEDGER</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Focus Subtask</th>
            <th>Dur (Min)</th>
            <th>Status</th>
            <th>Strikes</th>
            <th>Supervisor Evaluation Commentary</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map(log => `
            <tr>
              <td>${log.date}</td>
              <td>${log.time}</td>
              <td>${log.focusArea}</td>
              <td>${log.actualDuration}m</td>
              <td class="${log.status === 'COMPLETED' ? 'completed' : 'failed'}">${log.status}</td>
              <td>${log.strikes}</td>
              <td>${log.evaluationComment}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>4. SUPERVISOR ENDORSEMENT & SIGN-OFF</h2>
      <p style="font-style: italic; background-color: #E6E1D3; padding: 10px; border: 1px solid #1A1A1A;">
        "${supervisor.type === 'father' 
          ? `I, Father Arthur, hereby certify that this progression sheet accurately reflects ${userName}'s real working hours. Slacking has been logged and reprimanded accordingly.` 
          : `I, Uncle Dave, verify that these numbers have been logged. I've sent a copy to Cousin Timmy's household to keep the pressure on.`
        }"
      </p>
      <br/><br/>
      <p><b>Supervisor Signature:</b> ___________________________</p>
      <p><b>Date Signed:</b> ${todayStr}</p>

      <div class="footer">
        Generated by "You Can't Escape From Me" Strict Accountability Engine.
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Strict_Audit_${exportType}_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
