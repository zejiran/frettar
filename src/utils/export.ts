import html2canvas from 'html2canvas';
import { ExportService, ExportOptions } from '@/types';

export const checkClipboardSupport = (): {
  supported: boolean;
  reason?: string;
} => {
  if (!navigator.clipboard) {
    return {
      supported: false,
      reason: 'Clipboard API not available in this browser'
    };
  }

  if (typeof navigator.clipboard.write !== 'function') {
    return {
      supported: false,
      reason: 'Clipboard write functionality not available'
    };
  }

  if (!window.isSecureContext) {
    return {
      supported: false,
      reason: 'Clipboard access requires HTTPS or localhost'
    };
  }

  if (!window.ClipboardItem) {
    return {
      supported: false,
      reason: 'ClipboardItem not supported in this browser'
    };
  }

  return { supported: true };
};

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'png',
  quality: 1.0,
  scale: 2,
};

// Helper function to create filename with title
const createFilename = (title?: string, format: string = 'png'): string => {
  const sanitizedTitle = title ? title.trim().replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '-') : '';
  const dateStr = new Date().toISOString().split('T')[0];

  return sanitizedTitle
    ? `fretboard-${sanitizedTitle}-${dateStr}.${format}`
    : `fretboard-${dateStr}.${format}`;
};

