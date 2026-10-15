// renderer/inject.js
// This script is injected into the tokens.ci page to add a floating submit button.

(function() {
  // Don't inject on GitHub pages (OAuth flow)
  if (window.location.hostname.includes('github.com')) return;

  // Remove existing button if any
  var existing = document.getElementById('tokens-submit-btn');
  if (existing) existing.remove();
  
  // Remove existing toast if any
  var existingToast = document.getElementById('tokens-toast');
  if (existingToast) existingToast.remove();

  // Create floating button container
  var btn = document.createElement('div');
  btn.id = 'tokens-submit-btn';
  btn.innerHTML = '<button id="submit-btn-inner" title="Submit usage data to tokens.ci">\u2b06\ufe0f Submit</button>';
  btn.style.cssText = [
    'position: fixed',
    'bottom: 20px',
    'right: 20px',
    'z-index: 999999',
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'color: #fff',
    'padding: 0',
    'border-radius: 30px',
    'cursor: pointer',
    'box-shadow: 0 4px 15px rgba(0,0,0,0.3)',
    'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'transition: all 0.2s ease',
    'user-select: none',
    'border: none',
    'outline: none'
  ].join(';');
  
  // Style the inner button
  var btnInner = btn.querySelector('#submit-btn-inner');
  btnInner.style.cssText = [
    'background: transparent',
    'color: #fff',
    'border: none',
    'padding: 12px 20px',
    'border-radius: 30px',
    'cursor: pointer',
    'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-size: 14px',
    'font-weight: 600',
    'transition: all 0.2s ease',
    'outline: none'
  ].join(';');
  
  // Hover effect on container
  btn.addEventListener('mouseenter', function() {
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
  });
  
  // Click handler
  btn.addEventListener('click', function() {
    var btnInner = document.querySelector('#submit-btn-inner');
    var originalText = btnInner.textContent;
    
    // Disable button and show loading
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';
    btnInner.textContent = '\u23f3 Submitting...';
    
    // Call the submit function
    window.electronAPI.submitTokens().then(function(result) {
      if (result.success) {
        showToast('\u2705 Submit successful! Page will refresh...', 'success');
        // Refresh page after 2 seconds
        setTimeout(function() {
          window.electronAPI.refreshPage();
        }, 2000);
      } else {
        var errorMsg = result.error || result.stderr || 'Unknown error';
        // Truncate error message if too long
        if (errorMsg.length > 200) {
          errorMsg = errorMsg.substring(0, 200) + '...';
        }
        showToast('\u274c Submit failed: ' + errorMsg, 'error');
      }
    }).catch(function(err) {
      showToast('\u274c Error: ' + err.message, 'error');
    }).finally(function() {
      // Restore button
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      btnInner.textContent = originalText;
    });
  });
  
  // Add to DOM
  document.body.appendChild(btn);
  
  // Toast notification function
  function showToast(message, type) {
    // Remove existing toast
    var existingToast = document.getElementById('tokens-toast');
    if (existingToast) existingToast.remove();
    
    var toast = document.createElement('div');
    toast.id = 'tokens-toast';
    toast.textContent = message;
    toast.style.cssText = [
      'position: fixed',
      'bottom: 80px',
      'right: 20px',
      'z-index: 999999',
      'background: ' + (type === 'success' ? '#10b981' : '#ef4444'),
      'color: #fff',
      'padding: 12px 20px',
      'border-radius: 8px',
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-size: 14px',
      'font-weight: 500',
      'box-shadow: 0 4px 12px rgba(0,0,0,0.3)',
      'animation: tokensToastIn 0.3s ease',
      'max-width: 350px',
      'word-wrap: break-word',
      'line-height: 1.5'
    ].join(';');
    
    // Add animation style
    var style = document.createElement('style');
    style.textContent = [
      '@keyframes tokensToastIn {',
      '  from { opacity: 0; transform: translateY(10px); }',
      '  to { opacity: 1; transform: translateY(0); }',
      '}',
      '@keyframes tokensToastOut {',
      '  from { opacity: 1; }',
      '  to { opacity: 0; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
      toast.style.animation = 'tokensToastOut 0.3s ease';
      setTimeout(function() {
        toast.remove();
      }, 300);
    }, 5000);
  }
})();
