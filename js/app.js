/**
 * Sovereign of the Seas: Empire & Admiralty
 * Master Application Controller
 * Connects World Map Strategy, 3D Real-Time Battles, Royal Shipyards, Campaigns, and Audio
 * Author: Tareq Abuashi (أ. طارق ابوعشي)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Instantiate Engines
  const worldMapEngine = new WorldMapEngine('world-map-canvas');
  window.admiraltyWorldEngine = worldMapEngine;

  const naval3DEngine = new Naval3DEngine('naval-3d-viewport');
  window.admiraltyNaval3D = naval3DEngine;

  // 2. Setup Tab Navigation
  const tabButtons = document.querySelectorAll('.admiralty-tab-btn');
  const viewPanels = {
    'world-map': document.getElementById('view-world-map'),
    'naval-3d': document.getElementById('view-naval-3d'),
    'shipyard': document.getElementById('view-shipyard'),
    'campaigns': document.getElementById('view-campaigns')
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility
      Object.keys(viewPanels).forEach(key => {
        if (viewPanels[key]) {
          viewPanels[key].classList.toggle('active', key === targetTab);
        }
      });

      if (window.AdmiraltyAudio) window.AdmiraltyAudio.playShipBell();

      // View-specific initialization / resize triggers
      if (targetTab === 'world-map') {
        setTimeout(() => worldMapEngine.resizeCanvas(), 50);
      } else if (targetTab === 'naval-3d') {
        setTimeout(() => {
          naval3DEngine.onResize();
          if (!naval3DEngine.playerShip) {
            // Load default Trafalgar battle if none loaded yet
            naval3DEngine.loadMission('trafalgar1805');
          }
        }, 50);
      }
    });
  });

  // 3. Audio Toggle Button
  const btnSound = document.getElementById('btn-sound-toggle');
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      const enabled = window.AdmiraltyAudio.toggle();
      btnSound.textContent = enabled ? '🔊 الصوت: مفعّل' : '🔇 الصوت: صامت';
    });
  }

  // 4. Next Turn Button (الدورة الاستراتيجية التالية)
  const btnNextTurn = document.getElementById('btn-next-turn');
  if (btnNextTurn) {
    btnNextTurn.addEventListener('click', () => {
      const result = worldMapEngine.nextTurn();
      if (result.event) {
        showEventModal(result.event.titleAr, result.event.textAr);
      }
    });
  }

  // 5. Port Selected Callback from World Map
  window.onPortSelectedCallback = (port) => {
    const elTitle = document.getElementById('side-colony-title');
    const elOwner = document.getElementById('side-colony-owner');
    const elRegion = document.getElementById('side-colony-region');
    const elFort = document.getElementById('side-colony-fort');
    const elDock = document.getElementById('side-colony-dockyard');
    const elRev = document.getElementById('side-colony-revenue');
    const elProd = document.getElementById('side-colony-produces');
    const elDesc = document.getElementById('side-colony-desc');

    const ownerLabels = {
      britain: '🇬🇧 الإمبراطورية البريطانية',
      france: '⚜️ المملكة الفرنسية',
      spain: '🇪🇸 الإمبراطورية الإسبانية',
      pirates: '☠️ جمهورية القراصنة'
    };

    const ownerColors = {
      britain: '#8b0000',
      france: '#1a4b8c',
      spain: '#c48800',
      pirates: '#111111'
    };

    if (elTitle) elTitle.textContent = port.nameAr;
    if (elOwner) {
      elOwner.textContent = ownerLabels[port.owner] || port.owner;
      elOwner.style.background = ownerColors[port.owner] || '#333';
    }
    if (elRegion) elRegion.textContent = port.region;
    if (elFort) elFort.textContent = `مستوى التحصين: ${port.fortLevel} / 4`;
    if (elDock) elDock.textContent = `مستوى الترسانة: ${port.dockyardLevel} / 4`;
    if (elRev) elRev.textContent = `+${port.revenuePerTurn} غينيا`;
    if (elProd) {
      elProd.textContent = port.produces.length > 0 
        ? port.produces.map(p => window.AdmiraltyColoniesData.commodities[p] ? window.AdmiraltyColoniesData.commodities[p].nameAr : p).join(' • ')
        : 'واردات واستهلاك تجاري';
    }
    if (elDesc) elDesc.textContent = port.descAr;
  };

  // Upgrade Fort & Dockyard Handlers
  const btnUpFort = document.getElementById('btn-upgrade-fort');
  if (btnUpFort) {
    btnUpFort.addEventListener('click', () => {
      const port = worldMapEngine.selectedPort || worldMapEngine.ports[0];
      const res = worldMapEngine.upgradePort(port.id, 'fort');
      if (res.success) {
        window.onPortSelectedCallback(res.port);
        showEventModal('ترقية الحصن الساحلي بنجاح', `تم تعزيز دفاعات ميناء «${res.port.nameAr}» وتزويده بمدافع جديدة لصد هجمات أساطيل العدو.`);
      } else {
        showEventModal('تنبيه من الأميرالية', res.msg);
      }
    });
  }

  const btnUpDock = document.getElementById('btn-upgrade-dockyard');
  if (btnUpDock) {
    btnUpDock.addEventListener('click', () => {
      const port = worldMapEngine.selectedPort || worldMapEngine.ports[0];
      const res = worldMapEngine.upgradePort(port.id, 'dockyard');
      if (res.success) {
        window.onPortSelectedCallback(res.port);
        showEventModal('تطوير الترسانة الملكية', `تمت توسعة الأحواض الجافة في ميناء «${res.port.nameAr}» لتسريع بناء وإصلاح سفن خط المعركة.`);
      } else {
        showEventModal('تنبيه من الأميرالية', res.msg);
      }
    });
  }

  const btnDispatch = document.getElementById('btn-dispatch-convoy');
  if (btnDispatch) {
    btnDispatch.addEventListener('click', () => {
      worldMapEngine.playerGold += 400;
      worldMapEngine.playerPrestige += 20;
      worldMapEngine.updateHUD();
      showEventModal('تسيير قافلة تجارية محمية', 'أبحرت قافلة تجارية ترافقها فرقاطتان ملكيتان، ونجحت في جلب عائدات بقيمة +400 غينيا إلى الخزينة.');
    });
  }

  // 6. Connect 3D Naval Combat HUD Controls
  const btnFirePort = document.getElementById('btn-fire-port');
  const btnFireStbd = document.getElementById('btn-fire-starboard');
  const btnSteerL = document.getElementById('btn-steer-left');
  const btnSteerR = document.getElementById('btn-steer-right');
  const btnBoard = document.getElementById('btn-board-ship');

  if (btnFirePort) btnFirePort.addEventListener('click', () => naval3DEngine.fireBroadside('port'));
  if (btnFireStbd) btnFireStbd.addEventListener('click', () => naval3DEngine.fireBroadside('starboard'));
  if (btnSteerL) btnSteerL.addEventListener('click', () => naval3DEngine.steer(-0.18));
  if (btnSteerR) btnSteerR.addEventListener('click', () => naval3DEngine.steer(0.18));

  if (btnBoard) {
    btnBoard.addEventListener('click', () => {
      const result = naval3DEngine.attemptBoarding();
      if (result) {
        showEventModal('تقرير الاقتحام والالتحام', result.msg);
      }
    });
  }

  // Sail Step Buttons
  const sailBtns = document.querySelectorAll('.btn-sail-step');
  sailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sailBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const state = btn.getAttribute('data-sail');
      naval3DEngine.setSailState(state);
    });
  });

  // Ammo Selector Pills
  const ammoPills = document.querySelectorAll('.ammo-pill');
  ammoPills.forEach(pill => {
    pill.addEventListener('click', () => {
      ammoPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const ammo = pill.getAttribute('data-ammo');
      naval3DEngine.setAmmoType(ammo);
    });
  });

  // Camera Mode Buttons
  const camQuarter = document.getElementById('cam-quarterdeck');
  const camTac = document.getElementById('cam-tactical');
  const camBroad = document.getElementById('cam-broadside');

  if (camQuarter) camQuarter.addEventListener('click', () => naval3DEngine.setCameraMode('quarterdeck'));
  if (camTac) camTac.addEventListener('click', () => naval3DEngine.setCameraMode('tactical'));
  if (camBroad) camBroad.addEventListener('click', () => naval3DEngine.setCameraMode('broadside'));

  // Keyboard Hotkeys for Tactical Naval Combat
  window.addEventListener('keydown', (e) => {
    if (viewPanels['naval-3d'] && viewPanels['naval-3d'].classList.contains('active')) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        naval3DEngine.steer(-0.15);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        naval3DEngine.steer(0.15);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        naval3DEngine.setSailState('full');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        naval3DEngine.setSailState('furled');
      } else if (e.key === 'q' || e.key === 'Q') {
        naval3DEngine.fireBroadside('port');
      } else if (e.key === 'e' || e.key === 'E') {
        naval3DEngine.fireBroadside('starboard');
      } else if (e.key === ' ') {
        // Spacebar fires ready side
        naval3DEngine.fireBroadside('port');
        naval3DEngine.fireBroadside('starboard');
      }
    }
  });

  // 7. Render Royal Shipyard & Fleet Catalog
  renderShipyard();

  // 8. Render Admiralty Campaigns & Dispatches
  renderCampaigns();

  // 9. Battle Victory Callback
  window.onBattleWonCallback = (mission) => {
    const modal = document.getElementById('victory-modal');
    const title = document.getElementById('victory-modal-title');
    const body = document.getElementById('victory-modal-body');
    const rewards = document.getElementById('victory-modal-rewards');

    if (title) title.textContent = `نصر ساحق في ${mission.nameAr}!`;
    if (body) body.textContent = `تم كسر خط معركة أسطول العدو وإغراق وأسر سفنهم الحربية. كوفئ ضباط البحرية الملكية بترقيات ملكية وألقاب شرفية. ${mission.rewardTitleAr}`;
    if (rewards) rewards.textContent = `المكافأة الملكية: +${mission.rewardGuineas.toLocaleString()} غينيا ذهبية • +${mission.rewardPrestige} نقطة هيبة`;

    worldMapEngine.playerGold += mission.rewardGuineas;
    worldMapEngine.playerPrestige += mission.rewardPrestige;
    worldMapEngine.updateHUD();

    if (modal) modal.classList.add('open');
  };

  const btnCloseVic = document.getElementById('btn-close-victory');
  if (btnCloseVic) {
    btnCloseVic.addEventListener('click', () => {
      const modal = document.getElementById('victory-modal');
      if (modal) modal.classList.remove('open');
      // Return to World Map
      document.querySelector('[data-tab="world-map"]').click();
    });
  }

  const btnCloseEvent = document.getElementById('btn-close-event');
  if (btnCloseEvent) {
    btnCloseEvent.addEventListener('click', () => {
      const modal = document.getElementById('event-modal');
      if (modal) modal.classList.remove('open');
    });
  }

  function showEventModal(title, text) {
    const modal = document.getElementById('event-modal');
    const t = document.getElementById('event-modal-title');
    const b = document.getElementById('event-modal-body');
    if (t) t.textContent = title;
    if (b) b.textContent = text;
    if (modal) modal.classList.add('open');
  }

  // --- Sub-renderers ---
  function renderShipyard() {
    const container = document.getElementById('shipyard-cards-container');
    if (!container) return;

    const classes = window.AdmiraltyShipsData.classes;
    container.innerHTML = Object.keys(classes).map(k => {
      const s = classes[k];
      return `
        <div class="ship-class-card">
          <div>
            <div class="card-title-row">
              <span class="ship-card-name">${s.nameAr}</span>
              <span style="font-size:0.85rem; color:#ffd700;">${s.decks} طوابق مدافع</span>
            </div>
            <div style="font-size:0.9rem; color:#b0c5de; margin-bottom:10px;">${s.roleAr}</div>
            
            <div class="colony-stat-row">
              <span>قوة الهيكل:</span>
              <span class="colony-stat-val">${s.hullMax} نقطة</span>
            </div>
            <div class="colony-stat-row">
              <span>المدافع الجانبية:</span>
              <span class="colony-stat-val">${s.broadsideGunsPerSide * 2} مدفعاً</span>
            </div>
            <div class="colony-stat-row">
              <span>طاقم السفينة والمشاة:</span>
              <span class="colony-stat-val">${s.crewMax} بحار</span>
            </div>
            <div class="colony-stat-row">
              <span>السرعة القصوى:</span>
              <span class="colony-stat-val">${s.baseSpeedKnots} عقدة</span>
            </div>
            <div class="colony-stat-row">
              <span>المواد المطلوبة:</span>
              <span class="colony-stat-val">${s.timberRequired} طن بلوط</span>
            </div>
          </div>

          <div style="margin-top:16px;">
            <div style="font-size:1.1rem; font-weight:bold; color:#ffd700; margin-bottom:8px; text-align:center;">
              التكلفة: ${s.costGuineas.toLocaleString()} غينيا
            </div>
            <button class="btn-brass btn-build-ship" data-class="${s.id}" style="width:100%; justify-content:center;">
              <span>🔨 بناء السفينة وتدشينها</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind Build buttons
    container.querySelectorAll('.btn-build-ship').forEach(btn => {
      btn.addEventListener('click', () => {
        const cId = btn.getAttribute('data-class');
        const ship = classes[cId];
        if (worldMapEngine.playerGold >= ship.costGuineas && worldMapEngine.playerTimber >= ship.timberRequired) {
          worldMapEngine.playerGold -= ship.costGuineas;
          worldMapEngine.playerTimber -= ship.timberRequired;
          worldMapEngine.playerPrestige += 50;
          worldMapEngine.playerFleet.push({
            id: 'ship_' + Date.now(),
            name: `${ship.nameAr} الملكية`,
            classId: ship.id,
            hull: ship.hullMax,
            maxHull: ship.hullMax,
            crew: ship.crewMax,
            portId: 'portsmouth'
          });
          worldMapEngine.updateHUD();
          showEventModal('تدشين سفينة جديدة في الأسطول الملكي', `أبحرت سفينة جديدة من طراز «${ship.nameAr}» من أحواض بورتسموث وانضمت لأسطول جلالة الملك.`);
        } else {
          showEventModal('نقص الموارد في الترسانة', 'الذهب أو أخشاب البلوط غير كافية لإتمام بناء هذه السفينة.');
        }
      });
    });

    // Render Upgrades
    const upContainer = document.getElementById('upgrades-cards-container');
    if (upContainer) {
      upContainer.innerHTML = window.AdmiraltyShipsData.upgrades.map(u => `
        <div class="ship-class-card">
          <div>
            <div class="card-title-row">
              <span class="ship-card-name">${u.nameAr}</span>
              <span style="color:#ffd700;">⚙️</span>
            </div>
            <p style="font-size:0.9rem; line-height:1.5; color:#cbd5e1; margin-bottom:12px;">${u.descAr}</p>
          </div>
          <div>
            <div style="font-size:1.05rem; font-weight:bold; color:#ffd700; margin-bottom:8px; text-align:center;">
              السعر: ${u.costGuineas} غينيا
            </div>
            <button class="btn-brass btn-buy-upgrade" data-upgrade="${u.id}" style="width:100%; justify-content:center;">
              <span>تجهيز الترقية في الأسطول</span>
            </button>
          </div>
        </div>
      `).join('');

      upContainer.querySelectorAll('.btn-buy-upgrade').forEach(btn => {
        btn.addEventListener('click', () => {
          const uId = btn.getAttribute('data-upgrade');
          const up = window.AdmiraltyShipsData.upgrades.find(x => x.id === uId);
          if (worldMapEngine.playerGold >= up.costGuineas) {
            worldMapEngine.playerGold -= up.costGuineas;
            worldMapEngine.playerPrestige += 30;
            worldMapEngine.updateHUD();
            btn.disabled = true;
            btn.textContent = 'تم التجهيز والتعميم ✓';
            showEventModal('ترقية عتاد الأسطول الملكي', `تم تجهيز «${up.nameAr}» بنجاح على سفن الأسطول الملكي.`);
          } else {
            showEventModal('نقص الأموال', 'الخزينة الملكية لا تحتوي على ما يكفي لشراء هذه الترقية.');
          }
        });
      });
    }
  }

  function renderCampaigns() {
    const container = document.getElementById('campaigns-cards-container');
    if (!container) return;

    container.innerHTML = window.AdmiraltyMissionsData.campaigns.map(c => `
      <div class="campaign-card">
        <div>
          <div style="font-size:0.85rem; color:#ffd700; font-family:var(--font-title);">${c.year} م • ${c.theatreAr}</div>
          <h3 class="campaign-title">${c.nameAr}</h3>
          <p class="campaign-briefing">${c.briefingAr}</p>
          <div class="colony-stat-row">
            <span>سفينة القيادة:</span>
            <span class="colony-stat-val">${c.playerName}</span>
          </div>
          <div class="colony-stat-row">
            <span>سفن العدو:</span>
            <span class="colony-stat-val">${c.enemyFleet.length} سفن خط معركة</span>
          </div>
        </div>
        <div style="margin-top:16px;">
          <button class="btn-crimson btn-launch-campaign" data-campaign="${c.id}" style="width:100%; justify-content:center; padding:12px;">
            <span>⚔️ خوض المعركة ورفع راية القتال</span>
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-launch-campaign').forEach(btn => {
      btn.addEventListener('click', () => {
        const cId = btn.getAttribute('data-campaign');
        // Switch to 3D Battle tab
        document.querySelector('[data-tab="naval-3d"]').click();
        setTimeout(() => {
          naval3DEngine.loadMission(cId);
        }, 150);
      });
    });

    // Render Dispatches
    const dispContainer = document.getElementById('dispatches-cards-container');
    if (dispContainer) {
      dispContainer.innerHTML = window.AdmiraltyMissionsData.dispatches.map(d => `
        <div class="campaign-card" style="border-color:#1a4b8c;">
          <div>
            <div style="font-size:0.85rem; color:#9cb5d0;">${d.senderAr} • ${d.date}</div>
            <h3 class="campaign-title" style="color:#ffdf79;">${d.titleAr}</h3>
            <p class="campaign-briefing" style="font-style:italic;">${d.textAr}</p>
          </div>
          <div>
            <div style="color:#ffd700; font-weight:bold; margin-bottom:8px; text-align:center;">
              مكافأة الإنجاز: +${d.reward} غينيا
            </div>
            <button class="btn-brass" onclick="alert('تم تسيير فرقاطات الأسطول لتنفيذ الأمر!')" style="width:100%; justify-content:center;">
              <span>قبول أمر الأميرالية والتحرك ⚓</span>
            </button>
          </div>
        </div>
      `).join('');
    }
  }

});
