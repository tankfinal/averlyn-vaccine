(() => {
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  let vaccineData = null;
  let currentFilter = 'all';

  // --- Helpers ---

  function monthsDiff(from, to) {
    const years = to.getFullYear() - from.getFullYear();
    const months = to.getMonth() - from.getMonth();
    const days = to.getDate() - from.getDate();
    let total = years * 12 + months;
    if (days < 0) total--;
    return Math.max(0, total);
  }

  function daysDiff(from, to) {
    const msPerDay = 86400000;
    return Math.round((to - from) / msPerDay);
  }

  function formatAge(birthDate) {
    const months = monthsDiff(birthDate, TODAY);
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years > 0) {
      return rem > 0 ? `${years} 歲 ${rem} 個月` : `${years} 歲`;
    }
    return `${months} 個月`;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  }

  function ageLabel(ageMonths) {
    if (ageMonths === 0) return '出生';
    if (ageMonths < 12) return `${ageMonths} 個月`;
    const y = Math.floor(ageMonths / 12);
    const m = ageMonths % 12;
    if (m === 0) return `${y} 歲`;
    return `${y} 歲 ${m} 個月`;
  }

  // --- Rendering ---

  function getStatus(v) {
    if (v.done) return 'done';
    const scheduled = new Date(v.scheduledDate);
    scheduled.setHours(0, 0, 0, 0);
    if (scheduled < TODAY) return 'overdue';
    return 'upcoming';
  }

  function findNextVaccine(vaccines) {
    const upcoming = vaccines
      .filter(v => !v.done)
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    return upcoming.length > 0 ? upcoming[0] : null;
  }

  function filterVaccines(vaccines, filter) {
    switch (filter) {
      case 'public': return vaccines.filter(v => v.type === 'public');
      case 'self-paid': return vaccines.filter(v => v.type === 'self-paid');
      case 'done': return vaccines.filter(v => v.done);
      case 'upcoming': return vaccines.filter(v => !v.done);
      default: return vaccines;
    }
  }

  function renderCard(v, isNext) {
    const status = getStatus(v);
    const dateStr = v.done
      ? `施打日期: ${formatDate(v.doneDate)}`
      : `預計日期: ${formatDate(v.scheduledDate)}`;

    const statusBadge = status === 'done'
      ? '<span class="badge badge-done">&#10003; 已完成</span>'
      : status === 'overdue'
        ? '<span class="badge badge-overdue">&#9888; 逾期</span>'
        : '<span class="badge badge-upcoming">&#9711; 待施打</span>';

    const typeBadge = v.type === 'public'
      ? '<span class="badge badge-public">公費</span>'
      : '<span class="badge badge-self">自費</span>';

    const nextLabel = isNext ? '<span class="next-label">NEXT UP</span>' : '';

    let daysUntil = '';
    if (!v.done) {
      const d = daysDiff(TODAY, new Date(v.scheduledDate));
      if (d > 0) daysUntil = ` (${d} 天後)`;
      else if (d === 0) daysUntil = ' (今天!)';
      else daysUntil = ` (已過 ${Math.abs(d)} 天)`;
    }

    return `
      <div class="vaccine-card ${status} ${isNext ? 'next-up' : ''}" onclick="this.classList.toggle('expanded')">
        ${nextLabel}
        <div class="vaccine-card-header">
          <div class="vaccine-card-left">
            <div class="vaccine-name">${v.name}</div>
            <div class="vaccine-name-en">${v.nameEn}</div>
            ${v.subtitle ? `<div class="vaccine-subtitle">${v.subtitle}</div>` : ''}
            <div class="vaccine-date">${dateStr}${daysUntil}</div>
          </div>
          <div class="vaccine-badges">
            ${statusBadge}
            ${typeBadge}
          </div>
        </div>
        <div class="vaccine-detail">
          <p>${v.description}</p>
        </div>
      </div>
    `;
  }

  function renderTimeline(vaccines, nextVaccine) {
    const timeline = document.getElementById('timeline');
    const filtered = filterVaccines(vaccines, currentFilter);

    // Group by ageMonths
    const groups = new Map();
    for (const v of filtered) {
      const key = v.ageMonths;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(v);
    }

    // Sort groups by ageMonths
    const sortedKeys = [...groups.keys()].sort((a, b) => a - b);

    let html = '';
    for (const key of sortedKeys) {
      const items = groups.get(key);
      html += `<div class="age-group">`;
      html += `<div class="age-group-label">${ageLabel(key)}</div>`;
      for (const v of items) {
        const isNext = nextVaccine && v.id === nextVaccine.id;
        html += renderCard(v, isNext);
      }
      html += `</div>`;
    }

    if (html === '') {
      html = '<p style="text-align:center; color:#9e9e9e; padding:40px 0;">沒有符合條件的疫苗</p>';
    }

    timeline.innerHTML = html;
  }

  function updateStats(vaccines, nextVaccine) {
    const done = vaccines.filter(v => v.done).length;
    const upcoming = vaccines.filter(v => !v.done).length;

    document.getElementById('statDone').textContent = done;
    document.getElementById('statUpcoming').textContent = upcoming;

    if (nextVaccine) {
      const d = daysDiff(TODAY, new Date(nextVaccine.scheduledDate));
      if (d > 0) {
        document.getElementById('statNext').textContent = `${d} 天`;
      } else if (d === 0) {
        document.getElementById('statNext').textContent = '今天!';
      } else {
        document.getElementById('statNext').textContent = `逾期 ${Math.abs(d)} 天`;
      }
    }
  }

  // --- Init ---

  function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        const next = findNextVaccine(vaccineData.vaccines);
        renderTimeline(vaccineData.vaccines, next);
      });
    });
  }

  async function init() {
    const res = await fetch('data.json');
    vaccineData = await res.json();

    const birthDate = new Date(vaccineData.baby.birthDate);
    document.getElementById('ageDisplay').textContent = formatAge(birthDate);

    const nextVaccine = findNextVaccine(vaccineData.vaccines);

    updateStats(vaccineData.vaccines, nextVaccine);
    renderTimeline(vaccineData.vaccines, nextVaccine);
    initFilters();
  }

  init();
})();
