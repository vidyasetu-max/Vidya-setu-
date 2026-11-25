import type { CourseModule } from '../types/education';

/**
 * Extracts a numeric chapter/lecture/part index from a module's chapterNumber
 * or title (e.g. "Chapter 12: ...", "Ch 5", "14. Quadratic Equations", "Lecture 3").
 */
export function extractChapterNumber(
  mod: Pick<CourseModule, 'chapterNumber' | 'title'>,
  fallbackIndex: number
): number {
  if (
    typeof mod.chapterNumber === 'number' &&
    Number.isFinite(mod.chapterNumber) &&
    mod.chapterNumber > 0
  ) {
    return mod.chapterNumber;
  }

  const title = (mod.title || '').trim();
  const prefixMatch = title.match(
    /^(?:chapter|ch|lecture|lec|part|unit|module|lesson)?\s*[-:.#]?\s*(\d+)\b/i
  );
  if (prefixMatch && prefixMatch[1]) {
    const parsed = parseInt(prefixMatch[1], 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  const anyNumberMatch = title.match(
    /\b(?:chapter|ch|lecture|lec|part|unit|module|lesson)\s*[-:.#]?\s*(\d+)\b/i
  );
  if (anyNumberMatch && anyNumberMatch[1]) {
    const parsed = parseInt(anyNumberMatch[1], 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return fallbackIndex + 1;
}

/**
 * Normalizes a chapter title so it cleanly displays in 1, 2, 3... symmetry
 * without duplicating "Chapter N:" prefixes.
 */
export function formatSymmetricChapterTitle(
  rawTitle: string,
  seqNumber: number
): string {
  const cleaned = rawTitle
    .trim()
    .replace(
      /^(?:chapter|ch|lecture|lec|part|unit|module|lesson)\s*[-:.#]?\s*\d+\s*[-:.–—]?\s*/i,
      ''
    )
    .replace(/^\d+\s*[-:.)–—]\s*/, '')
    .trim();

  return cleaned
    ? `Chapter ${seqNumber}: ${cleaned}`
    : `Chapter ${seqNumber}`;
}

/**
 * Sorts course modules in ascending numerical order (1, 2, 3, ..., 9, 10, ..., 30)
 * and assigns sequential chapterNumber (1..N) and symmetric Chapter N: titles.
 */
export function sortAndNumberModulesSymmetrically(
  modules: CourseModule[],
  options?: { normalizeTitles?: boolean }
): CourseModule[] {
  const normalizeTitles = options?.normalizeTitles ?? true;

  const indexed = modules.map((mod, idx) => ({
    mod,
    extractedNum: extractChapterNumber(mod, idx),
    originalIdx: idx,
  }));

  indexed.sort((a, b) => {
    if (a.extractedNum !== b.extractedNum) {
      return a.extractedNum - b.extractedNum;
    }
    const titleCmp = (a.mod.title || '').localeCompare(
      b.mod.title || '',
      undefined,
      { numeric: true, sensitivity: 'base' }
    );
    if (titleCmp !== 0) return titleCmp;
    return a.originalIdx - b.originalIdx;
  });

  return indexed.map(({ mod }, idx) => {
    const seqNumber = idx + 1;
    return {
      ...mod,
      chapterNumber: seqNumber,
      title: normalizeTitles
        ? formatSymmetricChapterTitle(mod.title || '', seqNumber)
        : mod.title,
    };
  });
}
