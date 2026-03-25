/* ═══════════════════════════════════════════════════════════════
   RailTech — Contact Form Handler (Web3Forms)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const statusEl = document.getElementById('form-status');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      const formData = new FormData(form);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        statusEl.textContent = form.dataset.success || 'Request sent successfully!';
        statusEl.classList.add('success');
        form.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      statusEl.textContent = form.dataset.error || 'Error sending. Please try again.';
      statusEl.classList.add('error');
    } finally {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }
  });

  // Phone input formatting
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let val = this.value.replace(/[^\d+\-\s()]/g, '');
      this.value = val;
    });
  }
})();
