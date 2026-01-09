// Theme switching for Kiddy Learning Hub
const themes = ['forest','undersea','mountain','space'];

function applyTheme(theme){
  if(!theme || !themes.includes(theme)) theme = 'forest';
  document.body.classList.remove(...themes.map(t=>'theme-'+t));
  document.body.classList.add('theme-'+theme);
  localStorage.setItem('kiddy_theme', theme);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const saved = localStorage.getItem('kiddy_theme') || 'forest';
  applyTheme(saved);

  document.querySelectorAll('.theme-button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const t = btn.getAttribute('data-theme');
      applyTheme(t);
    });
  });
});

// expose for debugging
window.applyKiddyTheme = applyTheme;
