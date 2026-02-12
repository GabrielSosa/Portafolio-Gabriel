// GitHub Pages Compatibility Checker
// Run this script in the browser console or include as a script tag

(function() {
  const results = [];

  // Check for fetch support
  if (typeof window.fetch === 'function') {
    results.push('✔ fetch API is supported.');
  } else {
    results.push('✖ fetch API is NOT supported.');
  }

  // Check for lang files
  fetch('./lang/en.json')
    .then(res => {
      if (res.ok) {
        results.push('✔ lang/en.json found.');
      } else {
        results.push('✖ lang/en.json missing or inaccessible.');
      }
      return fetch('./lang/es.json');
    })
    .then(res => {
      if (res.ok) {
        results.push('✔ lang/es.json found.');
      } else {
        results.push('✖ lang/es.json missing or inaccessible.');
      }
      checkEmailJS();
    })
    .catch(() => {
      results.push('✖ lang files missing or fetch failed.');
      checkEmailJS();
    });

  // Check for EmailJS
  function checkEmailJS() {
    if (typeof window.emailjs === 'object') {
      results.push('✔ EmailJS library loaded.');
    } else {
      results.push('✖ EmailJS library NOT loaded.');
    }
    showResults();
  }

  // Check for assets
  function checkAssets() {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && favicon.href.includes('favicon')) {
      results.push('✔ Favicon asset found.');
    } else {
      results.push('✖ Favicon asset missing.');
    }
  }

  // Show results
  function showResults() {
    checkAssets();
    const output = document.createElement('div');
    output.style.position = 'fixed';
    output.style.bottom = '20px';
    output.style.right = '20px';
    output.style.background = '#222';
    output.style.color = '#fff';
    output.style.padding = '16px';
    output.style.borderRadius = '8px';
    output.style.zIndex = 9999;
    output.style.fontFamily = 'monospace';
    output.innerHTML = '<b>GitHub Pages Compatibility:</b><br>' + results.join('<br>');
    document.body.appendChild(output);
    setTimeout(() => {
      output.remove();
    }, 10000);
  }
})();
