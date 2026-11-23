/* Rosco 4D Andalucía · IES Sidón
   Aplicación estática: sin dependencias, sin servidores ni servicios de pago. */
(() => {
  'use strict';
  const LETTERS = [...'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'];
  const BASE_BANK = JSON.parse(JSON.stringify(window.ROSCO_QUESTIONS));
  const installationKey = window.ROSCO_STANDALONE ? '_portable_'+String(window.ROSCO_PORTABLE_ID||'default') : '_v4';
  const KEYS = {bank:'rosco4d_custom_bank'+installationKey,legacy:'rosco4d_custom_bank_v1',game:'rosco4d_saved_game_v45'+installationKey,sound:'rosco4d_sound_v1'};
  const $ = (id) => document.getElementById(id);
  const ordinal = {1:"¡Con salero!",2:"¡Olé tu arte!",3:"¡Aquí hay duende!",4:"¡Quillo, qué nivelazo!"};
  const levelNames = {1:"Para entrar en compás",2:"La cosa se anima",3:"Hay que tener tablas",4:"Para auténticas eminencias"};
  const safeRead = (key) => {try {return JSON.parse(localStorage.getItem(key));} catch {return null;}};
  const safeWrite = (key, value) => {try {localStorage.setItem(key,JSON.stringify(value));} catch { /* almacenamiento privado o desactivado */ }};
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const norm = (s) => String(s ?? '').toLocaleLowerCase('es').replace(/ñ/g,'~n~').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/~n~/g,'ñ').replace(/[^a-z0-9ñ]/gi,'');
  // Una solución o alternativa solo es válida si cumple el tipo de pista (con acentos normalizados).
  const fitsLetter = (mode,letter,answer) => {
    const word=norm(answer), l=norm(letter);
    if(word.length<2 || !l)return false;
    return mode==='starts' ? word.startsWith(l) : word.includes(l);
  };
  const testLetter = (q) => fitsLetter(q.mode,q.letter,q.answer);
  const validEntry = (q,l) => q && q.letter===l && ['starts','contains'].includes(q.mode) && typeof q.answer==='string' && testLetter(q) && typeof q.clue==='string' && q.clue.trim() && typeof q.fact==='string' && Array.isArray(q.aliases) && q.aliases.every(v => typeof v==='string' && fitsLetter(q.mode,q.letter,v));
  // Conserva las ediciones guardadas de versiones anteriores; solo descarta alternativas inválidas.
  const cleanAliases = (data) => {
    if(data && typeof data==='object')for(const l of [1,2,3,4]){
      const group=data[l];
      // Compatible tanto con el banco anterior de un solo equipo como con el nuevo doble.
      const lists=Array.isArray(group)?[group]:['green','white'].map(t=>group?.[t]).filter(Array.isArray);
      for(const list of lists)for(const q of list){
        if(q && Array.isArray(q.aliases))q.aliases=q.aliases.filter(a=>typeof a==='string' && fitsLetter(q.mode,q.letter,a));
      }
    }
    return data;
  };
  const differentTeams = (data, level) => {
    const green=data[level].green,white=data[level].white;
    const answers=new Set(green.map(q=>norm(q.answer)));
    return white.every(q=>!answers.has(norm(q.answer)));
  };
  const validBank = (data) => !!data && typeof data==='object' && [1,2,3,4].every(level =>
    data[level] && ['green','white'].every(team => Array.isArray(data[level][team]) && data[level][team].length===27 &&
      data[level][team].every((q,i)=>validEntry(q,LETTERS[i]))) && differentTeams(data,level));
  const validOldBank = (data) => data && [1,2,3,4].every(l=>Array.isArray(data[l]) && data[l].length===27 && data[l].every((q,i)=>validEntry(q,LETTERS[i])));
  let bank = cleanAliases(safeRead(KEYS.bank));
  if (validBank(bank)) safeWrite(KEYS.bank,bank);
  if (!validBank(bank)) {
    bank=clone(BASE_BANK);
    const legacy=window.ROSCO_STANDALONE ? null : safeRead(KEYS.legacy);
    if (validOldBank(legacy)) {
      for(const level of [1,2,3,4]) bank[level].green=cleanAliases(clone(legacy[level]));
      if(validBank(bank))safeWrite(KEYS.bank,bank);
      else bank=clone(BASE_BANK);
    }
  }
  let selectedLevel='1'; let selectedMode='solo'; let selectedSoloBank='green'; let duration=300;
  let game=null; let timerInterval=null; let lastTick=0; let lastPersist=0;
  let muted=safeRead(KEYS.sound)===false; let audioContext=null; let toastTimeout=null; let confirmCallback=null;
  let editorSelection=null; let editorDirty=false;
  const screens={setup:$('setupScreen'),game:$('gameScreen'),end:$('endScreen')};

  function showScreen(name) {Object.entries(screens).forEach(([k,v]) => v.classList.toggle('is-hidden',k!==name));window.scrollTo({top:0,behavior:'instant'});}
  function notify(message) {const el=$('toast'); el.textContent=message;el.classList.remove('is-hidden');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.add('is-hidden'),2800);}
  function openDialog(id) {$(id).showModal();}
  function closeDialog(id) {$(id).close();}
  function ask(title,message,fn){$('confirmHeading').textContent=title;$('confirmBody').textContent=message;confirmCallback=fn;openDialog('confirmDialog');}
  function saveGame(){if(game && game.phase!=='finished')safeWrite(KEYS.game,game);}
  function clearSavedGame(){try{localStorage.removeItem(KEYS.game);}catch{} }
  function getSavedGame(){
    const data=safeRead(KEYS.game);
    if(!data || ![1,2,3,4].includes(Number(data.level)) || !data.questions || !['green','white'].every(t=>Array.isArray(data.questions[t]) && data.questions[t].length===27 && data.questions[t].every((q,i)=>validEntry(q,LETTERS[i]))) ||
       !['running','feedback'].includes(data.phase) || !['solo','duel'].includes(data.mode) || typeof data.duration!=='number' || !['green','white'].includes(data.soloBank))return null;
    if(data.mode==='duel'){
      if(!Array.isArray(data.teamStatuses) || data.teamStatuses.length!==2 ||
         !data.teamStatuses.every(a=>Array.isArray(a) && a.length===27 && a.every(v=>['pending','correct','wrong'].includes(v))) ||
         !Array.isArray(data.teamCursors) || data.teamCursors.length!==2 ||
         !data.teamCursors.every(n=>Number.isInteger(n) && n>=-1 && n<27) ||
         ![0,1].includes(data.activeTeam))return null;
    }else if(!Array.isArray(data.statuses) || data.statuses.length!==27)return null;
    return data;
  }
  function updateResume(){
    const saved=getSavedGame();$('resumeBanner').classList.toggle('is-hidden',!saved);
    if(saved){
      const hits=saved.mode==='duel' ? saved.teamStatuses.reduce((sum,states)=>sum+states.filter(x=>x==='correct').length,0) : saved.statuses.filter(x=>x==='correct').length;
      $('resumeBanner').querySelector('span').textContent=`Partida guardada: ${ordinal[saved.level]} · ${hits} aciertos · ${saved.mode==='duel'?'2 equipos, roscos independientes':'clase completa'}.`;
    }
  }
  function chooseLevel(value){selectedLevel=value;document.querySelectorAll('.level-card').forEach(btn=>{const active=btn.dataset.level===value;btn.classList.toggle('is-selected',active);btn.setAttribute('aria-pressed',String(active));});}
  function chooseMode(value){selectedMode=value;document.querySelectorAll('#modeOptions button').forEach(btn=>{const active=btn.dataset.mode===value;btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',String(active));});$('soloBankRow').classList.toggle('is-hidden',value==='duel');}
  function makePreview(){const container=$('previewOrbit');LETTERS.forEach((letter,i)=>{const theta=(i/27)*Math.PI*2-Math.PI/2;const el=document.createElement('span');el.className='preview-letter';el.textContent=letter;el.style.left=`${50+60*Math.cos(theta)}%`;el.style.top=`${50+60*Math.sin(theta)}%`;container.append(el);});}
  function initWheel(){const target=$('roscoLetters'); target.replaceChildren(); LETTERS.forEach((letter,i)=>{const theta=(i/27)*Math.PI*2-Math.PI/2;const btn=document.createElement('button');btn.type='button';btn.className='letter-btn';btn.textContent=letter;btn.setAttribute('aria-label',`Letra ${letter}`);btn.dataset.index=String(i);btn.style.left=`${50+43.3*Math.cos(theta)}%`;btn.style.top=`${50+43.3*Math.sin(theta)}%`;btn.addEventListener('click',()=>jumpTo(i));target.append(btn);});}
  function initGame(){
    game={level:Number(selectedLevel),mode:selectedMode,duration,remainingMs:duration*1000,phase:'running',paused:false,
      cursor:0,activeTeam:0,teamScores:[0,0],
      statuses:LETTERS.map(()=> 'pending'),
      teamStatuses:[LETTERS.map(()=> 'pending'),LETTERS.map(()=> 'pending')],
      teamCursors:[0,0], passes:0,soloBank:selectedSoloBank,questions:clone(bank[selectedLevel]),
      feedback:null,feedbackCursor:null,feedbackTeam:null,
      startedAt:new Date().toISOString(),reason:''};
    clearSavedGame();launchGame();
  }
  function launchGame(){if(!game)return;$('gameLevelChip').textContent=`${ordinal[game.level]}`;$('gameModeChip').textContent=game.mode==='duel'?'DUELO · 2 EQUIPOS':`CLASE · BANCO ${game.soloBank==='green'?'VERDE':'BLANCO'}`;$('teamsRow').classList.toggle('is-hidden',game.mode!=='duel');showScreen('game');renderAll();lastTick=performance.now();startTimer();saveGame();}
  function startTimer(){if(timerInterval!==null)clearInterval(timerInterval);lastTick=performance.now();timerInterval=setInterval(()=>{const now=performance.now(),delta=Math.max(0,Math.min(3000,now-lastTick));lastTick=now;if(!game || game.duration===0 || game.phase!=='running' || game.paused)return;game.remainingMs=Math.max(0,game.remainingMs-delta);renderTimer();if(now-lastPersist>2500){saveGame();lastPersist=now;}if(game.remainingMs<=0)finishGame('timeout');},200);}
  function stopTimer(){if(timerInterval!==null){clearInterval(timerInterval);timerInterval=null;}}
  function timeLabel(){if(!game || !game.duration)return '∞';const seconds=Math.ceil(game.remainingMs/1000);return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
  function renderTimer(){const display=$('timerDisplay');$('timeValue').textContent=timeLabel();display.classList.toggle('time-warning',!!game?.duration && game.remainingMs<=60000 && game.remainingMs>20000);display.classList.toggle('time-critical',!!game?.duration && game.remainingMs<=20000);$('pauseButton').disabled=!!game && game.phase==='feedback';$('pauseButton').innerHTML=game?.paused?'<svg><use href="#i-play"/></svg><span>Reanudar</span>':'<svg><use href="#i-pause"/></svg><span>Pausar</span>';}
  // Cada equipo conserva SUS 27 estados y SU letra actual. La rueda visible es la del equipo en turno.
  function statusesFor(team=game.activeTeam){return game.mode==='duel' ? game.teamStatuses[team] : game.statuses;}
  function teamKey(team=game.activeTeam){return game.mode==='duel'?(team===0?'green':'white'):game.soloBank;}
  function questionFor(index,team=game.activeTeam){return game.questions[teamKey(team)][index];}
  function remaining(team=game.activeTeam){return statusesFor(team).filter(v=>v==='pending').length;}
  function allDone(){return game.mode==='duel' ? remaining(0)===0 && remaining(1)===0 : remaining()===0;}
  function setCursor(index){game.cursor=index;if(game.mode==='duel')game.teamCursors[game.activeTeam]=index;}
  function switchTeam(){
    if(game.mode!=='duel')return;
    const other=1-game.activeTeam;
    // Si el contrincante terminó su rosco, no se le vuelve a dar un turno vacío.
    if(remaining(other)>0)game.activeTeam=other;
    if(remaining(game.activeTeam)>0){
      let index=game.teamCursors[game.activeTeam];
      if(!Number.isInteger(index) || index<0 || statusesFor()[index]!=='pending')index=nextPending((index+26)%27);
      setCursor(index);
    }
  }
  function nextPending(from,team=game.activeTeam){
    const statuses=statusesFor(team);
    for(let offset=1;offset<=27;offset++){
      const idx=(from+offset)%27;
      if(statuses[idx]==='pending')return idx;
    }
    return -1;
  }
  function jumpTo(index){
    if(!game || game.phase==='finished')return;
    if(game.phase==='feedback'){notify('Primero pulsa «Siguiente letra».');return;}
    if(statusesFor()[index]!=='pending'){notify('Esa letra ya está respondida para este equipo.');return;}
    setCursor(index);renderAll();saveGame();
  }
  function renderAll(){if(!game)return;renderWheel();renderQuestion();renderScoreboard();renderTimer();}
  function renderWheel(){
    const states=statusesFor();let correct=0;
    document.querySelectorAll('.letter-btn').forEach((btn,i)=>{
      const status=states[i];
      btn.classList.toggle('is-current',i===game.cursor && game.phase!=='finished' && status==='pending');
      btn.classList.toggle('is-correct',status==='correct');
      btn.classList.toggle('is-wrong',status==='wrong');
      btn.setAttribute('aria-label',`${LETTERS[i]}: ${status==='correct'?'acierto':status==='wrong'?'fallo':i===game.cursor?'pregunta actual':'pendiente'}${game.mode==='duel' ? ' del equipo '+teamName(game.activeTeam) : ''}`);
      if(status==='correct')correct++;
    });
    $('coreCorrect').textContent=correct;
  }
  function teamName(team){return team===0?'verde':'blanco';}
  function renderQuestion(){
    const inFeedback=game.phase==='feedback';
    const index=inFeedback ? (game.feedbackCursor??game.cursor) : game.cursor;
    const q=questionFor(index,inFeedback ? game.feedbackTeam : game.activeTeam);
    $('questionCounter').textContent=`LETRA ${index+1} DE 27 · ${ordinal[game.level]}`;
    $('gameTitle').textContent=game.mode==='duel'
      ? (inFeedback ? `Respuesta del equipo ${teamName(game.feedbackTeam)}` : `Turno del equipo ${teamName(game.activeTeam)}`)
      : levelNames[game.level];
    $('letterMini').textContent=q.letter;
    $('letterRule').textContent=q.mode==='starts'?`EMPIEZA POR LA ${q.letter}`:`CONTIENE LA ${q.letter}`;
    $('questionText').textContent=q.clue;
    $('answerInput').disabled=inFeedback || game.paused;
    $('checkInputButton').disabled=inFeedback || game.paused;
    $('correctButton').disabled=game.paused || (!inFeedback && $('answerInput').value.trim().length>0);
    $('wrongButton').disabled=game.paused;
    $('passButton').disabled=game.paused;
    $('questionActions').classList.toggle('is-hidden',inFeedback);
    $('nextActions').classList.toggle('is-hidden',!inFeedback);
    $('answerInput').closest('.answer-input-block').classList.toggle('is-hidden',inFeedback);
    $('answerValidation').textContent='';$('answerValidation').classList.add('is-hidden');$('answerInput').removeAttribute('aria-invalid');
    $('revealButton').classList.toggle('is-hidden',inFeedback);
    $('revealCard').classList.add('is-hidden');$('answerInput').value='';
    $('feedbackCard').classList.toggle('is-hidden',!inFeedback);
    if(inFeedback){
      const correct=game.feedback==='correct';
      $('feedbackCard').classList.toggle('is-wrong',!correct);
      $('feedbackIcon').textContent=correct?'✓':'×';
      $('feedbackTitle').textContent=correct
        ? (game.mode==='duel'?`¡Correcto! Sigue el equipo ${teamName(game.activeTeam)}`:'¡Respuesta correcta!')
        : (game.mode==='duel'?`Fallo · ahora juega el equipo ${teamName(game.activeTeam)}`:'¡Seguimos aprendiendo!');
      $('feedbackAnswer').textContent=`Respuesta: ${q.answer}`;
      $('feedbackFact').textContent=q.fact;
      $('feedbackAttempt').textContent=game.feedbackSource==='typed' ? `Has escrito: «${game.feedbackInput||''}».` : 'Respuesta marcada por el docente (oral).';
      $('nextButton').textContent='';
      $('nextButton').textContent=game.mode==='duel' && !correct ? `Continuar con equipo ${teamName(game.activeTeam)} →` : 'Siguiente letra →';
    }
  }
  function renderScoreboard(){
    const states=statusesFor();
    const c=states.filter(v=>v==='correct').length,w=states.filter(v=>v==='wrong').length,p=27-c-w;
    $('scoreCorrect').textContent=c;$('scoreWrong').textContent=w;$('scorePending').textContent=p;
    $('progressCorrect').style.width=`${c/27*100}%`;$('progressWrong').style.width=`${w/27*100}%`;
    $('progressLabel').textContent=game.mode==='duel'?`PROGRESO DEL EQUIPO ${teamName(game.activeTeam).toUpperCase()}`:'PROGRESO DEL ROSCO';
    $('teamOneScore').textContent=game.teamScores[0];$('teamTwoScore').textContent=game.teamScores[1];
    $('teamOne').classList.toggle('active',game.activeTeam===0);
    $('teamTwo').classList.toggle('active',game.activeTeam===1);
    $('teamOneProgress').textContent=game.mode==='duel'?`${27-remaining(0)}/27 letras`:'';
    $('teamTwoProgress').textContent=game.mode==='duel'?`${27-remaining(1)}/27 letras`:'';
  }
  function mark(status,source='teacher',typedText=''){
    if(source==='teacher' && status==='correct' && $('answerInput').value.trim()){
      $('answerValidation').textContent='Hay texto escrito: pulsa «Comprobar» o bórralo para corregir una respuesta oral.';
      $('answerValidation').classList.remove('is-hidden');return;
    }
    if(!game || game.phase!=='running' || game.paused)return;
    const oldTeam=game.activeTeam, oldIndex=game.cursor;
    if(statusesFor()[oldIndex]!=='pending')return;
    statusesFor()[oldIndex]=status;
    if(status==='correct')game.teamScores[oldTeam]++;
    game.feedback=status;game.feedbackCursor=oldIndex;game.feedbackTeam=oldTeam;
    game.feedbackSource=source;game.feedbackInput=source==='typed'?typedText:'';
    if(game.mode==='duel'){
      // Al responder, este equipo queda preparado para continuar en SU siguiente letra.
      game.teamCursors[oldTeam]=nextPending(oldIndex,oldTeam);
      if(status==='wrong')switchTeam();
    }
    game.phase='feedback';sound(status==='correct'?'correct':'wrong');renderAll();saveGame();
  }
  function pass(){
    if(!game || game.phase!=='running' || game.paused)return;
    game.passes++;
    const nextIndex=nextPending(game.cursor);
    if(game.mode==='duel'){
      // Pasapalabra conserva la letra sin responder, pero el equipo retoma en la siguiente pendiente.
      game.teamCursors[game.activeTeam]=nextIndex;
      switchTeam(); // El otro equipo usa su propio cursor, inicialmente A.
    }else if(nextIndex>=0)setCursor(nextIndex);
    sound('pass');renderAll();saveGame();
  }
  function next(){
    if(!game || game.phase!=='feedback')return;
    if(allDone()){finishGame('completed');return;}
    if(game.mode==='duel'){
      // En acierto continúa el mismo equipo. En fallo el otro equipo ya quedó activado.
      if(game.feedback==='correct'){
        const active=game.activeTeam;
        if(remaining(active)>0)setCursor(game.teamCursors[active]);
        else switchTeam();
      }
      // Si el jugador entrante había terminado, vuelve al único equipo con pendientes.
      if(remaining(game.activeTeam)===0)switchTeam();
    }else setCursor(nextPending(game.cursor));
    game.phase='running';game.feedback=null;game.feedbackCursor=null;game.feedbackTeam=null;
    renderAll();saveGame();
  }
  // V4.5: igualdad exacta con solución o alternativas completas que respetan la letra.
  function matchesFullAnswer(question, rawInput){
    const typed=norm(rawInput);
    if(!question || typed.length<2)return false;
    const candidates=[question.answer,...(Array.isArray(question.aliases)?question.aliases:[])];
    return candidates.some(candidate=>{
      const full=norm(candidate);
      return full.length>=2 && fitsLetter(question.mode,question.letter,candidate) && typed===full;
    });
  }
  function checkTyped(){
    if(!game || game.phase!=='running' || game.paused)return;
    const text=$('answerInput').value.trim();
    const typed=norm(text);
    if(typed.length<2){
      // Ni un acierto ni un fallo: la entrada no es una respuesta (ej. «A» o «Q»).
      $('answerInput').setAttribute('aria-invalid','true');
      $('answerValidation').textContent=typed.length===0
        ? 'Escribe la palabra o expresión completa antes de comprobar.'
        : `«${text}» es una respuesta incompleta. Escribe la palabra entera: una sola letra nunca puntúa.`;
      $('answerValidation').classList.remove('is-hidden');
      return;
    }
    const question=questionFor(game.cursor);
    mark(matchesFullAnswer(question,text)?'correct':'wrong','typed',text);
  }
  function reveal(){if(!game || game.phase!=='running')return;const visible=!$('revealCard').classList.contains('is-hidden');$('revealCard').classList.toggle('is-hidden',visible);$('revealAnswer').textContent=questionFor(game.cursor).answer;$('revealButton').textContent=visible?'Ver solución':'Ocultar solución';if(visible){$('revealButton').innerHTML='<svg><use href="#i-eye"/></svg> Ver solución';}}
  function togglePause(){if(!game || game.phase!=='running')return;game.paused=!game.paused;lastTick=performance.now();renderTimer();renderQuestion();saveGame();notify(game.paused?'Partida en pausa.':'¡Reanudamos!');}
  function finishGame(reason){
    if(!game)return;
    stopTimer();game.phase='finished';game.reason=reason;clearSavedGame();
    $('endTitle').textContent=reason==='timeout'?'¡Tiempo cumplido!':'¡Rosco completado!';
    $('endSubtitle').textContent=reason==='timeout'?'Se acabó el tiempo. ¡Lo importante es todo lo aprendido!':'Habéis recorrido Andalucía, su historia, sus símbolos y sus tradiciones.';
    const arrays=game.mode==='duel'?game.teamStatuses:[game.statuses];
    const c=arrays.reduce((sum,a)=>sum+a.filter(s=>s==='correct').length,0);
    const w=arrays.reduce((sum,a)=>sum+a.filter(s=>s==='wrong').length,0);
    $('endCorrect').textContent=c;$('endWrong').textContent=w;
    $('endPending').textContent=arrays.length*27-c-w;$('endCourse').textContent=ordinal[game.level];
    $('endTeamSummary').classList.toggle('is-hidden',game.mode!=='duel');
    if(game.mode==='duel'){
      const [a,b]=game.teamScores;
      const winner=a===b?'¡Empate! Gran trabajo de ambos equipos.':`¡Gana el equipo ${a>b?'verde':'blanco'}!`;
      $('endTeamSummary').textContent=`${winner} · Equipo verde: ${a} aciertos · Equipo blanco: ${b} aciertos`;
    }
    const container=$('endLetters');container.replaceChildren();
    arrays.forEach((states,team)=>{
      const section=document.createElement('div');section.className='end-team-letters';
      if(game.mode==='duel'){
        const heading=document.createElement('strong');heading.className='end-team-label';
        heading.textContent=`Equipo ${teamName(team)} · ${states.filter(s=>s==='correct').length} de 27`;
        section.append(heading);
      }
      const letters=document.createElement('div');letters.className='end-letter-row';
      LETTERS.forEach((letter,i)=>{
        const node=document.createElement('span');node.className=`end-letter ${states[i]==='pending'?'':states[i]}`;
        node.textContent=letter;node.title=questionFor(i,team).answer;letters.append(node);
      });
      section.append(letters);container.append(section);
    });
    showScreen('end');sound('finish');
  }
  function backToSetup(){if(game && game.phase!=='finished'){game.paused=true;saveGame();}showScreen('setup');updateResume();}
  function resume(){const saved=getSavedGame();if(!saved){notify('No hay una partida guardada.');updateResume();return;}game=saved;game.paused=true;selectedLevel=String(game.level);selectedMode=game.mode;selectedSoloBank=game.soloBank;chooseLevel(selectedLevel);chooseMode(selectedMode);$('soloBankSelect').value=selectedSoloBank;duration=game.duration;$('timeSelect').value=String(duration);launchGame();notify('Partida recuperada. Pulsa «Reanudar» para continuar.');}
  function discard(){ask('¿Descartar la partida?','Se eliminará el progreso guardado en este navegador.',()=>{clearSavedGame();game=null;updateResume();notify('Partida descartada.');});}
  function fromNewGame(){const saved=getSavedGame();if(saved){ask('¿Comenzar de cero?','La partida guardada se sustituirá por una nueva.',initGame);}else initGame();}

  // Un único HTML portátil: el banco queda incrustado en el propio archivo.
  function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function downloadBlob(blob,filename){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);}
  function portableScript(){
    const safe=JSON.stringify(bank).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
    const id='p'+Date.now().toString(36)+Math.floor(Math.random()*0xffff).toString(36);
    return `window.ROSCO_STANDALONE = true;window.ROSCO_PORTABLE_ID=${JSON.stringify(id)};window.ROSCO_QUESTIONS = ${safe};`;
  }
  function downloadPortable(){
    if(editorDirty){notify('Guarda primero la pregunta que estás editando.');$('editorError').textContent='Pulsa «Guardar esta pregunta» antes de preparar el HTML para la PDI.';return;}
    let html;
    if(window.ROSCO_PORTABLE_TEMPLATE_BASE64){
      const raw=atob(window.ROSCO_PORTABLE_TEMPLATE_BASE64);
      const bytes=Uint8Array.from(raw,ch=>ch.charCodeAt(0));
      const template=new TextDecoder('utf-8').decode(bytes);
      html=template.replace('/*__ROSCO_'+'PREGUNTAS_PORTATILES__*/',portableScript());
    }else if(window.ROSCO_STANDALONE){
      // El HTML portátil también puede volver a exportarse tras editarlo.
      const doc=document.documentElement.cloneNode(true);
      const script=doc.querySelector('#portableBank');
      if(!script){notify('No se encuentra el banco de preguntas del archivo.');return;}
      script.textContent=portableScript();
      html='<!doctype html>\n'+doc.outerHTML;
    }else{notify('No se encuentra el módulo de exportación. Comprueba que la carpeta js esté completa.');return;}
    const today=new Date().toISOString().slice(0,10);
    downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),`ROSCO_4D_MIS_PREGUNTAS_PDI_${today}.html`);
    notify('¡Listo! Descargado tu HTML personalizado. Ábrelo en la PDI.');
  }
  function printStandaloneAnswers(){
    const level=game?.level??selectedLevel;
    const chosen=game?.mode==='duel'?'both':game?.soloBank??selectedSoloBank;
    const teams=chosen==='both'?['green','white']:[chosen];
    const title='Rosco 4D · Solucionario · '+ordinal[level];
    const blocks=teams.map(team=>`<section class="team"><h2>${team==='green'?'🟢 Equipo verde':'⚪ Equipo blanco'}</h2><div class="rows">${bank[level][team].map(q=>`<article><div class="letter">${escapeHTML(q.letter)}</div><div><small>${q.mode==='starts'?'EMPIEZA POR LA':'CONTIENE LA'} ${escapeHTML(q.letter)}</small><p>${escapeHTML(q.clue)}</p><strong>${escapeHTML(q.answer)}</strong><em>${escapeHTML(q.fact)}</em></div></article>`).join('')}</div></section>`).join('');
    const content=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(title)}</title><style>body{font:14px/1.45 system-ui,Arial,sans-serif;color:#1b4431;margin:25px auto;max-width:1050px;padding:0 20px}h1{color:#087846;margin-bottom:0}.intro{color:#52705c}.buttons{display:flex;justify-content:flex-end;gap:10px}button{padding:11px 17px;background:#12834e;color:white;border:0;border-radius:9px;cursor:pointer}.team{margin:28px 0}.team h2{background:#e1f2e5;padding:10px;border-radius:8px}.rows{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 20px}article{display:flex;gap:10px;border-bottom:1px solid #d8e6dc;padding:8px 0;break-inside:avoid}.letter{font-weight:900;background:#148449;color:white;border-radius:50%;width:28px;height:28px;min-width:28px;display:grid;place-items:center}small{font-weight:800;color:#247853;font-size:10px}article p{margin:3px 0}article strong{display:block}article em{display:block;color:#617869;font-size:11px;font-style:normal;margin-top:3px}@media print{@page{size:A4;margin:12mm}.buttons{display:none}.rows{grid-template-columns:1fr 1fr}body{padding:0;margin:0;font-size:11px}article{padding:5px 0}.team{break-before:auto}}</style></head><body><div class="buttons"><button onclick="window.print()">Imprimir / Guardar PDF</button></div><h1>${escapeHTML(title)}</h1><p class="intro">IES Sidón · Día de la Bandera de Andalucía · Solucionario personalizado para el profesorado</p>${blocks}</body></html>`;
    const popup=window.open('','_blank');
    if(!popup){notify('Permite las ventanas emergentes para ver el solucionario.');return;}
    popup.document.open();popup.document.write(content);popup.document.close();
  }
  function printTeacherGuide(){
    // Las instrucciones están dentro de la web: se abren en modo imprimible.
    const guide=document.querySelector('#teacherHelpDialog .dialog-body');
    const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Guía docente · Rosco 4D · IES Sidón</title><style>body{font:15px/1.55 system-ui,Arial;max-width:800px;margin:30px auto;padding:0 18px;color:#1b4431}h1{color:#077343}h2{font-size:19px}.teacher-help-lead{margin:16px 0;background:#eaf8eb;padding:13px}.teacher-help-lead span{display:block}.teacher-steps>div{display:flex;gap:15px;padding:11px 0;border-bottom:1px solid #dae7dd}.teacher-steps p{margin:0;flex:1}.step-num{font-weight:900;color:#05834a}.teacher-alert{border:2px solid #e1a13d;background:#fff9e6;border-radius:10px;padding:12px;margin:20px 0}.dialog-small{font-size:13px}@page{size:A4;margin:15mm}</style></head><body><h1>ROSCO 4D · Guía para el profesorado</h1><p>IES Sidón · Andalucía · Del ordenador de casa a la PDI</p>${guide.innerHTML}</body></html>`;
    const popup=window.open('','_blank');if(!popup){notify('Permite las ventanas emergentes para imprimir la guía.');return;}
    popup.document.open();popup.document.write(html);popup.document.close();popup.focus();popup.print();
  }

  function printAnswers(){if(window.ROSCO_STANDALONE){printStandaloneAnswers();return;}const level=game?.level??selectedLevel;const team=game?.mode==='duel'?'both':game?.soloBank??selectedSoloBank;window.open(`solucionario.html?curso=${encodeURIComponent(level)}&equipo=${encodeURIComponent(team)}`,'_blank','noopener');}
  function playAgain(){selectedLevel=String(game.level);selectedMode=game.mode;selectedSoloBank=game.soloBank;duration=game.duration;initGame();}

  function renderSound(){const btn=$('soundButton');btn.setAttribute('aria-pressed',String(!muted));btn.innerHTML=muted?'<svg><use href="#i-volume-off"/></svg>':'<svg><use href="#i-volume"/></svg>';btn.title=muted?'Activar sonido':'Desactivar sonido';}
  function sound(type){if(muted)return;try {const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;if(!audioContext)audioContext=new Context();if(audioContext.state==='suspended')audioContext.resume();const notes=type==='correct'?[520,740]:type==='wrong'?[240,185]:type==='finish'?[500,660,820]:[400];const now=audioContext.currentTime;notes.forEach((freq,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain(),start=now+i*.105; o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(.065,start+.012);g.gain.exponentialRampToValueAtTime(.0001,start+.115);o.connect(g);g.connect(audioContext.destination);o.start(start);o.stop(start+.13);});}catch{/* no molestar si el navegador no permite audio */}}
  async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{notify('Usa F11 para activar pantalla completa.');}}

  // Editor completo: 4 niveles × 2 equipos × 27 letras = 216 preguntas.
  function editorValues(){
    return {letter:$('editLetter').value,mode:$('editMode').value,clue:$('editClue').value.trim(),answer:$('editAnswer').value.trim(),
      aliases:$('editAliases').value.split(';').map(a=>a.trim()).filter(Boolean),fact:$('editFact').value.trim()};
  }
  function editorLocation(){return {level:$('editLevel').value,team:$('editTeam').value,letter:$('editLetter').value};}
  function editorChoose(l,t,letter){
    if(editorDirty && !window.confirm('Hay cambios sin guardar. ¿Quieres descartarlos?')){
      $('editLevel').value=editorSelection.level;$('editTeam').value=editorSelection.team;$('editLetter').value=editorSelection.letter;
      return;
    }
    $('editLevel').value=l;$('editTeam').value=t;$('editLetter').value=letter;
    loadEditor();
  }
  function setupEditor(){
    if(!$('editLetter').options.length)LETTERS.forEach(letter=>{const option=document.createElement('option');option.value=letter;option.textContent=letter;$('editLetter').append(option);});
    $('editLevel').value=selectedLevel;$('editTeam').value='green';$('editLetter').value='A';loadEditor();
  }
  function renderEditorLetters(){
    const {level,team,letter}=editorLocation();const container=$('editorAlphabet');container.replaceChildren();
    LETTERS.forEach((l,i)=>{
      const btn=document.createElement('button');btn.type='button';btn.className='editor-letter'+(l===letter?' selected':'');btn.textContent=l;
      btn.title=`Editar ${l} · Equipo ${team==='green'?'verde':'blanco'}`;btn.setAttribute('aria-pressed',String(l===letter));
      btn.addEventListener('click',()=>editorChoose(level,team,l));container.append(btn);
    });
    $('editorSummary').textContent=`${ordinal[level]} · 27 preguntas del equipo verde + 27 del blanco · 54 preguntas distintas`;
    $('editorTeamIndicator').textContent=`EQUIPO ${team==='green'?'VERDE':'BLANCO'}`;
    $('editorTeamIndicator').className='editor-team-indicator '+team;
  }
  function loadEditor(){
    const {level,team,letter}=editorLocation();
    const q=bank[level][team][LETTERS.indexOf(letter)];
    $('editMode').value=q.mode;$('editClue').value=q.clue;$('editAnswer').value=q.answer;
    $('editAliases').value=q.aliases.join('; ');$('editFact').value=q.fact;
    $('editorError').textContent='';editorDirty=false;editorSelection={level,team,letter};
    renderEditorLetters();renderEditorPreview();
  }
  function renderEditorPreview(){
    const q=editorValues();const rule=q.mode==='starts'?`EMPIEZA POR LA ${q.letter}`:`CONTIENE LA ${q.letter}`;
    $('editorPreview').textContent=`${rule} · ${q.clue||'Escribe la pregunta...'} · Solución: ${q.answer||'pendiente'}`;
    const valid=validEntry(q,q.letter);
    $('editorCheck').textContent=valid?'✓ La solución y las alternativas cumplen la pista':`⚠ Comprueba la solución y las alternativas: deben ${q.mode==='starts'?'empezar por':'contener'} «${q.letter}».`;
    $('editorCheck').className='editor-check '+(valid?'valid':'invalid');
  }
  function saveEditor(ev){
    ev.preventDefault();const {level,team,letter}=editorLocation(),idx=LETTERS.indexOf(letter);const item=editorValues();
    if(!validEntry(item,letter)){
      $('editorError').textContent=`La respuesta y TODAS sus alternativas deben ${item.mode==='starts'?'empezar por':'contener'} la letra ${letter} y tener al menos dos caracteres.`;return;
    }
    const opposite=team==='green'?'white':'green';
    if(bank[level][opposite].some(q=>norm(q.answer)===norm(item.answer))){
      $('editorError').textContent=`El equipo ${opposite==='green'?'verde':'blanco'} ya tiene esa respuesta en este nivel. Elige otra para que ambos roscos sean diferentes.`;return;
    }
    bank[level][team][idx]=item;
    safeWrite(KEYS.bank,bank);editorDirty=false;$('editorError').textContent='';
    notify(`Guardada la ${letter} de ${ordinal[level]} · Equipo ${team==='green'?'verde':'blanco'}.`);
    loadEditor();
  }
  function restoreQuestion(){
    const {level,team,letter}=editorLocation();
    ask('¿Restaurar esta pregunta?',`Se recuperará la pregunta original de la letra ${letter} para el equipo ${team==='green'?'verde':'blanco'}.`,()=>{
      bank[level][team][LETTERS.indexOf(letter)]=clone(BASE_BANK[level][team][LETTERS.indexOf(letter)]);
      safeWrite(KEYS.bank,bank);loadEditor();notify('Pregunta original restaurada.');
    });
  }
  function exportBank(){
    const file=new Blob([JSON.stringify(bank,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download='rosco-4d-ies-sidon-216-preguntas.json';
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Exportadas 216 preguntas de ambos equipos.');
  }
  async function importBank(event){
    const input=event.target;const file=input.files?.[0];if(!file)return;
    try{
      if(file.size>5_000_000)throw new Error('Archivo demasiado grande.');
      const data=JSON.parse(await file.text());let candidate=data?.courses??data;let legacy=false;
      if(validOldBank(candidate)){
        const upgraded=clone(bank);for(const lv of [1,2,3,4])upgraded[lv].green=clone(candidate[lv]);
        candidate=upgraded;legacy=true;
      }
      if(!validBank(candidate))throw new Error('El JSON debe contener 4 niveles × 2 equipos × 27 letras, con respuestas válidas y diferentes entre equipos.');
      if(editorDirty && !window.confirm('Se perderán los cambios sin guardar. ¿Importar igualmente?'))return;
      bank=clone(candidate);safeWrite(KEYS.bank,bank);loadEditor();
      notify(legacy?'Banco antiguo importado para el equipo verde. Se conserva el banco blanco.':'Importadas las 216 preguntas de los dos equipos.');
    }catch(err){$('editorError').textContent=`No se pudo importar: ${err.message}`;}
    finally{input.value='';}
  }
  function resetBank(){ask('¿Restaurar las 216 preguntas originales?',
    'Se eliminarán las modificaciones de los cuatro niveles y los dos equipos guardadas en este navegador.',()=>{
      bank=clone(BASE_BANK);safeWrite(KEYS.bank,bank);loadEditor();notify('Restaurados los 8 roscos originales.');
    });}
  function editorNavigate(dir){
    const {level,team,letter}=editorLocation();const idx=(LETTERS.indexOf(letter)+dir+27)%27;
    editorChoose(level,team,LETTERS[idx]);
  }

  // Eventos de interfaz.
  function listen(){document.querySelectorAll('.level-card').forEach(btn=>btn.addEventListener('click',()=>chooseLevel(btn.dataset.level)));document.querySelectorAll('#modeOptions button').forEach(btn=>btn.addEventListener('click',()=>chooseMode(btn.dataset.mode)));$('timeSelect').addEventListener('change',e=>{duration=Number(e.target.value);});$('soloBankSelect').addEventListener('change',e=>{selectedSoloBank=e.target.value;});$('startButton').addEventListener('click',fromNewGame);$('resumeButton').addEventListener('click',resume);$('discardButton').addEventListener('click',discard);$('helpButton').addEventListener('click',()=>openDialog('helpDialog'));$('teacherHelpButton').addEventListener('click',()=>openDialog('teacherHelpDialog'));$('editorGuideButton').addEventListener('click',()=>{closeDialog('editorDialog');openDialog('teacherHelpDialog');});$('printGuideButton').addEventListener('click',printTeacherGuide);$('downloadPortable').addEventListener('click',downloadPortable);$('editorButton').addEventListener('click',()=>{setupEditor();openDialog('editorDialog');});$('printButton').addEventListener('click',printAnswers);$('endAnswersButton').addEventListener('click',printAnswers);$('fullscreenButton').addEventListener('click',toggleFullscreen);$('soundButton').addEventListener('click',()=>{muted=!muted;safeWrite(KEYS.sound,!muted);renderSound();});$('correctButton').addEventListener('click',()=>mark('correct'));$('wrongButton').addEventListener('click',()=>mark('wrong'));$('passButton').addEventListener('click',pass);$('nextButton').addEventListener('click',next);$('checkInputButton').addEventListener('click',checkTyped);$('answerInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();checkTyped();}});$('answerInput').addEventListener('input',()=>{$('answerValidation').textContent='';$('answerValidation').classList.add('is-hidden');$('answerInput').removeAttribute('aria-invalid');$('correctButton').disabled=!!game?.paused || $('answerInput').value.trim().length>0;});$('revealButton').addEventListener('click',reveal);$('pauseButton').addEventListener('click',togglePause);$('backButton').addEventListener('click',backToSetup);$('restartButton').addEventListener('click',()=>ask('¿Reiniciar el rosco?','Se perderán los aciertos y fallos de esta partida.',()=>{selectedLevel=String(game.level);selectedMode=game.mode;selectedSoloBank=game.soloBank;duration=game.duration;initGame();}));$('playAgainButton').addEventListener('click',playAgain);$('changeLevelButton').addEventListener('click',()=>{game=null;showScreen('setup');updateResume();});$('editLevel').addEventListener('change',e=>editorChoose(e.target.value,editorSelection?.team??'green',editorSelection?.letter??'A'));
    $('editTeam').addEventListener('change',e=>editorChoose(editorSelection?.level??selectedLevel,e.target.value,editorSelection?.letter??'A'));
    $('editLetter').addEventListener('change',e=>editorChoose(editorSelection?.level??selectedLevel,editorSelection?.team??'green',e.target.value));
    ['editMode','editClue','editAnswer','editAliases','editFact'].forEach(id=>$(id).addEventListener('input',()=>{editorDirty=true;renderEditorPreview();}));
    $('editorPrevious').addEventListener('click',()=>editorNavigate(-1));
    $('editorNext').addEventListener('click',()=>editorNavigate(1));
    $('restoreQuestion').addEventListener('click',restoreQuestion);$('editorForm').addEventListener('submit',saveEditor);$('exportQuestions').addEventListener('click',exportBank);$('importQuestions').addEventListener('change',importBank);$('resetQuestions').addEventListener('click',resetBank);document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeDialog(btn.dataset.close)));$('confirmYes').addEventListener('click',()=>{closeDialog('confirmDialog');const callback=confirmCallback;confirmCallback=null;if(callback)callback();});document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();}));document.addEventListener('visibilitychange',()=>{if(document.hidden&&game&&game.phase==='running'&&!game.paused){game.paused=true;saveGame();renderTimer();renderQuestion();}});window.addEventListener('beforeunload',saveGame);}
  // SEGURIDAD DE EVALUACIÓN: sin atajos globales que puntúen al pulsar letras.
  // Solo se evalúa con «Comprobar»/Intro DENTRO de la casilla de respuesta
  // o con los botones explícitos de corrección del docente.
  function boot(){makePreview();initWheel();listen();renderSound();chooseMode(selectedMode);updateResume();showScreen('setup');}
  boot();
})();
