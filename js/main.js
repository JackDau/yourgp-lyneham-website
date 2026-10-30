document.addEventListener('DOMContentLoaded', function() {

  // Facebook tracking on book-now clicks
  document.querySelectorAll('.book-now').forEach(function(el) {
    el.addEventListener('click', function() {
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');
      }
    });
  });

  // Mobile hamburger menu toggle
  var dropdown = document.querySelector('.mobile.dropdown');
  var mobileHeaderBottom = document.querySelector('.mobile.header-bottom');
  var hamburger = document.getElementById('hamburger');

  if (dropdown) dropdown.style.display = 'none';

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      var isActive = this.classList.contains('active');
      if (mobileHeaderBottom) {
        mobileHeaderBottom.style.display = isActive ? 'none' : 'block';
      }
      if (dropdown) {
        dropdown.style.display = isActive ? 'none' : 'block';
      }
      this.classList.toggle('active');
    });
  }

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      if (dropdown) dropdown.style.display = 'none';
      if (mobileHeaderBottom) mobileHeaderBottom.style.display = 'none';
      if (hamburger) hamburger.classList.remove('active');
    } else {
      if (mobileHeaderBottom) mobileHeaderBottom.style.display = 'block';
    }
  });

  // Doctor staff member expansion (doctors page)
  var staffInfo = document.getElementById('staff-info');
  if (staffInfo) {
    staffInfo.style.display = 'none';
    staffInfo.querySelectorAll('.staff-entire').forEach(function(el) {
      el.style.display = 'none';
    });
    document.querySelectorAll('.staff-content-mobile').forEach(function(el) {
      el.style.display = 'none';
    });

    document.querySelectorAll('.staff-member').forEach(function(member) {
      member.addEventListener('click', function() {
        var dataType = this.getAttribute('data-type');
        var selectedMember = null;
        staffInfo.querySelectorAll('.staff-entire').forEach(function(el) {
          if (el.getAttribute('data-type') === dataType) {
            selectedMember = el;
          }
        });

        if (window.innerWidth > 992) {
          if (this.classList.contains('selector')) {
            if (selectedMember) selectedMember.style.display = 'none';
            staffInfo.style.display = 'none';
            this.classList.remove('selector');
          } else {
            staffInfo.querySelectorAll('.staff-entire').forEach(function(el) {
              el.style.display = 'none';
            });
            if (selectedMember) selectedMember.style.display = 'block';
            staffInfo.style.display = 'block';
            document.querySelectorAll('.staff-member').forEach(function(m) {
              m.classList.remove('selector');
            });
            this.classList.add('selector');
          }
          staffInfo.scrollIntoView({ behavior: 'smooth' });
        }

        if (window.innerWidth <= 992) {
          var mobileContent = this.querySelector('.staff-content-mobile');
          if (this.classList.contains('selector')) {
            if (mobileContent) mobileContent.style.display = 'none';
            this.classList.remove('selector');
          } else {
            if (mobileContent) mobileContent.style.display = 'block';
            document.querySelectorAll('.staff-member').forEach(function(m) {
              m.classList.remove('selector');
            });
            this.classList.add('selector');
          }
        }
      });
    });
  }

  // Sticky sidebar (doctors page and others with sidebar)
  var sidebar = document.querySelector('.sidebar');
  if (sidebar && window.innerWidth > 992) {
    var sidebarTop = sidebar.getBoundingClientRect().top + window.scrollY;
    var sidebarLeft = sidebar.getBoundingClientRect().left;
    var sidebarWidth = sidebar.offsetWidth;
    window.addEventListener('scroll', function() {
      if (window.innerWidth > 992) {
        if (window.scrollY > sidebarTop - 20) {
          sidebar.style.position = 'fixed';
          sidebar.style.top = '20px';
          sidebar.style.left = sidebarLeft + 'px';
          sidebar.style.width = sidebarWidth + 'px';
        } else {
          sidebar.style.position = '';
          sidebar.style.top = '';
          sidebar.style.left = '';
          sidebar.style.width = '';
        }
      }
    });
  }

  // Services/FAQ accordion toggle
  document.querySelectorAll('.services-row').forEach(function(row) {
    row.querySelectorAll('p').forEach(function(p) { p.style.display = 'none'; });
    row.addEventListener('click', function(e) {
      // Only the question toggles the answer, so answer text can be selected, copied and its links clicked
      if (e.target.closest('span')) return;
      var sel = window.getSelection ? window.getSelection().toString() : '';
      if (sel) return;
      this.querySelectorAll('p').forEach(function(p) {
        p.style.display = p.style.display === 'none' ? 'block' : 'none';
      });
      var arrow = this.querySelector('img');
      if (arrow) {
        if (arrow.classList.contains('active')) {
          arrow.style.transform = 'rotate(0deg)';
          arrow.classList.remove('active');
        } else {
          arrow.style.transform = 'rotate(90deg)';
          arrow.classList.add('active');
        }
      }
    });
  });

  // Open a dropdown when a link points to it (e.g. #vasectomy)
  function openRowFromHash() {
    var row = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (!row || !row.classList.contains('services-row')) return;
    row.querySelectorAll('p').forEach(function(p) { p.style.display = 'block'; });
    var arrow = row.querySelector('img');
    if (arrow && !arrow.classList.contains('active')) {
      arrow.style.transform = 'rotate(90deg)';
      arrow.classList.add('active');
    }
    row.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  openRowFromHash();
  window.addEventListener('hashchange', openRowFromHash);

  // Doctors page: filter cards by service (?filter=skin etc.)
  var filterBar = document.querySelector('.doctor-filters');
  if (filterBar) {
    var buttons = filterBar.querySelectorAll('button[data-filter]');
    var cards = document.querySelectorAll('.staff-grid .staff-member');
    var countEl = filterBar.querySelector('.doctor-filters-count');
    var noteEl = filterBar.querySelector('.doctor-filters-note');
    function applyFilter(name) {
      var valid = false;
      buttons.forEach(function(b) { if (b.getAttribute('data-filter') === name) valid = true; });
      if (!valid) name = 'all';
      var shown = 0;
      cards.forEach(function(card) {
        var tags = (card.getAttribute('data-services') || '').split(' ');
        var match = name === 'all' || tags.indexOf(name) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) shown++;
        if (!match) card.classList.remove('selector');
      });
      // Close any open doctor panel so it doesn't belong to a hidden card
      if (name !== 'all' && staffInfo) {
        staffInfo.style.display = 'none';
        staffInfo.querySelectorAll('.staff-entire').forEach(function(el) { el.style.display = 'none'; });
        cards.forEach(function(c) { c.classList.remove('selector'); });
      }
      buttons.forEach(function(b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter') === name ? 'true' : 'false'); });
      if (countEl) countEl.textContent = name === 'all' ? '' : (shown === 0
        ? 'None of our doctors at this clinic currently offer this. Please call (02) 6109 0000 to book at one of our other YourGP clinics.'
        : 'Showing ' + shown + ' doctor' + (shown === 1 ? '' : 's'));
      if (countEl) countEl.classList.toggle('is-empty', name !== 'all' && shown === 0);
      if (noteEl) noteEl.hidden = name !== 'new-patients';
      if (window.history && history.replaceState) {
        var url = name === 'all' ? location.pathname : location.pathname + '?filter=' + name;
        history.replaceState(null, '', url);
      }
    }
    buttons.forEach(function(b) {
      b.addEventListener('click', function() { applyFilter(this.getAttribute('data-filter')); });
    });
    var params = new URLSearchParams(location.search);
    if (params.get('filter')) applyFilter(params.get('filter'));
  }

});
