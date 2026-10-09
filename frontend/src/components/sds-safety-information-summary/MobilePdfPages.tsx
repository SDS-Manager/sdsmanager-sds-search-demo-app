import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface MobilePdfPagesProps {
  file: string;
}

/**
 * The summary PDF as one canvas per page, as wide as the container (DIMA-1747).
 * Phones and tablets get this instead of an <iframe>, which Android Chrome
 * leaves blank and iOS / iPadOS freezes on the first page. The parent loads
 * it lazily, so desktop never downloads pdf.js.
 */
const MobilePdfPages = ({ file }: MobilePdfPagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);

  // Re-fit on rotate / resize, and when a scrollbar appears and narrows the
  // container -- a width taken once would leave the pages wider than the screen.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => setPageWidth(container.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      <Document
        file={file}
        onLoadSuccess={({ numPages: loadedPages }) => setNumPages(loadedPages)}
        loading={<CircularProgress />}
        error={
          <Typography color="error">
            The PDF cannot be shown here. Use Download PDF instead.
          </Typography>
        }
      >
        {pageWidth > 0 &&
          Array.from({ length: numPages }, (_, index) => (
            <Box key={index + 1} sx={{ mb: 2, boxShadow: 1 }}>
              <Page
                pageNumber={index + 1}
                width={pageWidth}
                // Canvas only: no text / annotation layer CSS to load, and
                // less work on low-end phones. Download covers copying text.
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading=""
              />
            </Box>
          ))}
      </Document>
    </Box>
  );
};

export default MobilePdfPages;
