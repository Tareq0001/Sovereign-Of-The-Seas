/**
 * Sovereign of the Seas: Empire & Admiralty
 * Master World Map & Colonial Administration Engine
 * Interactive 18th-Century Admiralty Nautical Chart, Trade Convoys, Colony Upgrades & Event Engine
 */

class WorldMapEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.ports = JSON.parse(JSON.stringify(window.AdmiraltyColoniesData.ports));
    this.tradeRoutes = JSON.parse(JSON.stringify(window.AdmiraltyColoniesData.tradeRoutes));
    this.activeConvoys = [];
    this.selectedPort = null;
    this.hoveredPort = null;
    this.turnNumber = 1;
    this.currentYear = 1776;
    this.playerGold = 4500;
    this.playerPrestige = 150;
    this.playerTimber = 320;
    this.playerRum = 180;
    this.playerSugar = 240;
    this.playerFleet = [
      { id: 'flagship', name: 'HMS Sovereign (74 Guns)', classId: 'thirdRate', hull: 2500, maxHull: 2500, crew: 650, portId: 'portsmouth' },
      { id: 'frigate1', name: 'HMS Nemesis (38 Guns)', classId: 'frigateFifthRate', hull: 1600, maxHull: 1600, crew: 340, portId: 'kingston' }
    ];
    this.animFrame = null;
    this.timeCounter = 0;
    this.scale = 1;

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupEventListeners();
    this.startRenderLoop();
    this.updateHUD();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = (rect.height || 620) * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    this.cssWidth = rect.width;
    this.cssHeight = rect.height || 620;
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));
    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredPort = null;
    });
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 600;
    return { x, y };
  }

  onMouseMove(e) {
    const pos = this.getPointerPos(e);
    let found = null;
    for (const port of this.ports) {
      const dx = pos.x - port.coords.x;
      const dy = pos.y - port.coords.y;
      if (Math.sqrt(dx * dx + dy * dy) < 22) {
        found = port;
        break;
      }
    }
    this.hoveredPort = found;
    this.canvas.style.cursor = found ? 'pointer' : 'default';
  }

  onClick(e) {
    if (this.hoveredPort) {
      this.selectPort(this.hoveredPort);
      if (window.AdmiraltyAudio) window.AdmiraltyAudio.playShipBell();
    }
  }

  selectPort(port) {
    this.selectedPort = port;
    if (window.onPortSelectedCallback) {
      window.onPortSelectedCallback(port);
    }
  }

  startRenderLoop() {
    const loop = () => {
      this.timeCounter += 0.016;
      this.render();
      this.animFrame = requestAnimationFrame(loop);
    };
    loop();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.cssWidth;
    const h = this.cssHeight;

    // Draw Ancient Nautical Parchment Sea Background
    const seaGrad = ctx.createLinearGradient(0, 0, w, h);
    seaGrad.addColorStop(0, '#e8dcbe');
    seaGrad.addColorStop(0.5, '#ded0af');
    seaGrad.addColorStop(1, '#cfc09c');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, w, h);

    // Vignette & Aged Map Edges
    const vigGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.7);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(60, 40, 20, 0.45)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

    // Nautical Grid & Rhumb Lines (خطوط البوصلة الملاحية العتيقة)
    this.drawNauticalRhumbLines(ctx, w, h);

    // Draw Stylized 18th Century Continents
    this.drawContinents(ctx, w, h);

    // Draw Trade Routes
    this.drawTradeRoutes(ctx, w, h);

    // Draw Ports & Fortresses
    this.drawPorts(ctx, w, h);

    // Draw Compass Rose
    this.drawCompassRose(ctx, 110, 110, 65);

    // Draw Title Cartouche
    this.drawCartouche(ctx, w - 210, 30);
  }

  drawNauticalRhumbLines(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(160, 130, 85, 0.25)';
    ctx.lineWidth = 1;

    // Center focal compass centers
    const centers = [
      { x: w * 0.3, y: h * 0.4 },
      { x: w * 0.7, y: h * 0.45 }
    ];

    centers.forEach(c => {
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + Math.cos(angle) * 900, c.y + Math.sin(angle) * 900);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  drawContinents(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = '#c7b28a';
    ctx.strokeStyle = '#8a6d48';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(70, 50, 25, 0.3)';
    ctx.shadowBlur = 6;

    // Function to map coordinates from 1000x600 space to canvas size
    const mx = (vx) => (vx / 1000) * w;
    const my = (vy) => (vy / 600) * h;

    // British Isles
    ctx.beginPath();
    ctx.ellipse(mx(490), my(145), mx(32), my(38), -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Western Europe (France, Spain)
    ctx.beginPath();
    ctx.moveTo(mx(450), my(175));
    ctx.lineTo(mx(520), my(170));
    ctx.lineTo(mx(540), my(230));
    ctx.lineTo(mx(460), my(250));
    ctx.lineTo(mx(440), my(210));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // North America East Coast
    ctx.beginPath();
    ctx.moveTo(mx(220), my(130));
    ctx.lineTo(mx(320), my(180));
    ctx.lineTo(mx(260), my(280));
    ctx.lineTo(mx(180), my(260));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Caribbean & Gulf
    ctx.beginPath();
    ctx.ellipse(mx(260), my(350), mx(75), my(45), 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // African Continent
    ctx.beginPath();
    ctx.moveTo(mx(460), my(265));
    ctx.lineTo(mx(570), my(270));
    ctx.lineTo(mx(590), my(420));
    ctx.lineTo(mx(550), my(530));
    ctx.lineTo(mx(510), my(480));
    ctx.lineTo(mx(460), my(360));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Indian Subcontinent
    ctx.beginPath();
    ctx.moveTo(mx(720), my(310));
    ctx.lineTo(mx(810), my(315));
    ctx.lineTo(mx(760), my(400));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawTradeRoutes(ctx, w, h) {
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2.5;

    const portMap = {};
    this.ports.forEach(p => portMap[p.id] = p);

    this.tradeRoutes.forEach((route, idx) => {
      const p1 = portMap[route.startPort];
      const p2 = portMap[route.endPort];
      if (!p1 || !p2) return;

      const x1 = (p1.coords.x / 1000) * w;
      const y1 = (p1.coords.y / 600) * h;
      const x2 = (p2.coords.x / 1000) * w;
      const y2 = (p2.coords.y / 600) * h;

      // Curved trade arc
      const cx = (x1 + x2) / 2 - 25;
      const cy = (y1 + y2) / 2 - 40;

      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(180, 130, 40, 0.7)' : 'rgba(40, 90, 160, 0.65)';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cx, cy, x2, y2);
      ctx.stroke();

      // Moving trade ship indicator
      const progress = (this.timeCounter * 0.15 + idx * 0.3) % 1;
      const shipT = progress;
      const sx = (1 - shipT) * (1 - shipT) * x1 + 2 * (1 - shipT) * shipT * cx + shipT * shipT * x2;
      const sy = (1 - shipT) * (1 - shipT) * y1 + 2 * (1 - shipT) * shipT * cy + shipT * shipT * y2;

      ctx.fillStyle = '#1c1308';
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Ship sail icon
      ctx.fillStyle = '#fff';
      ctx.font = '10px serif';
      ctx.fillText('⛵', sx - 6, sy - 6);
    });

    ctx.restore();
  }

  drawPorts(ctx, w, h) {
    const portMap = {
      britain: { color: '#b22222', stroke: '#ffd700', label: '🇬🇧' },
      france: { color: '#1a4b8c', stroke: '#ffffff', label: '⚜️' },
      spain: { color: '#d48800', stroke: '#8b0000', label: '🇪🇸' },
      pirates: { color: '#111111', stroke: '#ff3333', label: '☠️' }
    };

    this.ports.forEach(port => {
      const px = (port.coords.x / 1000) * w;
      const py = (port.coords.y / 600) * h;
      const style = portMap[port.owner] || portMap.britain;
      const isSelected = this.selectedPort && this.selectedPort.id === port.id;
      const isHovered = this.hoveredPort && this.hoveredPort.id === port.id;

      ctx.save();

      // Pulse ring if selected or hovered
      if (isSelected || isHovered) {
        const pulse = 18 + Math.sin(this.timeCounter * 6) * 4;
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(px, py, pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Outer fortification ring
      ctx.fillStyle = style.color;
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner pin
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Port Name Label in antique serif font
      ctx.font = 'bold 11px "Cinzel", "Amiri", serif';
      ctx.fillStyle = '#1c1308';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.fillText(port.nameAr.split(' ')[0], px, py + 22);

      // Port Faction Flag Icon
      ctx.font = '12px serif';
      ctx.fillText(style.label, px, py - 14);

      ctx.restore();
    });
  }

  drawCompassRose(ctx, cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);

    ctx.strokeStyle = '#5a3d1b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
    ctx.stroke();

    // 8 Points of the Compass Rose
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = i % 2 === 0 ? '#8b0000' : '#d4af37';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-6, -radius * 0.4);
      ctx.lineTo(0, -radius * 0.95);
      ctx.lineTo(6, -radius * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = '#1a1005';
    ctx.font = 'bold 14px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -radius - 8);

    ctx.restore();
  }

  drawCartouche(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = 'rgba(30, 20, 10, 0.85)';
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, 190, 75, 4) : ctx.rect(x, y, 190, 75);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 13px "Cinzel", "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.fillText('خريطة الأميرالية الملكية', x + 95, y + 26);

    ctx.fillStyle = '#e5d3b3';
    ctx.font = '11px "Amiri", serif';
    ctx.fillText(`السنة: ${this.currentYear} م • الدورة ${this.turnNumber}`, x + 95, y + 46);
    ctx.fillText('العالم الأطلسي وبحار الهند', x + 95, y + 62);
    ctx.restore();
  }

  // Next Strategic Cycle (تقدم الدورة الاستراتيجية وحساب العوائد والأحداث)
  nextTurn() {
    this.turnNumber++;
    if (this.turnNumber % 4 === 0) {
      this.currentYear++;
    }

    // Calculate revenue from British ports
    let turnIncome = 0;
    this.ports.filter(p => p.owner === 'britain').forEach(p => {
      turnIncome += p.revenuePerTurn;
    });

    // Add trade route profits
    const tradeIncome = 650;
    const fleetUpkeep = this.playerFleet.length * 180;
    const netGain = turnIncome + tradeIncome - fleetUpkeep;

    this.playerGold += netGain;
    this.playerPrestige += 15;
    this.playerTimber += 40;
    this.playerRum += 25;

    // Trigger random naval event
    const event = this.triggerRandomEvent();

    if (window.AdmiraltyAudio) {
      window.AdmiraltyAudio.playShipBell();
    }

    this.updateHUD();
    return {
      turn: this.turnNumber,
      year: this.currentYear,
      income: turnIncome,
      trade: tradeIncome,
      upkeep: fleetUpkeep,
      net: netGain,
      event
    };
  }

  triggerRandomEvent() {
    const events = [
      {
        titleAr: 'وصول أسطول السكر من جامايكا بسلام',
        textAr: 'وصلت قوافل جزر الهند الغربية إلى أرصفة بورتسموث محملة بـ 500 برميل سكر وروم ممتاز. مكافأة: +450 غينيا.',
        goldBonus: 450
      },
      {
        titleAr: 'تحركات استخباراتية: خروج الأسطول الفرنسي من بريست!',
        textAr: 'أفادت فرقاطات الاستطلاع بمغادرة 6 سفن خط معركة فرنسية نحو الأطلسي. الأميرالية تعلن حالة التأهب القصوى.',
        goldBonus: 0
      },
      {
        titleAr: 'اعتراض سفينة قرصنة قبالة البهاماس',
        textAr: 'نجحت الفرقاطة الملكية في أسر بريغ قرصان واسترداد 300 غينيا ذهبية كجوائز بحرية (Prize Money).',
        goldBonus: 300
      },
      {
        titleAr: 'توريد أخشاب البلوط الملكي من نوفا سكوشا',
        textAr: 'رست سفن الشحن من هاليفاكس محملة بأضخم صواري الصنوبر والبلوط لإصلاح السفن المتضررة.',
        goldBonus: 100
      }
    ];

    const ev = events[Math.floor(Math.random() * events.length)];
    if (ev.goldBonus) this.playerGold += ev.goldBonus;
    return ev;
  }

  upgradePort(portId, upgradeType) {
    const port = this.ports.find(p => p.id === portId);
    if (!port || port.owner !== 'britain') return { success: false, msg: 'لا يمكن ترقية ميناء غير بريطاني' };

    const cost = upgradeType === 'fort' ? 500 : 700;
    if (this.playerGold < cost) return { success: false, msg: 'الذهب غير كافٍ في الخزينة' };

    if (upgradeType === 'fort') {
      if (port.fortLevel >= 4) return { success: false, msg: 'الحصن في أقصى مستوى تطوير' };
      port.fortLevel++;
      port.revenuePerTurn += 80;
    } else {
      if (port.dockyardLevel >= 4) return { success: false, msg: 'الترسانة في أقصى مستوى تطوير' };
      port.dockyardLevel++;
      port.revenuePerTurn += 120;
    }

    this.playerGold -= cost;
    this.updateHUD();
    return { success: true, port };
  }

  updateHUD() {
    const elGold = document.getElementById('hud-player-gold');
    const elPrestige = document.getElementById('hud-player-prestige');
    const elTimber = document.getElementById('hud-player-timber');
    const elRum = document.getElementById('hud-player-rum');
    const elTurn = document.getElementById('hud-turn-counter');
    const elYear = document.getElementById('hud-year-counter');

    if (elGold) elGold.textContent = `${this.playerGold.toLocaleString()} غينيا`;
    if (elPrestige) elPrestige.textContent = `${this.playerPrestige} هيبة`;
    if (elTimber) elTimber.textContent = `${this.playerTimber} طن`;
    if (elRum) elRum.textContent = `${this.playerRum} برميل`;
    if (elTurn) elTurn.textContent = `الدورة: ${this.turnNumber}`;
    if (elYear) elYear.textContent = `${this.currentYear} م`;
  }
}

window.WorldMapEngine = WorldMapEngine;
