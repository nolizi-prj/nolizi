/**
 * SPEC-0002 F2, F3, D9 — the booking page.
 *
 * The server renders UTC. The browser converts for display, in one place, and
 * submits the UTC value it was given. No converted value is ever sent back or
 * stored — that is the architecture the steward confirmed, and the hidden field
 * below is where it is kept honest.
 */

import type { Slot } from '@pumasi/scheduling-core';
import type { Schedule } from './schedules.ts';

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": '#39' }[c]};`);

const SHELL = (title: string, body: string): string => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
 :root{color-scheme:light dark;--fg:#111;--muted:#666;--line:#ddd;--accent:#1a56db}
 @media(prefers-color-scheme:dark){:root{--fg:#eee;--muted:#999;--line:#333;--accent:#7aa2f7}}
 *{box-sizing:border-box}
 body{font:16px/1.5 system-ui,-apple-system,sans-serif;color:var(--fg);
      max-width:34rem;margin:0 auto;padding:2rem 1rem}
 h1{font-size:1.5rem;margin:0 0 .25rem} .muted{color:var(--muted);font-size:.9rem}
 .day{margin:1.5rem 0 .5rem;font-weight:600;font-size:.95rem}
 .slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(7rem,1fr));gap:.5rem}
 button.slot{padding:.6rem;border:1px solid var(--line);border-radius:.4rem;
   background:transparent;color:var(--fg);font:inherit;cursor:pointer}
 button.slot:hover,button.slot[aria-pressed=true]{border-color:var(--accent);color:var(--accent)}
 form{margin-top:1.5rem} .js form:not(.on){display:none}
 label{display:block;margin:.75rem 0 .25rem;font-size:.9rem}
 input{width:100%;padding:.55rem;border:1px solid var(--line);border-radius:.4rem;
   background:transparent;color:var(--fg);font:inherit}
 .notice{font-size:.8rem;color:var(--muted);margin-top:.4rem}
 .submit{margin-top:1rem;padding:.65rem 1.2rem;border:0;border-radius:.4rem;
   background:var(--accent);color:#fff;font:inherit;cursor:pointer}
 .err{border-left:3px solid #c33;padding:.5rem .75rem;margin:1rem 0}
 .ok{border-left:3px solid #2a2;padding:.5rem .75rem;margin:1rem 0}
</style></head><body>${body}</body></html>`;

export function bookingPage(
  schedule: Schedule,
  slots: Slot[],
  opts: { error?: string; csrf?: string } = {},
): string {
  const err = opts.error ? `<p class="err">${esc(opts.error)}</p>` : '';
  // Rendered server-side so the page works without JavaScript. The script
  // below replaces this with the same slots grouped and formatted in the
  // viewer's zone — enhancement, not the only path to a booking.
  const buttons = slots
    .map(
      (s) =>
        `<button type="button" class="slot" data-start="${esc(s.start)}" data-end="${esc(s.end)}" aria-pressed="false">${esc(s.start.slice(11, 16))} UTC</button>`,
    )
    .join('');

  const empty = slots.length === 0 ? '<p class="muted">No times available in this window.</p>' : '';

  return SHELL(
    schedule.title,
    `<h1>${esc(schedule.title)}</h1>
<p class="muted">${schedule.duration_minutes} minutes &middot; times shown in <span id="tz"></span></p>
${err}${empty}
<div id="list"><div class="slots">${buttons}</div></div>
<form method="post" action="/${esc(schedule.slug)}/book" id="f">
  <noscript><p class="muted">Times above are shown in UTC. With JavaScript on they
    appear in your own timezone.</p></noscript>
  <input type="hidden" name="start" id="start"><input type="hidden" name="end" id="end">
  <label for="name">Your name</label><input id="name" name="name" required autocomplete="name">
  <label for="email">Your email</label><input id="email" name="email" type="email" required autocomplete="email">
  <!-- D9 · told at the point of collection, next to the field, not behind a link -->
  <p class="notice">We store your name, email and the meeting time so the organiser
    can meet you. Nobody else sees them. The confirmation email has a link that
    cancels the booking and deletes these details.</p>
  <input type="hidden" name="booker_tz" id="btz">
  <button class="submit" type="submit">Confirm booking</button>
</form>
<script>
// F2 — conversion happens HERE and nowhere else. The values submitted below are
// the UTC instants the server sent, untouched.
(function(){
  document.documentElement.className += ' js';
  var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  document.getElementById('tz').textContent = tz;
  document.getElementById('btz').value = tz;
  var all = ${JSON.stringify(slots)};
  var dayFmt = new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric'});
  var timeFmt = new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'});
  var byDay = {};
  all.forEach(function(s){
    var d = new Date(s.start), k = dayFmt.format(d);
    (byDay[k] = byDay[k] || []).push(s);
  });
  var list = document.getElementById('list');
  list.textContent = '';            // replace the server-rendered fallback
  Object.keys(byDay).forEach(function(k){
    var h = document.createElement('div'); h.className='day'; h.textContent=k; list.appendChild(h);
    var g = document.createElement('div'); g.className='slots';
    byDay[k].forEach(function(s){
      var b=document.createElement('button');
      b.type='button'; b.className='slot'; b.textContent=timeFmt.format(new Date(s.start));
      b.onclick=function(){
        document.querySelectorAll('.slot').forEach(function(x){x.setAttribute('aria-pressed','false')});
        b.setAttribute('aria-pressed','true');
        document.getElementById('start').value = s.start;
        document.getElementById('end').value = s.end;
        document.getElementById('f').classList.add('on');
        document.getElementById('name').focus();
      };
      g.appendChild(b);
    });
    list.appendChild(g);
  });
})();
</script>`,
  );
}

export function confirmedPage(opts: {
  title: string;
  start: string;
  manageUrl: string;
}): string {
  return SHELL(
    'Booked',
    `<h1>Booked</h1>
<p class="ok">${esc(opts.title)} is confirmed for <time datetime="${esc(opts.start)}" id="t">${esc(opts.start)}</time>.</p>
<p class="muted">A confirmation is on its way. To cancel or move it, use
  <a href="${esc(opts.manageUrl)}">this link</a> — keep it, it is the only way back in.</p>
<script>var t=document.getElementById('t');
 t.textContent=new Date(t.getAttribute('datetime')).toLocaleString();</script>`,
  );
}

export function managePage(opts: {
  title: string;
  start: string;
  token: string;
  status: string;
}): string {
  const active = opts.status === 'confirmed';
  return SHELL(
    'Your booking',
    `<h1>Your booking</h1>
<p>${esc(opts.title)} — <time datetime="${esc(opts.start)}" id="t">${esc(opts.start)}</time></p>
<p class="muted">Status: ${esc(opts.status)}</p>
${
  active
    ? `<form method="post" action="/b/${esc(opts.token)}/cancel">
         <button class="submit" type="submit">Cancel this booking</button>
       </form>
       <!-- D8 · a bearer link may cancel, but deleting data takes a second step -->
       <form method="post" action="/b/${esc(opts.token)}/delete">
         <label><input type="checkbox" name="confirm" value="yes" required style="width:auto">
           Also delete my name and email</label>
         <button class="submit" type="submit">Cancel and delete my details</button>
       </form>`
    : '<p class="muted">This booking is no longer active.</p>'
}
<script>var t=document.getElementById('t');
 t.textContent=new Date(t.getAttribute('datetime')).toLocaleString();</script>`,
  );
}

export function errorPage(code: number, message: string): string {
  return SHELL(String(code), `<h1>${code}</h1><p class="err">${esc(message)}</p>`);
}
