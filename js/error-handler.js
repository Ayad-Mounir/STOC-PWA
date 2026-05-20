// Global error catcher — يمسك أي خطأ قبل React
window.onerror = function(msg, src, line, col, err) {
  var fb = document.getElementById('app-fallback');
  var root = document.getElementById('root');
  if (fb && root) {
    fb.style.display = 'flex';
    document.getElementById('app-fallback-detail').textContent = '❌ ' + msg + ' (L' + line + ')';
  } else if (root) {
    root.innerHTML = '<div style="padding:20px;color:#f85149;font-family:monospace;font-size:12px;background:#0d1117;min-height:100vh;">❌ ' + msg + '<br>Line: ' + line + '</div>';
  }
};
window.onunhandledrejection = function(e) {
  console.error('Unhandled rejection:', e.reason);
};
