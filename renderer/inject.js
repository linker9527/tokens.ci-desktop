// renderer/inject.js
// Injected into tokens.ci page to add a polished floating submit button.

(function () {
  // Skip OAuth pages
  if (window.location.hostname.includes('github.com')) return;

  // Remove existing elements
  document.getElementById('tokens-submit-btn')?.remove();
  document.getElementById('tokens-toast')?.remove();
  document.getElementById('tokens-version')?.remove();
  document.getElementById('tokens-style')?.remove();

  // === Inject Styles ===
  var style = document.createElement('style');
  style.id = 'tokens-style';
  style.textContent = [
    /* Button */
    '#tokens-submit-btn{',
    '  position:fixed;bottom:24px;right:24px;z-index:999999;',
    '  display:flex;align-items:center;gap:8px;',
    '  padding:14px 24px;border:none;border-radius:28px;cursor:pointer;',
    '  background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);',
    '  color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
    '  font-size:14px;font-weight:600;letter-spacing:0.01em;',
    '  box-shadow:0 4px 16px rgba(99,102,241,0.4),0 0 0 0 rgba(139,92,246,0);',
    '  transition:all 0.25s cubic-bezier(0.4,0,0.2,1);',
    '  user-select:none;outline:none;',
    '}',
    '#tokens-submit-btn:hover{',
    '  transform:translateY(-2px);',
    '  box-shadow:0 8px 28px rgba(99,102,241,0.5),0 0 0 4px rgba(139,92,246,0.15);',
    '}',
    '#tokens-submit-btn:active{transform:translateY(0) scale(0.97);}',
    '#tokens-submit-btn:disabled{',
    '  opacity:0.65;cursor:not-allowed;transform:none;',
    '  box-shadow:0 2px 8px rgba(99,102,241,0.2);',
    '}',
    /* Spinner */
    '.tokens-spinner{',
    '  width:16px;height:16px;flex-shrink:0;',
    '  border:2px solid rgba(255,255,255,0.25);border-top-color:#fff;',
    '  border-radius:50%;animation:tokensSpin 0.55s linear infinite;',
    '}',
    '@keyframes tokensSpin{to{transform:rotate(360deg);}}',
    /* Toast */
    '#tokens-toast{',
    '  position:fixed;bottom:80px;right:24px;z-index:999999;',
    '  display:flex;align-items:flex-start;gap:12px;',
    '  padding:16px 20px;border-radius:14px;overflow:hidden;',
    '  background:rgba(15,23,42,0.92);',
    '  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);',
    '  border:1px solid rgba(255,255,255,0.08);',
    '  color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
    '  font-size:13px;line-height:1.5;',
    '  box-shadow:0 8px 32px rgba(0,0,0,0.4);',
    '  max-width:380px;animation:tokensIn 0.35s cubic-bezier(0.4,0,0.2,1);',
    '}',
    '#tokens-toast.out{animation:tokensOut 0.3s ease forwards;}',
    '@keyframes tokensIn{',
    '  from{opacity:0;transform:translateX(24px);}to{opacity:1;transform:translateX(0);}',
    '}',
    '@keyframes tokensOut{to{opacity:0;transform:translateX(24px);}}',
    /* Progress bar */
    '.tokens-bar{',
    '  position:absolute;bottom:0;left:0;height:3px;',
    '  background:linear-gradient(90deg,#6366f1,#a855f7);',
    '  animation:tokensBar 5s linear forwards;',
    '}',
    '@keyframes tokensBar{from{width:100%;}to{width:0%;}}',
    /* Icon */
    '.tokens-icon{',
    '  width:28px;height:28px;flex-shrink:0;display:flex;align-items:center;justify-content:center;',
    '  border-radius:50%;font-size:14px;font-weight:700;',
    '}',
    '.tokens-icon.ok{background:linear-gradient(135deg,#10b981,#34d399);}',
    '.tokens-icon.fail{background:linear-gradient(135deg,#f43f5e,#fb7185);}',
    '.tokens-icon.info{background:linear-gradient(135deg,#6366f1,#8b5cf6);}',
    /* Message */
    '.tokens-msg{flex:1;padding-top:2px;word-wrap:break-word;}',
    /* Version badge */
    '#tokens-version{',
    '  position:fixed;bottom:24px;left:24px;z-index:999999;',
    '  padding:5px 12px;border-radius:8px;',
    '  background:rgba(15,23,42,0.65);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);',
    '  border:1px solid rgba(255,255,255,0.06);',
    '  color:rgba(255,255,255,0.4);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
    '  font-size:11px;font-weight:500;user-select:none;pointer-events:none;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // === Create Button ===
  var btn = document.createElement('button');
  btn.id = 'tokens-submit-btn';
  btn.innerHTML = '<span>\u2b06\ufe0f</span><span>Submit</span>';

  btn.addEventListener('click', function () {
    btn.disabled = true;
    btn.innerHTML = '<div class="tokens-spinner"></div><span>Submitting...</span>';

    window.electronAPI
      .submitTokens()
      .then(function (r) {
        if (r.success) {
          showToast('ok', '\u2713', 'Submit successful!\nPage will refresh...');
          setTimeout(function () { window.electronAPI.refreshPage(); }, 2000);
        } else {
          var msg = r.error || r.stderr || 'Unknown error';
          if (msg.length > 200) msg = msg.substring(0, 200) + '...';
          showToast('fail', '\u00d7', 'Submit failed:\n' + msg);
        }
      })
      .catch(function (err) {
        showToast('fail', '\u00d7', 'Error:\n' + (err.message || err));
      })
      .finally(function () {
        btn.disabled = false;
        btn.innerHTML = '<span>\u2b06\ufe0f</span><span>Submit</span>';
      });
  });

  document.body.appendChild(btn);

  // === Toast ===
  function showToast(type, icon, message) {
    document.getElementById('tokens-toast')?.remove();

    var toast = document.createElement('div');
    toast.id = 'tokens-toast';

    var iconEl = document.createElement('div');
    iconEl.className = 'tokens-icon ' + type;
    iconEl.textContent = icon;

    var msgEl = document.createElement('div');
    msgEl.className = 'tokens-msg';
    msgEl.textContent = message;

    var barEl = document.createElement('div');
    barEl.className = 'tokens-bar';

    toast.appendChild(iconEl);
    toast.appendChild(msgEl);
    toast.appendChild(barEl);
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('out');
      setTimeout(function () { toast.remove(); }, 300);
    }, 5000);
  }

  // === Version Badge ===
  var badge = document.createElement('div');
  badge.id = 'tokens-version';
  window.electronAPI
    .getVersion()
    .then(function (v) {
      badge.textContent = 'v' + v;
      document.body.appendChild(badge);
    })
    .catch(function () {});
})();
