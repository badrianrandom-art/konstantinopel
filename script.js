const $ = (s) => document.querySelector(s);
const stage=$("#stage"), camera=$("#camera"), caption=$("#caption"), captionSub=$("#captionSub");
const narration=$("#narration"), chapter=$("#chapter"), statusText=$("#status"), progress=$("#progress");
const pauseBtn=$("#pause"), voiceBtn=$("#voice");
let timeline=null, isPaused=true, voiceOn=false, utterance=null;

const scenes=[
 {id:1,time:0,duration:9,label:"THE CITY OF WALLS",title:"KOTA YANG DIANGGAP MUSTAHIL DITAKLUKKAN",sub:"KONSTANTINOPEL · 1453",text:"Selama berabad-abad, Konstantinopel dikenal sebagai salah satu kota paling sulit ditaklukkan. Tembok raksasanya melindungi jantung Kekaisaran Bizantium.",shot:"WIDE ESTABLISHING"},
 {id:2,time:9,duration:10,label:"THE YOUNG SULTAN",title:"SULTAN MUDA DENGAN AMBISI BESAR",sub:"MEHMED II · USIA 21 TAHUN",text:"Pada tahun 1453, Sultan Mehmed II yang baru berusia 21 tahun memimpin pasukan Ottoman. Tujuannya: merebut kota strategis yang telah lama menjadi pusat Bizantium.",shot:"SULTAN'S ARMY"},
 {id:3,time:19,duration:11,label:"THE GREAT SIEGE",title:"MERIAM-MERiam BESAR MENGGUNCANG TEMBOK",sub:"PENGEPUNGAN DIMULAI · APRIL 1453",text:"Pengepungan dimulai pada bulan April. Meriam besar Ottoman membombardir pertahanan kota, sementara para prajurit bersiap menghadapi tembok yang sangat tebal.",shot:"CANNON BATTERY"},
 {id:4,time:30,duration:12,label:"THE UNEXPECTED PLAN",title:"KAPAL-KAPAL MELINTASI DARATAN!",sub:"STRATEGI TELUK TANDUK EMAS",text:"Teluk Tanduk Emas dilindungi rantai besar. Mehmed mengambil langkah tak terduga: sejumlah kapal Ottoman dipindahkan melalui daratan, lalu diluncurkan ke teluk dari sisi lain.",shot:"NAVAL MANEUVER"},
 {id:5,time:42,duration:13,label:"THE FINAL ASSAULT",title:"SERANGAN PENENTUAN DIMULAI",sub:"29 MEI 1453",text:"Setelah pengepungan selama sekitar 53 hari, serangan besar dilancarkan. Pada 29 Mei 1453, pasukan Ottoman berhasil menembus pertahanan dan memasuki kota.",shot:"THE BREACH"},
 {id:6,time:55,duration:14,label:"A TURNING POINT",title:"SEBUAH KOTA, SEBUAH ERA BARU",sub:"KONSTANTINOPEL JATUH · 1453",text:"Jatuhnya Konstantinopel mengakhiri Kekaisaran Bizantium dan menjadi titik penting dalam sejarah dunia. Mehmed kemudian dikenang dengan gelar Al-Fatih, Sang Penakluk.",shot:"HISTORICAL EPILOGUE"}
];
const total=scenes.reduce((n,s)=>n+s.duration,0);

