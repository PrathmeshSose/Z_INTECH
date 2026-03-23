/* ── Navbar drawer ─────────────────────────── */
function openNav() {
  document.getElementById('nav').classList.add('show');
  document.getElementById('navOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  document.getElementById('nav').classList.remove('show');
  document.getElementById('navOverlay').classList.remove('show');
  document.body.style.overflow = '';
}
document.addEventListener('DOMContentLoaded', function () {
  var toggler = document.getElementById('navToggler');
  if (toggler) toggler.addEventListener('click', openNav);
});

/* ── Dark mode ─────────────────────────────── */
function toggleDark() {
  document.body.classList.toggle('dark');
  var on = document.body.classList.contains('dark');
  localStorage.setItem('dark', on);
  document.getElementById('darkToggle').innerHTML = on
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-fill"></i>';
}
if (localStorage.getItem('dark') === 'true') {
  document.body.classList.add('dark');
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('darkToggle');
    if (btn) btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
  });
}

/* ── Page transition ───────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || a.target) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.classList.add('page-leave');
      setTimeout(function () { window.location = href; }, 280);
    });
  });
});
