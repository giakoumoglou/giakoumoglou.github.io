function toggleTheme(){var h=document.documentElement,n=h.getAttribute('data-theme')==='light'?'dark':'light';h.setAttribute('data-theme',n);localStorage.setItem('theme',n)}
(function(){var s=localStorage.getItem('theme');if(s)document.documentElement.setAttribute('data-theme',s);else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.setAttribute('data-theme','dark')})();
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var t=document.querySelector(this.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth'})})});

function escapeHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function highlightBib(raw){
    var out = '';
    var i = 0;
    var n = raw.length;
    var headerDone = false;
    while (i < n) {
        var ch = raw[i];
        if (!headerDone && ch === '@') {
            var m = raw.slice(i).match(/^@([A-Za-z]+)\{([^,\n]*)(,?)/);
            if (m) {
                out += '<span class="bib-punct">@</span><span class="bib-entrytype">' + escapeHtml(m[1]) + '</span><span class="bib-punct">{</span><span class="bib-citekey">' + escapeHtml(m[2]) + '</span><span class="bib-punct">' + m[3] + '</span>';
                i += m[0].length;
                headerDone = true;
                continue;
            }
        }
        var fieldMatch = raw.slice(i).match(/^(\s*)([A-Za-z]+)(\s*=\s*)/);
        if (headerDone && fieldMatch) {
            out += escapeHtml(fieldMatch[1]) + '<span class="bib-field">' + escapeHtml(fieldMatch[2]) + '</span>' + '<span class="bib-punct">' + escapeHtml(fieldMatch[3].trim()) + '</span>' + (fieldMatch[3].endsWith(' ') ? ' ' : '');
            i += fieldMatch[0].length;
            continue;
        }
        if (ch === '{' || ch === '}' || ch === ',') {
            out += '<span class="bib-punct">' + ch + '</span>';
            i++;
            continue;
        }
        out += escapeHtml(ch);
        i++;
    }
    return out;
}

function decorateBibBlocks(){
    document.querySelectorAll('.bib-block').forEach(function(block){
        if (block.dataset.raw) return;
        var raw = block.textContent;
        block.dataset.raw = raw;
        block.innerHTML = highlightBib(raw);
        var copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = function(){ copyBib(copyBtn); };
        block.appendChild(copyBtn);
    });
}

function copyBib(btn){
    var block = btn.closest('.bib-block');
    if (!block) return;
    var raw = block.dataset.raw || '';
    navigator.clipboard.writeText(raw).then(function(){
        var original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function(){ btn.textContent = original; }, 1500);
    }).catch(function(){
        var ta = document.createElement('textarea');
        ta.value = raw;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch(e) {}
        document.body.removeChild(ta);
        var original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function(){ btn.textContent = original; }, 1500);
    });
}

function setPillLabel(btn, label) {
    var icon = btn.getAttribute('data-icon') || '';
    btn.innerHTML = icon + label;
}

function toggleDrop(btn, type) {
    var pc = btn.closest('.pub-content');
    var sel = type === 'bib' ? '.bib-block' : '.pub-abstract';
    var other = type === 'bib' ? '.pub-abstract' : '.bib-block';
    var el = pc.querySelector(sel);
    var ot = pc.querySelector(other);
    if (!el) return;
    if (ot && ot.classList.contains('open')) {
        ot.classList.remove('open');
        var otherBtns = pc.querySelectorAll('button.pub-pill');
        otherBtns.forEach(function(b) {
            var current = b.textContent.toLowerCase();
            if (type === 'bib' && current === 'hide') setPillLabel(b, 'Abstract');
            if (type === 'abstract' && current === 'hide') setPillLabel(b, 'Bib');
        });
    }
    el.classList.toggle('open');
    var isOpen = el.classList.contains('open');
    setPillLabel(btn, isOpen ? 'Hide' : (type === 'bib' ? 'Bib' : 'Abstract'));
}