function setScene(scene){
 stage.className=`stage scene-${scene.id}`;
 chapter.textContent=`1453 · ${scene.label}`;
 caption.textContent=scene.title;
 captionSub.textContent=scene.sub;
 narration.textContent=scene.text;
 $("#shotLabel").textContent=scene.shot;
 gsap.fromTo("#shotLabel",{opacity:0,y:8},{opacity:1,y:0,duration:.5});
 gsap.fromTo(".caption-wrap",{opacity:0,y:18},{opacity:1,y:0,duration:.65,ease:"power3.out"});
}
function speakCurrent(){
 if(!voiceOn || !("speechSynthesis" in window)) return;
 speechSynthesis.cancel();
 utterance=new SpeechSynthesisUtterance(narration.textContent);
 utterance.lang="id-ID"; utterance.rate=.94; utterance.pitch=1;
 speechSynthesis.speak(utterance);
}
function buildTimeline(){
 if(timeline) timeline.kill();
 if("speechSynthesis" in window) speechSynthesis.cancel();
 gsap.set(camera,{scale:1,x:0,y:0});
 gsap.set([".cannon",".soldiers",".flag",".smoke","#impact"],{clearProps:"all"});
 timeline=gsap.timeline({paused:true,onUpdate:()=>{
   progress.style.width=`${(timeline.time()/total)*100}%`;
 },onComplete:()=>{
   statusText.textContent="SELESAI · PUTAR ULANG UNTUK MENONTON LAGI";
   pauseBtn.textContent="↻ Putar Lagi";isPaused=true;
 }});
 scenes.forEach((s,i)=>{
   timeline.call(()=>{setScene(s);speakCurrent();},[],s.time);
   const zoom=i===2?1.16:(i===4?1.2:1.08);
   timeline.to(camera,{scale:zoom,x:i%2===0?-8:8,y:-5,duration:s.duration,ease:"sine.inOut"},s.time);
   timeline.to(camera,{scale:1.02,x:0,y:0,duration:1.4,ease:"power2.out"},s.time+s.duration-1.4);
   if(s.id===3){
     timeline.to(".cannon",{opacity:1,duration:.5},s.time+1);
     timeline.to("#smoke",{opacity:.9,scale:1.7,duration:.5},s.time+3);
     timeline.to("#impact",{opacity:1,scale:1.15,duration:.25,ease:"back.out(3)"},s.time+3);
     timeline.to("#impact",{opacity:0,scale:.8,duration:.5},s.time+4);
     timeline.to("#smoke",{opacity:0,duration:2},s.time+5);
   }
   if(s.id===2){
     timeline.to(".soldiers",{opacity:1,duration:1},s.time+1);
     timeline.to(".flag",{opacity:1,duration:.8},s.time+4);
   }
   if(s.id===4){
     timeline.to(".ship-one",{x:"115%",y:"-25%",duration:5,ease:"power2.inOut"},s.time+2);
     timeline.to(".ship-two",{x:"95%",y:"-30%",duration:5,ease:"power2.inOut"},s.time+2);
   }
   if(s.id===5){
     timeline.to(".soldiers",{opacity:1,x:"25%",duration:1.4},s.time+1);
     timeline.to(".flag",{opacity:1,duration:1},s.time+7);
     timeline.to("#impact",{opacity:1,scale:1.1,duration:.3},s.time+5);
     timeline.to("#impact",{opacity:0,duration:.5},s.time+6.5);
   }
   if(s.id===6){
     timeline.to(".soldiers",{opacity:1,duration:1},s.time+1);
     timeline.to(".flag",{opacity:1,duration:1},s.time+2);
     timeline.to(camera,{scale:1.01,y:5,duration:7,ease:"power1.out"},s.time+5);
   }
 });
 timeline.eventCallback("onComplete",()=>{statusText.textContent="SELESAI · PUTAR ULANG UNTUK MENONTON LAGI";pauseBtn.textContent="↻ Putar Lagi";isPaused=true;});
 timeline.play();isPaused=false;pauseBtn.textContent="Ⅱ Jeda";statusText.textContent="SEDANG DIPUTAR";
}
$("#replay").addEventListener("click",buildTimeline);
pauseBtn.addEventListener("click",()=>{
 if(!timeline || timeline.progress()===1){buildTimeline();return;}
 if(isPaused){timeline.resume();isPaused=false;pauseBtn.textContent="Ⅱ Jeda";statusText.textContent="SEDANG DIPUTAR";}
 else{timeline.pause();isPaused=true;pauseBtn.textContent="▶ Lanjutkan";statusText.textContent="DIJEDA";if("speechSynthesis"in window)speechSynthesis.pause();}
});
voiceBtn.addEventListener("click",()=>{
 voiceOn=!voiceOn;voiceBtn.classList.toggle("active",voiceOn);
 voiceBtn.textContent=voiceOn?"🔊 Narasi: ON":"🔇 Narasi: OFF";
 if(!voiceOn && "speechSynthesis"in window)speechSynthesis.cancel();
 else if(voiceOn)speakCurrent();
});
$("#stage").addEventListener("pointermove",e=>{
 if(matchMedia("(max-width:650px)").matches || isPaused)return;
 const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
 gsap.to(camera,{x:x*10,y:y*6,duration:.7,ease:"power2.out",overwrite:"auto"});
});
$("#stage").addEventListener("pointerleave",()=>{if(!isPaused)gsap.to(camera,{x:0,y:0,duration:.8});});
if(!window.gsap){statusText.textContent="GSAP TIDAK TERMUAT · PERIKSA KONEKSI INTERNET";}
else{buildTimeline();}