export const exportService: ExportService = {
  exportToImage: async (
    fretboardRef: React.RefObject<HTMLDivElement>,
    options: Partial<ExportOptions> = {},
    title?: string
  ): Promise<void> => {
    const finalOptions = { ...DEFAULT_EXPORT_OPTIONS, ...options };

    if (!fretboardRef.current) {
      throw new Error('Fretboard reference is not available');
    }

    try {
      // Create a wrapper with better styling for export
      const exportWrapper = document.createElement('div');
      exportWrapper.style.cssText = `
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        font-family: 'Inter', sans-serif;
        position: relative;
      `;

      // Add main title - use user title if provided, otherwise default
      const mainTitle = document.createElement('div');
      mainTitle.style.cssText = `
        text-align: center;
        margin-bottom: 30px;
        font-size: 32px;
        font-weight: bold;
        color: #1e293b;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      `;

      if (title && title.trim()) {
        mainTitle.textContent = title.trim();
      } else {
        mainTitle.innerHTML = '🎸 Frettar - Guitar Fretboard';
      }

      exportWrapper.appendChild(mainTitle);

      // Clone the fretboard with enhanced styling
      const fretboardClone = fretboardRef.current.cloneNode(true) as HTMLElement;
      fretboardClone.style.cssText = `
        border: 4px solid #1e293b;
        border-radius: 16px;
        background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
        box-shadow:
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        overflow: hidden;
      `;

      // Enhance fret cells for export
      const fretCells = fretboardClone.querySelectorAll('[data-string]');
      fretCells.forEach((cell: Element) => {
        const htmlCell = cell as HTMLElement;
        const isSelected = htmlCell.classList.contains('selected') ||
                          htmlCell.style.backgroundColor !== 'white' &&
                          htmlCell.style.backgroundColor !== '';

        if (isSelected) {
          htmlCell.style.boxShadow = `
            0 0 0 3px ${htmlCell.style.backgroundColor}40,
            0 8px 16px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `;
          htmlCell.style.border = '3px solid #1e293b';
        } else {
          htmlCell.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.05)';
          htmlCell.style.border = '1px solid #cbd5e1';
        }

        htmlCell.style.fontWeight = 'bold';
        htmlCell.style.fontSize = '10px';
        htmlCell.style.overflow = 'visible';
        htmlCell.style.position = 'relative';

        const annotation = htmlCell.querySelector('.absolute');
        if (annotation) {
          const htmlAnnotation = annotation as HTMLElement;
          htmlAnnotation.style.fontSize = '9px';
          htmlAnnotation.style.lineHeight = '1.2';
          htmlAnnotation.style.padding = '1px 3px';
          htmlAnnotation.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          htmlAnnotation.style.borderRadius = '3px';
          htmlAnnotation.style.border = '1px solid rgba(0, 0, 0, 0.1)';
          htmlAnnotation.style.zIndex = '10';
          htmlAnnotation.style.minHeight = '24px';
          htmlAnnotation.style.display = 'flex';
          htmlAnnotation.style.alignItems = 'center';
          htmlAnnotation.style.maxWidth = 'none';
          htmlAnnotation.style.overflow = 'visible';
          htmlAnnotation.style.whiteSpace = 'nowrap';
        }
      });

      // Enhance string labels
      const stringLabels = fretboardClone.querySelectorAll('.w-15.h-15');
      stringLabels.forEach((label: Element) => {
        const htmlLabel = label as HTMLElement;
        htmlLabel.style.cssText += `
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        `;
      });

      // Enhance fret numbers - this will be handled by the fret header section above

      // Apply export styling to fret number cells with seamless padding
      const fretNumberCells = fretboardClone.querySelectorAll('.w-11');
      fretNumberCells.forEach((cell: Element) => {
        const htmlCell = cell as HTMLElement;
        if (htmlCell.classList.contains('h-10') || htmlCell.classList.contains('h-8')) {
          htmlCell.style.cssText += `
            background: linear-gradient(135deg, #475569 0%, #334155 100%);
            box-shadow:
              0 2px 4px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          `;
        }
      });

      // Ensure the FRETS label has the same height and background
      const fretsLabel = fretboardClone.querySelector('.w-15');
      if (fretsLabel) {
        const htmlFretsLabel = fretsLabel as HTMLElement;
        htmlFretsLabel.style.cssText += `
          background: linear-gradient(135deg, #475569 0%, #334155 100%);
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
      }

      exportWrapper.appendChild(fretboardClone);

      // Add footer
      const footer = document.createElement('div');
      footer.style.cssText = `
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #64748b;
        font-style: italic;
      `;
      footer.innerHTML = `Generated on ${new Date().toLocaleDateString()} • frettar.pages.dev`;
      exportWrapper.appendChild(footer);

      // Temporarily add to DOM for rendering
      exportWrapper.style.position = 'absolute';
      exportWrapper.style.left = '-9999px';
      exportWrapper.style.top = '-9999px';
      document.body.appendChild(exportWrapper);

      const canvas = await html2canvas(exportWrapper, {
        scale: finalOptions.scale,
        backgroundColor: '#f8fafc',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: exportWrapper.scrollWidth,
        height: exportWrapper.scrollHeight,
      });

      // Clean up
      document.body.removeChild(exportWrapper);

      const link = document.createElement('a');

      link.download = createFilename(title, finalOptions.format);

      if (finalOptions.format === 'jpg') {
        link.href = canvas.toDataURL('image/jpeg', finalOptions.quality);
      } else {
        link.href = canvas.toDataURL('image/png');
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export fretboard image');
    }
  },
};

export const exportToCanvas = async (
  fretboardRef: React.RefObject<HTMLDivElement>,
  options: Partial<ExportOptions> = {},
  title?: string
): Promise<HTMLCanvasElement> => {
  const finalOptions = { ...DEFAULT_EXPORT_OPTIONS, ...options };

  if (!fretboardRef.current) {
    throw new Error('Fretboard reference is not available');
  }

  try {
    // Create enhanced wrapper for canvas export
    const exportWrapper = document.createElement('div');
    exportWrapper.style.cssText = `
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      font-family: 'Inter', sans-serif;
    `;

    // Add title if provided
    if (title && title.trim()) {
      const titleElement = document.createElement('div');
      titleElement.style.cssText = `
        text-align: center;
        margin-bottom: 30px;
        font-size: 24px;
        font-weight: 600;
        color: #1e293b;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      `;
      titleElement.textContent = title.trim();
      exportWrapper.appendChild(titleElement);
    }

    const fretboardClone = fretboardRef.current.cloneNode(true) as HTMLElement;
    fretboardClone.style.cssText = `
      border: 4px solid #1e293b;
      border-radius: 16px;
      background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    `;

    exportWrapper.appendChild(fretboardClone);

    exportWrapper.style.position = 'absolute';
    exportWrapper.style.left = '-9999px';
    exportWrapper.style.top = '-9999px';
    document.body.appendChild(exportWrapper);

    const canvas = await html2canvas(exportWrapper, {
      scale: finalOptions.scale,
      backgroundColor: '#f8fafc',
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: exportWrapper.scrollWidth,
      height: exportWrapper.scrollHeight,
    });

    document.body.removeChild(exportWrapper);
    return canvas;
  } catch (error) {
    console.error('Canvas export failed:', error);
    throw new Error('Failed to export fretboard to canvas');
  }
};