decorateBibBlocks();

/* Markdown-generated links (news, bio, education details) open in a new tab. */
document.querySelectorAll('a[href^="http"]').forEach(function(a){
    if (a.hostname !== window.location.hostname) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
    }
});

/* Publication filters */
(function(){
    var items = Array.prototype.slice.call(document.querySelectorAll('.pub-item'));
    if (!items.length) return;
    var state = {type:'all', oral:false, nonarchival:false, review:false, year:'all', venue:'all', keyword:'all'};

    var yearSel = document.getElementById('filter-year');
    var venueSel = document.getElementById('filter-venue');
    var keywordSel = document.getElementById('filter-keyword');
    var years = [], venues = [], keywords = [];
    items.forEach(function(li){
        if (li.dataset.year && years.indexOf(li.dataset.year) === -1) years.push(li.dataset.year);
        if (li.dataset.venue && venues.indexOf(li.dataset.venue) === -1) venues.push(li.dataset.venue);
        (li.dataset.keywords || '').split(',').forEach(function(k){
            if (k && keywords.indexOf(k) === -1) keywords.push(k);
        });
    });
    years.sort().reverse();
    venues.sort();
    keywords.sort();
    years.forEach(function(y){ var o=document.createElement('option'); o.value=y; o.textContent=y; yearSel.appendChild(o); });
    venues.forEach(function(v){ var o=document.createElement('option'); o.value=v; o.textContent=v; venueSel.appendChild(o); });
    keywords.forEach(function(k){ var o=document.createElement('option'); o.value=k; o.textContent=k; keywordSel.appendChild(o); });

    function apply(){
        items.forEach(function(li){
            var ok = (state.type === 'all' || li.dataset.type === state.type)
                && (!state.oral || li.dataset.oral === 'true')
                && (!state.nonarchival || li.dataset.nonarchival === 'true')
                && (!state.review || li.dataset.review === 'true')
                && (state.year === 'all' || li.dataset.year === state.year)
                && (state.venue === 'all' || li.dataset.venue === state.venue)
                && (state.keyword === 'all' || (li.dataset.keywords || '').split(',').indexOf(state.keyword) !== -1);
            li.style.display = ok ? '' : 'none';
        });
        document.querySelectorAll('.pub-year-heading').forEach(function(h){
            var ol = h.nextElementSibling;
            var anyVisible = Array.prototype.some.call(ol.querySelectorAll('.pub-item'), function(li){ return li.style.display !== 'none'; });
            h.style.display = anyVisible ? '' : 'none';
            ol.style.display = anyVisible ? '' : 'none';
        });
        var reviewOl = document.querySelector('#under-review .pub-list');
        if (reviewOl) {
            var reviewHeading = document.querySelector('#under-review h2');
            var anyReviewVisible = Array.prototype.some.call(reviewOl.querySelectorAll('.pub-item'), function(li){ return li.style.display !== 'none'; });
            reviewHeading.style.display = anyReviewVisible ? '' : 'none';
            reviewOl.style.display = anyReviewVisible ? '' : 'none';
        }
    }

    document.querySelectorAll('.filter-group[data-group="type"] .filter-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            document.querySelectorAll('.filter-group[data-group="type"] .filter-btn').forEach(function(b){ b.classList.remove('active'); });
            btn.classList.add('active');
            state.type = btn.dataset.value;
            apply();
        });
    });
    document.querySelectorAll('.filter-toggle').forEach(function(btn){
        btn.addEventListener('click', function(){
            btn.classList.toggle('active');
            state[btn.dataset.flag] = btn.classList.contains('active');
            apply();
        });
    });
    yearSel.addEventListener('change', function(){ state.year = this.value; apply(); });
    venueSel.addEventListener('change', function(){ state.venue = this.value; apply(); });
    keywordSel.addEventListener('change', function(){ state.keyword = this.value; apply(); });
})();
