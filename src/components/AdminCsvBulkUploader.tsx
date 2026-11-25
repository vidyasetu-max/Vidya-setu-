import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Course } from '../types/education';

export interface ValidCsvPaymentRecord {
  studentName: string;
  studentIdentifier: string;
  courseTitle: string;
  amountInr: number;
  paymentReference: string;
}

interface ParsedCsvRow {
  lineNumber: number;
  rawLine: string;
  studentName: string;
  studentIdentifier: string;
  courseTitle: string;
  amountInr: number;
  paymentReference: string;
  errors: string[];
  isValid: boolean;
}

interface CsvValidationResult {
  globalError: string | null;
  headerLine: string | null;
  rows: ParsedCsvRow[];
  validRows: ValidCsvPaymentRecord[];
  invalidRows: Array<{
    lineNumber: number;
    rawLine: string;
    errors: string[];
  }>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+?\d[\d\s-]{7,15})$/;

function parseCsvColumns(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function validateCsvText(csvText: string): CsvValidationResult {
  if (!csvText.trim()) {
    return {
      globalError: null,
      headerLine: null,
      rows: [],
      validRows: [],
      invalidRows: [],
    };
  }

  const rawLines = csvText.split(/\r?\n/);
  const nonEmptyEntries = rawLines
    .map((raw, idx) => ({ raw: raw.trim(), lineNumber: idx + 1 }))
    .filter((item) => item.raw.length > 0);

  if (nonEmptyEntries.length === 0) {
    return {
      globalError: null,
      headerLine: null,
      rows: [],
      validRows: [],
      invalidRows: [],
    };
  }

  const firstRaw = nonEmptyEntries[0].raw;
  const firstLower = firstRaw.toLowerCase();
  const looksLikeHeader =
    firstLower.includes('student') ||
    firstLower.includes('email') ||
    firstLower.includes('course') ||
    firstLower.includes('amount') ||
    firstLower.includes('payment');

  if (!firstRaw.includes(',') && (firstRaw.includes(';') || firstRaw.includes('\t'))) {
    return {
      globalError:
        'Invalid CSV delimiter detected (found semicolons or tabs instead of commas). Please format your CSV using commas (,) as separators.',
      headerLine: null,
      rows: [],
      validRows: [],
      invalidRows: [],
    };
  }

  const headerLine = looksLikeHeader ? firstRaw : null;
  const dataEntries = looksLikeHeader
    ? nonEmptyEntries.slice(1)
    : nonEmptyEntries;

  if (looksLikeHeader && dataEntries.length === 0) {
    return {
      globalError:
        'CSV contains only a header row and no student payment records. Add at least one data row below the header.',
      headerLine,
      rows: [],
      validRows: [],
      invalidRows: [],
    };
  }

  const rows: ParsedCsvRow[] = dataEntries.map(({ raw, lineNumber }) => {
    const cols = parseCsvColumns(raw);
    const errors: string[] = [];

    if (!raw.includes(',') && (raw.includes(';') || raw.includes('\t'))) {
      errors.push('Uses semicolon/tab instead of comma (,) delimiter');
    } else if (cols.length < 3) {
      errors.push(
        `Expected at least 3 columns (studentName, studentIdentifier, courseTitle), found ${cols.length}`
      );
    } else if (cols.length > 5) {
      errors.push(
        `Too many columns (${cols.length} found, max 5 expected). Wrap values containing commas in quotes`
      );
    }

    const [
      studentName = '',
      studentIdentifier = '',
      courseTitle = '',
      amountStr = '',
      paymentReference = '',
    ] = cols;

    if (!studentName) {
      errors.push('Missing studentName');
    } else if (studentName.length < 2) {
      errors.push('studentName is too short');
    }

    if (!studentIdentifier) {
      errors.push('Missing studentIdentifier (Gmail or Phone)');
    } else if (
      !EMAIL_REGEX.test(studentIdentifier) &&
      !PHONE_REGEX.test(studentIdentifier)
    ) {
      errors.push('Invalid email or phone format in studentIdentifier');
    }

    if (!courseTitle) {
      errors.push('Missing courseTitle');
    }

    const cleanedAmount = amountStr.replace(/[₹,\s]/g, '');
    let parsedAmount = 0;
    if (!amountStr) {
      errors.push('Missing amountInr');
    } else if (!/^\d+(\.\d+)?$/.test(cleanedAmount)) {
      errors.push(`Invalid amountInr "${amountStr}" (must be a number)`);
    } else {
      parsedAmount = Number(cleanedAmount);
      if (parsedAmount <= 0) {
        errors.push('amountInr must be greater than 0');
      }
    }

    return {
      lineNumber,
      rawLine: raw,
      studentName,
      studentIdentifier,
      courseTitle,
      amountInr: parsedAmount,
      paymentReference,
      errors,
      isValid: errors.length === 0,
    };
  });

  const validRows: ValidCsvPaymentRecord[] = rows
    .filter((r) => r.isValid)
    .map((r) => ({
      studentName: r.studentName,
      studentIdentifier: r.studentIdentifier,
      courseTitle: r.courseTitle,
      amountInr: r.amountInr,
      paymentReference: r.paymentReference,
    }));

  const invalidRows = rows
    .filter((r) => !r.isValid)
    .map((r) => ({
      lineNumber: r.lineNumber,
      rawLine: r.rawLine,
      errors: r.errors,
    }));

  const globalError =
    rows.length > 0 && validRows.length === 0
      ? `All ${rows.length} CSV row(s) have format or validation errors. Fix the highlighted rows below before importing.`
      : null;

  return {
    globalError,
    headerLine,
    rows,
    validRows,
    invalidRows,
  };
}

interface AdminCsvBulkUploaderProps {
  courses: Course[];
  onBulkPendingAccess?: (
    records: ValidCsvPaymentRecord[],
    autoApprove: boolean
  ) => Promise<void>;
  onToast: (msg: string) => void;
}

export const AdminCsvBulkUploader: React.FC<AdminCsvBulkUploaderProps> =
  React.memo(({ courses, onBulkPendingAccess, onToast }) => {
    const [csvText, setCsvText] = useState('');
    const [csvFileName, setCsvFileName] = useState('');
    const [csvUploadError, setCsvUploadError] = useState<string | null>(null);
    const [isBulkImporting, setIsBulkImporting] = useState(false);

    const csvValidationResult = useMemo(
      () => validateCsvText(csvText),
      [csvText]
    );

    const handleDownloadSampleCsv = () => {
      const sampleCourse1 = courses[0]?.title || 'Class 12 Physics';
      const sampleCourse2 = courses[1]?.title || 'UPSC Prelims';
      const sample = [
        'studentName,studentIdentifier,courseTitle,amountInr,paymentReference',
        `Rohan Verma,rohan.verma@gmail.com,${sampleCourse1.replace(/,/g, '')},1499,UTR-4092817462`,
        `Priya Singh,+91 9811223344,${sampleCourse2.replace(/,/g, '')},2499,UTR-5192038471`,
      ].join('\n');
      const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student-payments-sample.csv';
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bulk CSV Upload — Manual Student Payment Records
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Ek saath multiple students ke offline/UTR/UPI payment records CSV file se upload karke queue ya auto-approve karein.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadSampleCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50 cursor-pointer transition-colors">
            <Upload className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-xs font-bold text-slate-800">
              {csvFileName || 'Choose .CSV File to Upload'}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 font-mono-tabular">
              Columns: studentName, studentIdentifier, courseTitle, amountInr, paymentReference
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setCsvUploadError(null);
                if (
                  !file.name.toLowerCase().endsWith('.csv') &&
                  file.type !== 'text/csv'
                ) {
                  setCsvUploadError(
                    `Unsupported file "${file.name}". Please upload a valid .csv file.`
                  );
                  e.target.value = '';
                  return;
                }
                setCsvFileName(file.name);
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    if (!reader.result.trim()) {
                      setCsvUploadError(
                        `The uploaded file "${file.name}" is empty.`
                      );
                    }
                    setCsvText(reader.result);
                  }
                };
                reader.onerror = () => {
                  setCsvUploadError(
                    `Failed to read "${file.name}". Please try again or paste CSV rows directly.`
                  );
                };
                reader.readAsText(file);
                e.target.value = '';
              }}
            />
          </label>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Or Paste CSV Rows Directly
            </label>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => {
                setCsvUploadError(null);
                setCsvText(e.target.value);
              }}
              placeholder={
                'studentName,studentIdentifier,courseTitle,amountInr,paymentReference\nAarav Sharma,aarav@gmail.com,Class 12 Physics,1499,UTR-99887766'
              }
              className="w-full px-3 py-2 text-xs font-mono-tabular border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {(csvUploadError || csvValidationResult.globalError) && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">CSV Format / Validation Error</p>
              <p>{csvUploadError || csvValidationResult.globalError}</p>
              <p className="text-[11px] text-red-700 font-mono-tabular">
                Expected format: studentName, studentIdentifier (Gmail or Phone), courseTitle, amountInr, paymentReference
              </p>
            </div>
          </div>
        )}

        {csvValidationResult.rows.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {csvValidationResult.validRows.length} Valid
                </span>
                {csvValidationResult.invalidRows.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-800 border border-red-200">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    {csvValidationResult.invalidRows.length} Invalid (Highlighted Below)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {csvValidationResult.invalidRows.length > 0 &&
                  csvValidationResult.validRows.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const validLines = csvValidationResult.rows
                          .filter((r) => r.isValid)
                          .map((r) => r.rawLine);
                        const nextText = csvValidationResult.headerLine
                          ? [csvValidationResult.headerLine, ...validLines].join(
                              '\n'
                            )
                          : validLines.join('\n');
                        setCsvText(nextText);
                        setCsvUploadError(null);
                      }}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Remove Invalid Rows
                    </button>
                  )}
                <button
                  type="button"
                  onClick={() => {
                    setCsvText('');
                    setCsvFileName('');
                    setCsvUploadError(null);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Clear CSV
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-3">Row</th>
                    <th className="py-2 px-3">Student</th>
                    <th className="py-2 px-3">Gmail / Phone</th>
                    <th className="py-2 px-3">Course</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">UTR / Ref</th>
                    <th className="py-2 px-3">Status / Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {csvValidationResult.rows.map((row) => (
                    <tr
                      key={row.lineNumber}
                      className={
                        row.isValid
                          ? 'bg-white'
                          : 'bg-red-50/90 border-l-4 border-l-red-500'
                      }
                    >
                      <td className="py-2 px-3 font-mono-tabular text-slate-500">
                        #{row.lineNumber}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {row.studentName || (
                          <span className="text-red-600 italic">Missing</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono-tabular text-slate-600">
                        {row.studentIdentifier || (
                          <span className="text-red-600 italic">Missing</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-indigo-700 font-medium">
                        {row.courseTitle || (
                          <span className="text-red-600 italic">Missing</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono-tabular font-semibold">
                        {row.amountInr > 0 ? (
                          `₹${row.amountInr}`
                        ) : (
                          <span className="text-red-600 italic">Invalid</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono-tabular text-slate-600">
                        {row.paymentReference || 'Auto-Ref'}
                      </td>
                      <td className="py-2 px-3">
                        {row.isValid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Valid
                          </span>
                        ) : (
                          <ul className="space-y-0.5 text-[11px] font-medium text-red-700">
                            {row.errors.map((err, idx) => (
                              <li key={idx}>• {err}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={
                  isBulkImporting ||
                  !onBulkPendingAccess ||
                  csvValidationResult.validRows.length === 0
                }
                onClick={async () => {
                  if (
                    !onBulkPendingAccess ||
                    csvValidationResult.validRows.length === 0
                  )
                    return;
                  setIsBulkImporting(true);
                  setCsvUploadError(null);
                  try {
                    await onBulkPendingAccess(
                      csvValidationResult.validRows,
                      false
                    );
                    const importedCount = csvValidationResult.validRows.length;
                    if (csvValidationResult.invalidRows.length > 0) {
                      const remainingLines = csvValidationResult.rows
                        .filter((r) => !r.isValid)
                        .map((r) => r.rawLine);
                      setCsvText(
                        csvValidationResult.headerLine
                          ? [
                              csvValidationResult.headerLine,
                              ...remainingLines,
                            ].join('\n')
                          : remainingLines.join('\n')
                      );
                      onToast(
                        `Imported ${importedCount} valid records. ${csvValidationResult.invalidRows.length} invalid row(s) kept for review.`
                      );
                    } else {
                      setCsvText('');
                      setCsvFileName('');
                      onToast(
                        `Added ${importedCount} CSV records to Pending Queue!`
                      );
                    }
                  } catch (err) {
                    setCsvUploadError(
                      err instanceof Error
                        ? err.message
                        : 'Failed to import CSV records. Your CSV data has been preserved.'
                    );
                  } finally {
                    setIsBulkImporting(false);
                  }
                }}
                className="px-4 py-2.5 text-xs font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-300 rounded-xl transition-colors cursor-pointer"
              >
                {isBulkImporting
                  ? 'Processing...'
                  : csvValidationResult.invalidRows.length > 0
                    ? `Import ${csvValidationResult.validRows.length} Valid as Pending (Skip ${csvValidationResult.invalidRows.length} Invalid)`
                    : `Import ${csvValidationResult.validRows.length} as Pending Queue`}
              </button>

              <button
                type="button"
                disabled={
                  isBulkImporting ||
                  !onBulkPendingAccess ||
                  csvValidationResult.validRows.length === 0
                }
                onClick={async () => {
                  if (
                    !onBulkPendingAccess ||
                    csvValidationResult.validRows.length === 0
                  )
                    return;
                  setIsBulkImporting(true);
                  setCsvUploadError(null);
                  try {
                    await onBulkPendingAccess(
                      csvValidationResult.validRows,
                      true
                    );
                    const importedCount = csvValidationResult.validRows.length;
                    if (csvValidationResult.invalidRows.length > 0) {
                      const remainingLines = csvValidationResult.rows
                        .filter((r) => !r.isValid)
                        .map((r) => r.rawLine);
                      setCsvText(
                        csvValidationResult.headerLine
                          ? [
                              csvValidationResult.headerLine,
                              ...remainingLines,
                            ].join('\n')
                          : remainingLines.join('\n')
                      );
                      onToast(
                        `Approved ${importedCount} valid records. ${csvValidationResult.invalidRows.length} invalid row(s) kept for review.`
                      );
                    } else {
                      setCsvText('');
                      setCsvFileName('');
                      onToast(
                        `Approved & Unlocked ${importedCount} Student Courses from CSV!`
                      );
                    }
                  } catch (err) {
                    setCsvUploadError(
                      err instanceof Error
                        ? err.message
                        : 'Failed to auto-approve CSV records. Your CSV data has been preserved.'
                    );
                  } finally {
                    setIsBulkImporting(false);
                  }
                }}
                className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isBulkImporting
                    ? 'Processing...'
                    : csvValidationResult.invalidRows.length > 0
                      ? `Auto-Approve ${csvValidationResult.validRows.length} Valid (Skip ${csvValidationResult.invalidRows.length} Invalid)`
                      : `Import & Auto-Approve All (${csvValidationResult.validRows.length})`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  });

AdminCsvBulkUploader.displayName = 'AdminCsvBulkUploader';
