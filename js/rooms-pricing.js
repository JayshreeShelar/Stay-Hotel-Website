/* Popup price estimator for every room and suite. People count has no configured maximum. */
document.addEventListener('DOMContentLoaded', function () {
  var modal=document.getElementById('price-calc-modal'); if(!modal) return;
  var money=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  var names={deluxe:'Deluxe Room',executive:'Executive Suite',royal:'Royal Suite',family:'Family Suite'};
  var ci=document.getElementById('price-calc-checkin'), co=document.getElementById('price-calc-checkout');
  var people=2, roomKey='deluxe', rate=0;
  var count=document.getElementById('price-calc-people-count');
  var amount=document.getElementById('price-calc-amount');
  var nightsLabel=document.getElementById('price-calc-nights');
  var error=document.getElementById('price-calc-error');
  var enquire=document.getElementById('price-calc-enquire');
  function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  var today=new Date(); today.setHours(0,0,0,0);
  var tomorrow=new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
  function close(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  function calculate(){
    var start=ci.value?new Date(ci.value+'T00:00:00'):null;
    var end=co.value?new Date(co.value+'T00:00:00'):null;
    var nights=start&&end?Math.round((end-start)/86400000):0;
    if(!start||!end||start<today||nights<1||!Number.isInteger(people)||people<1){
      amount.textContent='—'; nightsLabel.textContent='Choose valid stay dates';
      error.hidden=false; error.textContent='Please select a valid check-in and check-out date.';
      enquire.href='contact.html?room='+encodeURIComponent(roomKey)+'#contact-form'; return;
    }
    error.hidden=true; var total=rate*nights; amount.textContent=money.format(total);
    nightsLabel.textContent=nights+(nights===1?' night':' nights')+' · '+people+(people===1?' person':' people');
    var q=new URLSearchParams({room:roomKey,checkin:ci.value,checkout:co.value,guests:String(people),nights:String(nights),estimatedTotal:String(total)});
    enquire.href='contact.html?'+q.toString()+'#contact-form';
  }
  document.querySelectorAll('[data-price-open]').forEach(function(btn){btn.addEventListener('click',function(){
    roomKey=btn.dataset.room; rate=Number(btn.dataset.rate)||0; people=2; count.textContent=people;
    document.getElementById('price-calc-title').textContent='Calculate Your Stay';
    document.getElementById('price-calc-room-name').textContent=names[roomKey]+' · '+money.format(rate)+' per night';
    ci.min=iso(today); co.min=iso(tomorrow); ci.value=iso(today); co.value=iso(tomorrow);
    calculate(); modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
    document.getElementById('price-calc-minus').focus();
  });});
  document.getElementById('price-calc-minus').addEventListener('click',function(){people=Math.max(1,people-1);count.textContent=people;calculate();});
  document.getElementById('price-calc-plus').addEventListener('click',function(){people+=1;count.textContent=people;calculate();});
  ci.addEventListener('change',function(){if(!ci.value){calculate();return;}var next=new Date(ci.value+'T00:00:00');next.setDate(next.getDate()+1);co.min=iso(next);if(!co.value||co.value<=ci.value)co.value=iso(next);calculate();});
  co.addEventListener('change',calculate);
  modal.querySelectorAll('[data-price-close]').forEach(function(el){el.addEventListener('click',close);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('is-open'))close();});
});