export const exportToBlob = async (
  fretboardRef: React.RefObject<HTMLDivElement>,
  options: Partial<ExportOptions> = {},
  title?: string
): Promise<Blob> => {
  const finalOptions = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const canvas = await exportToCanvas(fretboardRef, finalOptions, title);

  return new Promise((resolve, reject) => {
    if (finalOptions.format === 'jpg') {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        finalOptions.quality
      );
    } else {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png'
      );
    }
  });
};

export const copyToClipboard = async (
  fretboardRef: React.RefObject<HTMLDivElement>,
  options: Partial<ExportOptions> = {},
  title?: string
): Promise<void> => {
  const clipboardCheck = checkClipboardSupport();
  if (!clipboardCheck.supported) {
    throw new Error(clipboardCheck.reason || 'Clipboard not supported');
  }

  try {
    try {
      const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
      if (permission.state === 'denied') {
        throw new Error('Clipboard access denied. Please allow clipboard permissions in your browser settings.');
      }
    } catch (permissionError) {
      // Some browsers don't support permissions query for clipboard-write
      console.warn('Could not check clipboard permissions:', permissionError);
    }

    // Create the blob with error handling
    const blob = await exportToBlob(fretboardRef, options, title);

    if (!blob || blob.size === 0) {
      throw new Error('Failed to generate image for clipboard');
    }

    // Check blob size (most browsers have a 20MB limit)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (blob.size > maxSize) {
      throw new Error('Image too large for clipboard. Try reducing the scale or fretboard size.');
    }

    // Create clipboard item with the correct MIME type
    const clipboardItem = new ClipboardItem({
      [blob.type]: blob
    });

    // Attempt to write to clipboard with timeout
    const writePromise = navigator.clipboard.write([clipboardItem]);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Clipboard operation timed out')), 10000)
    );

    await Promise.race([writePromise, timeoutPromise]);

  } catch (error) {
    console.error('Copy to clipboard failed:', error);

    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Clipboard access denied. Please allow clipboard permissions and try again.');
      } else if (error.name === 'SecurityError') {
        throw new Error('Security error: Please access the site via HTTPS to use clipboard features.');
      } else if (error.name === 'TypeError' && error.message.includes('ClipboardItem')) {
        throw new Error('Browser does not support copying images to clipboard. Please update your browser.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Clipboard operation timed out. Please try again.');
      } else if (error.message.includes('too large')) {
        throw error; // Re-throw size error as-is
      } else if (error.message.includes('not supported') || error.message.includes('requires')) {
        throw error; // Re-throw compatibility errors as-is
      }
    }

    throw new Error('Failed to copy fretboard to clipboard. Please try again or use the export button instead.');
  }
};

export const getImageDataUrl = async (
  fretboardRef: React.RefObject<HTMLDivElement>,
  options: Partial<ExportOptions> = {},
  title?: string
): Promise<string> => {
  const finalOptions = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  const canvas = await exportToCanvas(fretboardRef, finalOptions, title);

  if (finalOptions.format === 'jpg') {
    return canvas.toDataURL('image/jpeg', finalOptions.quality);
  } else {
    return canvas.toDataURL('image/png');
  }
};

export const printFretboard = async (
  fretboardRef: React.RefObject<HTMLDivElement>,
  options: Partial<ExportOptions> = {},
  title?: string
): Promise<void> => {
  try {
    const dataUrl = await getImageDataUrl(fretboardRef, options, title);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Failed to open print window');
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Fretboard - Print</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Fretboard" />
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for image to load before printing
    const img = printWindow.document.querySelector('img') as HTMLImageElement;
    img.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  } catch (error) {
    console.error('Print failed:', error);
    throw new Error('Failed to print fretboard');
  }
};
