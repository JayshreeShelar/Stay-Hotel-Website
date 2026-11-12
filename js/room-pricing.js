/* Indicative room quote calculator. No configured upper limit for people or stay duration. */
document.addEventListener('DOMContentLoaded', function () {
  var params=new URLSearchParams(location.search), key=params.get('room')||'deluxe';
  var rooms=window.RoyalStay&&window.RoyalStay.rooms, room=rooms&&rooms[key];
  var ci=document.getElementById('rd-checkin'), co=document.getElementById('rd-checkout'), guests=document.getElementById('rd-guests-count');
  if(!room||!ci||!co||!guests)return;
  var fmt=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  var today=new Date();today.setHours(0,0,0,0);var tomorrow=new Date(today);tomorrow.setDate(tomorrow.getDate()+1);
  ci.min=iso(today);co.min=iso(tomorrow);if(!ci.value)ci.value=iso(today);if(!co.value)co.value=iso(tomorrow);
  function calculate(){
    var start=ci.value?new Date(ci.value+'T00:00:00'):null,end=co.value?new Date(co.value+'T00:00:00'):null;
    var n=start&&end?Math.round((end-start)/86400000):0,count=Number(guests.value);
    if(!start||!end||start<today||n<1||!Number.isInteger(count)||count<1){
      document.getElementById('rd-price-error').hidden=false;document.getElementById('rd-price-error').textContent='Please select valid dates and enter at least one person.';
      document.getElementById('rd-estimated-total').textContent='—';document.getElementById('rd-night-count').textContent='—';return;
    }
    document.getElementById('rd-price-error').hidden=true;var total=room.price*n;
    document.getElementById('rd-night-rate').textContent=fmt.format(room.price);document.getElementById('rd-night-count').textContent=n+' night'+(n===1?'':'s');
    document.getElementById('rd-guest-summary').textContent=count;document.getElementById('rd-estimated-total').textContent=fmt.format(total);
    document.getElementById('rd-price').textContent=fmt.format(room.price)+' / night';
    var note=document.getElementById('rd-capacity-note');if(note)note.textContent='';
    var q=new URLSearchParams({room:key,checkin:ci.value,checkout:co.value,guests:String(count),nights:String(n),estimatedTotal:String(total)});document.getElementById('rd-contact-link').href='contact.html?'+q.toString()+'#contact-form';
  }
  ci.addEventListener('change',function(){if(!ci.value){calculate();return;}var min=new Date(ci.value+'T00:00:00');min.setDate(min.getDate()+1);co.min=iso(min);if(co.value<=ci.value)co.value=iso(min);calculate();});
  co.addEventListener('change',calculate);guests.addEventListener('input',calculate);calculate();
});
