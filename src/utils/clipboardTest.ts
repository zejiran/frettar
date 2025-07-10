// Utility for testing and debugging clipboard functionality
// This helps diagnose clipboard issues users might encounter

export interface ClipboardTestResult {
  supported: boolean;
  secure: boolean;
  permissions: string;
  browser: string;
  errors: string[];
  suggestions: string[];
}

export const runClipboardTest = async (): Promise<ClipboardTestResult> => {
  const result: ClipboardTestResult = {
    supported: false,
    secure: false,
    permissions: 'unknown',
    browser: '',
    errors: [],
    suggestions: []
  };

  // Detect browser
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) {
    result.browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    result.browser = 'Firefox';
  } else if (userAgent.includes('Safari')) {
    result.browser = 'Safari';
  } else if (userAgent.includes('Edge')) {
    result.browser = 'Edge';
  } else {
    result.browser = 'Unknown';
  }

  // Check secure context
  result.secure = window.isSecureContext;
  if (!result.secure) {
    result.errors.push('Site is not in a secure context (HTTPS required)');
    result.suggestions.push('Access the site via HTTPS instead of HTTP');
  }

  // Check clipboard API availability
  if (!navigator.clipboard) {
    result.errors.push('Clipboard API not available');
    result.suggestions.push('Update to a modern browser that supports the Clipboard API');
  } else {
    // Check specific clipboard methods
    if (typeof navigator.clipboard.write !== 'function') {
      result.errors.push('Clipboard write method not available');
      result.suggestions.push('Browser does not support clipboard.write()');
    }

    if (typeof navigator.clipboard.writeText !== 'function') {
      result.errors.push('Clipboard writeText method not available');
    }
  }

  // Check ClipboardItem constructor
  if (!window.ClipboardItem) {
    result.errors.push('ClipboardItem constructor not available');
    result.suggestions.push('Browser does not support ClipboardItem - try Chrome 76+ or Firefox 87+');
  }

  // Test permissions if available
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const permission = await navigator.permissions.query({
        name: 'clipboard-write' as PermissionName
      });
      result.permissions = permission.state;

      if (permission.state === 'denied') {
        result.errors.push('Clipboard permission denied');
        result.suggestions.push('Allow clipboard permissions in browser settings');
      }
    }
  } catch (error) {
    result.permissions = 'query-failed';
    console.warn('Permission query failed:', error);
  }

  // Test basic clipboard functionality
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && result.secure) {
    try {
      await navigator.clipboard.writeText('test');
      // If we got here, basic text clipboard works
      if (window.ClipboardItem && typeof navigator.clipboard.write === 'function') {
        result.supported = true;
      } else {
        result.errors.push('Image clipboard not supported (text clipboard works)');
        result.suggestions.push('Browser supports text clipboard but not image clipboard');
      }
    } catch (error) {
      result.errors.push(`Clipboard test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        result.suggestions.push('User denied clipboard permission or interaction required');
      }
    }
  }

  // Browser-specific suggestions
  if (result.browser === 'Safari' && parseFloat(userAgent.match(/Version\/(\d+)/)?.[1] || '0') < 13.1) {
    result.suggestions.push('Safari 13.1+ required for clipboard support');
  }

  if (result.browser === 'Firefox' && parseInt(userAgent.match(/Firefox\/(\d+)/)?.[1] || '0') < 87) {
    result.suggestions.push('Firefox 87+ required for full clipboard support');
  }

  // Mobile browser considerations
  if (/Mobi|Android/i.test(userAgent)) {
    result.suggestions.push('Mobile browsers may have limited clipboard support');
    if (result.browser === 'Safari') {
      result.suggestions.push('iOS Safari requires user interaction and may not support image clipboard');
    }
  }

  // Add general suggestions if there are errors
  if (result.errors.length > 0) {
    result.suggestions.push('Use the Export button as an alternative to clipboard');
    result.suggestions.push('Try a different browser (Chrome/Edge recommended)');
  }

  return result;
};

export const logClipboardDiagnostics = async (): Promise<void> => {
  const result = await runClipboardTest();

  console.group('🔍 Clipboard Diagnostics');
  console.log('Browser:', result.browser);
  console.log('Secure Context:', result.secure ? '✅' : '❌');
  console.log('Clipboard Supported:', result.supported ? '✅' : '❌');
  console.log('Permissions:', result.permissions);

  if (result.errors.length > 0) {
    console.group('❌ Errors');
    result.errors.forEach(error => console.log('•', error));
    console.groupEnd();
  }

  if (result.suggestions.length > 0) {
    console.group('💡 Suggestions');
    result.suggestions.forEach(suggestion => console.log('•', suggestion));
    console.groupEnd();
  }

  console.groupEnd();
};

// Quick test function that can be called from browser console
(window as any).testClipboard = logClipboardDiagnostics;
