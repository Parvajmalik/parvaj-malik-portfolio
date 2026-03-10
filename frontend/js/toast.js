// toast.js — Bootstrap 5 toast notifications

function getContainer() {
  let el = document.getElementById('toast-container');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast-container';
    el.className = 'toast-container position-fixed top-0 end-0 p-3';
    el.style.zIndex = '9999';
    document.body.appendChild(el);
  }
  return el;
}

/**
 * @param {string} message
 * @param {'success'|'error'|'warning'} type
 */
export function showToast(message, type = 'success') {
  const container = getContainer();

  const config = {
    success: { bg: 'toast-success', icon: 'bi-check-circle-fill' },
    error:   { bg: 'toast-error',   icon: 'bi-x-circle-fill' },
    warning: { bg: 'toast-warning', icon: 'bi-exclamation-triangle-fill' },
  };
  const { bg, icon } = config[type] || config.success;

  const toastEl = document.createElement('div');
  toastEl.className = `toast admin-toast ${bg} align-items-center border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <i class="bi ${icon} fs-5"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();

  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
