let toastTimer;

export function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

export function navigate(view) {
  document.querySelectorAll('[data-page]').forEach(section => { section.hidden = section.dataset.page !== view; });
  document.querySelectorAll('.nav-button').forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  closeDrawer();
  document.querySelector('#main-content').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function openDrawer() {
  const sidebar = document.querySelector('#sidebar');
  sidebar.classList.add('open');
  document.querySelector('#drawer-backdrop').hidden = false;
  document.querySelector('#menu-button').setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  document.querySelector('#sidebar-close').focus();
}

export function closeDrawer() {
  document.querySelector('#sidebar').classList.remove('open');
  document.querySelector('#drawer-backdrop').hidden = true;
  document.querySelector('#menu-button').setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

export function closeDialog(id) {
  const dialog = document.querySelector(`#${id}`);
  if (dialog?.open) dialog.close();
}
