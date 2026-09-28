/**
 * Sovereign of the Seas: Empire & Admiralty
 * Master World Map & Grand Strategy Fleet Engine
 * Authentic 18th-Century Admiralty Sea Chart with Real Continental Geography (GeoJSON),
 * Coastal Waterlining, Active Fleets on the Prowl, Naval Blockades, and Interceptions
 * Author: Tareq Abuashi (أ. طارق ابوعشي)
 */

class WorldMapEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.ports = JSON.parse(JSON.stringify(window.AdmiraltyColoniesData.ports));
    this.squadrons = JSON.parse(JSON.stringify(window.AdmiraltyColoniesData.squadrons));
    this.tradeRoutes = JSON.parse(JSON.stringify(window.AdmiraltyColoniesData.tradeRoutes));
    
    // Selection & Interactivity
    this.selectedPort = null;
    this.selectedSquadron = null;
    this.hoveredPort = null;
    this.hoveredSquadron = null;
    
    // Pan & Zoom Camera Controls
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Simulation Clock & Resources
    this.turnNumber = 1;
    this.currentYear = 1776;
    this.playerGold = 4500;
    this.playerPrestige = 150;
    this.playerTimber = 320;
    this.playerRum = 180;
    this.timeCounter = 0;

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupEventListeners();
    this.startRenderLoop();
    this.updateHUD();

    // Default select first British port and Channel Fleet
    this.selectedPort = this.ports[0];
    this.selectedSquadron = this.squadrons[0];
    if (window.onPortSelectedCallback) window.onPortSelectedCallback(this.selectedPort);
    if (window.onSquadronSelectedCallback) window.onSquadronSelectedCallback(this.selectedSquadron);
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = (rect.height || 640) * dpr;
    this.ctx.scale(dpr, dpr);
    this.cssWidth = rect.width;
    this.cssHeight = rect.height || 640;
  }

  // Geographic Projection: [Longitude, Latitude] to Canvas [x, y] with Pan & Zoom
  project(lon, lat) {
    // Theater: Atlantic, Caribbean, Mediterranean, and Indian Ocean
    // Longitude span: -130° (Americas) to +110° (India/Bengal) -> total 240°
    // Latitude span: +65° (North Atlantic) to -45° (Cape of Good Hope) -> total 110°
    const normX = (lon - (-130)) / 240;
    const normY = (65 - lat) / 110;

    const baseW = this.cssWidth;
    const baseH = this.cssHeight;

    const x = (normX * baseW) * this.zoom + this.panX;
    const y = (normY * baseH) * this.zoom + this.panY;
    return { x, y };
  }

  // Inverse Projection: Canvas [x, y] to [Longitude, Latitude]
  unproject(x, y) {
    const normX = (x - this.panX) / (this.cssWidth * this.zoom);
    const normY = (y - this.panY) / (this.cssHeight * this.zoom);
    const lon = normX * 240 + (-130);
    const lat = 65 - (normY * 110);
    return { lon, lat };
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.panX = e.clientX - this.dragStartX;
        this.panY = e.clientY - this.dragStartY;
        // Bound panning
        const maxPanX = this.cssWidth * (this.zoom - 1) + 200;
        const maxPanY = this.cssHeight * (this.zoom - 1) + 150;
        this.panX = Math.max(-maxPanX, Math.min(200, this.panX));
        this.panY = Math.max(-maxPanY, Math.min(150, this.panY));
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check Hovered Squadron
      let foundSq = null;
      for (const sq of this.squadrons) {
        const pt = this.project(sq.lon, sq.lat);
        const d = Math.hypot(mouseX - pt.x, mouseY - pt.y);
        if (d < 22) {
          foundSq = sq;
          break;
        }
      }
      this.hoveredSquadron = foundSq;

      // Check Hovered Port
      let foundPort = null;
      if (!foundSq) {
        for (const p of this.ports) {
          const pt = this.project(p.lon, p.lat);
          const d = Math.hypot(mouseX - pt.x, mouseY - pt.y);
          if (d < 18) {
            foundPort = p;
            break;
          }
        }
      }
      this.hoveredPort = foundPort;

      this.canvas.style.cursor = (foundSq || foundPort) ? 'pointer' : (this.isDragging ? 'grabbing' : 'grab');
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const newZoom = Math.max(0.85, Math.min(3.5, this.zoom * zoomFactor));

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Zoom towards mouse pointer
      this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoom);
      this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoom);
      this.zoom = newZoom;
    }, { passive: false });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // 1. If clicked on a Squadron
      if (this.hoveredSquadron) {
        if (this.hoveredSquadron.faction === 'britain') {
          this.selectedSquadron = this.hoveredSquadron;
          if (window.onSquadronSelectedCallback) window.onSquadronSelectedCallback(this.selectedSquadron);
          if (window.AdmiraltyAudio) window.AdmiraltyAudio.playShipBell();
          return;
        } else if (this.selectedSquadron) {
          // Ordered selected British squadron to intercept this enemy squadron!
          this.orderSquadronToTarget(this.selectedSquadron, this.hoveredSquadron.lon, this.hoveredSquadron.lat, this.hoveredSquadron);
          return;
        }
      }

      // 2. If clicked on a Port
      if (this.hoveredPort) {
        this.selectedPort = this.hoveredPort;
        if (window.onPortSelectedCallback) window.onPortSelectedCallback(this.selectedPort);
        
        // If a British fleet is selected, offer to sail into port
        if (this.selectedSquadron) {
          this.orderSquadronToTarget(this.selectedSquadron, this.hoveredPort.lon, this.hoveredPort.lat, null, this.hoveredPort);
        }
        if (window.AdmiraltyAudio) window.AdmiraltyAudio.playShipBell();
        return;
      }

      // 3. Clicked open sea: If a fleet is selected, order it to sail here
      if (this.selectedSquadron) {
        const geo = this.unproject(mouseX, mouseY);
        this.orderSquadronToTarget(this.selectedSquadron, geo.lon, geo.lat);
        if (window.AdmiraltyAudio) window.AdmiraltyAudio.playWaterSplash();
      }
    });
  }

  orderSquadronToTarget(sq, targetLon, targetLat, targetSquadron = null, targetPort = null) {
    sq.targetLon = targetLon;
    sq.targetLat = targetLat;
    sq.targetSquadron = targetSquadron;
    sq.targetPort = targetPort;
    sq.state = 'sailing';

    if (window.onSquadronOrderGivenCallback) {
      window.onSquadronOrderGivenCallback(sq, targetSquadron, targetPort);
    }
  }

  startRenderLoop() {
    const loop = () => {
      this.timeCounter += 0.016;
      this.updateSquadronMovements(0.016);
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }

  // --- Real-Time Squadron Sailing Physics & Interceptions on Map ---
  updateSquadronMovements(delta) {
    for (const sq of this.squadrons) {
      if (sq.state === 'sailing' && sq.targetLon !== null && sq.targetLat !== null) {
        const dLon = sq.targetLon - sq.lon;
        const dLat = sq.targetLat - sq.lat;
        const dist = Math.hypot(dLon, dLat);

        if (dist < 0.6) {
          // Arrived at destination
          sq.lon = sq.targetLon;
          sq.lat = sq.targetLat;
          sq.targetLon = null;
          sq.targetLat = null;
          sq.state = sq.targetPort && sq.targetPort.owner !== 'britain' ? 'blockading' : 'patrolling';

          // Trigger Interception if arrived at an enemy fleet
          if (sq.targetSquadron && sq.faction === 'britain') {
            this.triggerBattleInterception(sq, sq.targetSquadron);
            sq.targetSquadron = null;
          }
        } else {
          // Move towards target
          const speed = 0.85 * delta; // Degrees per second
          sq.lon += (dLon / dist) * speed;
          sq.lat += (dLat / dist) * speed;
        }
      }

      // Check proximity interceptions between British and enemy fleets
      if (sq.faction === 'britain' && this.timeCounter > 3.0) {
        for (const enemySq of this.squadrons) {
          if (enemySq.faction !== 'britain') {
            const dist = Math.hypot(sq.lon - enemySq.lon, sq.lat - enemySq.lat);
            if (dist < 1.2 && !sq.isInBattle) {
              this.triggerBattleInterception(sq, enemySq);
              sq.isInBattle = true;
              break;
            }
          }
        }
      }
    }
  }

  triggerBattleInterception(playerSquadron, enemySquadron) {
    if (window.AdmiraltyAudio) {
      window.AdmiraltyAudio.playShipBell();
      window.AdmiraltyAudio.playBoardingHorn();
    }

    if (window.onFleetInterceptionCallback) {
      window.onFleetInterceptionCallback(playerSquadron, enemySquadron);
    }
  }

  // --- Rendering Loop for Museum-Grade Antique Chart ---
  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.cssWidth;
    const h = this.cssHeight;

    // 1. Aged Parchment Sea Background
    const seaGrad = ctx.createLinearGradient(0, 0, w, h);
    seaGrad.addColorStop(0, '#ebdcc0');
    seaGrad.addColorStop(0.5, '#e0cfad');
    seaGrad.addColorStop(1, '#d2c09c');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Graticules (Latitude & Longitude grid lines)
    this.drawGraticules(ctx, w, h);

    // 3. Antique Compass Roses & Rhumb Lines
    this.drawRhumbLines(ctx, w, h);

    // 4. Real Continental Geography from GeoJSON with Waterlining
    this.drawGeoJSONLandmasses(ctx);

    // 5. Historical Ocean & Sea Names (Engraved Roman style)
    this.drawOceanNames(ctx);

    // 6. Global Shipping Lanes
    this.drawTradeRoutes(ctx);

    // 7. Ports & Fortresses
    this.drawPorts(ctx);

    // 8. Active Fleets & Squadrons
    this.drawSquadrons(ctx);

    // 9. Ornate Decorative Cartouche & Border Frame
    this.drawChartCartouche(ctx, w, h);

    // 10. Map Navigation Controls (+ / - / Reset)
    this.drawZoomControls(ctx, w, h);
  }

  drawGraticules(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(150, 115, 75, 0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Longitude lines every 20 degrees
    for (let lon = -120; lon <= 100; lon += 20) {
      const p1 = this.project(lon, 65);
      const p2 = this.project(lon, -45);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Latitude lines every 15 degrees
    for (let lat = -30; lat <= 60; lat += 15) {
      const p1 = this.project(-130, lat);
      const p2 = this.project(110, lat);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawRhumbLines(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(130, 95, 55, 0.14)';
    ctx.lineWidth = 1;

    // Compass focal centers in Mid-Atlantic and Indian Ocean
    const centers = [
      this.project(-25, 25), // Mid Atlantic
      this.project(65, -5)   // Indian Ocean
    ];

    centers.forEach(c => {
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + Math.cos(angle) * 1400, c.y + Math.sin(angle) * 1400);
        ctx.stroke();
      }
    });

    ctx.restore();
  }

  // --- Real Continental Geography Renderer (GeoJSON Land with Coastal Waterlines) ---
  drawGeoJSONLandmasses(ctx) {
    if (!window.AdmiraltyWorldGeoJSON || !window.AdmiraltyWorldGeoJSON.features) return;
    const features = window.AdmiraltyWorldGeoJSON.features;

    ctx.save();

    // Pass 1: Coastal Waterline Ripples (3 concentric ripples around all continents)
    const rippleDistances = [6, 3];
    rippleDistances.forEach((dist, idx) => {
      ctx.strokeStyle = `rgba(145, 110, 65, ${0.12 + idx * 0.12})`;
      ctx.lineWidth = dist;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      features.forEach(f => {
        this.renderFeaturePath(ctx, f);
        ctx.stroke();
      });
    });

    // Pass 2: Main Landmass Fill (Aged Vellum with Dark Sepia Coastline)
    ctx.fillStyle = '#dbcca7';
    ctx.strokeStyle = '#5c4125';
    ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round';

    features.forEach(f => {
      ctx.beginPath();
      this.renderFeaturePath(ctx, f);
      ctx.fill();
      ctx.stroke();
    });

    ctx.restore();
  }

  renderFeaturePath(ctx, feature) {
    const geom = feature.geometry;
    if (geom.type === 'Polygon') {
      this.renderPolygon(ctx, geom.coordinates);
    } else if (geom.type === 'MultiPolygon') {
      geom.coordinates.forEach(poly => {
        this.renderPolygon(ctx, poly);
      });
    }
  }

  renderPolygon(ctx, rings) {
    rings.forEach(ring => {
      ctx.beginPath();
      ring.forEach((pt, i) => {
        const proj = this.project(pt[0], pt[1]);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      });
      ctx.closePath();
    });
  }

  drawOceanNames(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(90, 60, 30, 0.45)';
    ctx.font = 'italic bold 16px "Cinzel", "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';

    const oceanLabels = [
      { text: 'THE NORTH ATLANTIC OCEAN', lon: -35, lat: 38 },
      { text: 'MARE CARIBICUM • THE SPANISH MAIN', lon: -72, lat: 14 },
      { text: 'MEDITERRANEAN SEA', lon: 15, lat: 35 },
      { text: 'THE SOUTH ATLANTIC OCEAN', lon: -15, lat: -18 },
      { text: 'THE INDIAN OCEAN', lon: 75, lat: -10 }
    ];

    oceanLabels.forEach(lbl => {
      const p = this.project(lbl.lon, lbl.lat);
      ctx.fillText(lbl.text, p.x, p.y);
    });

    ctx.restore();
  }

  drawTradeRoutes(ctx) {
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;

    const portMap = {};
    this.ports.forEach(p => portMap[p.id] = p);

    this.tradeRoutes.forEach((route, idx) => {
      const p1 = portMap[route.startPort];
      const p2 = portMap[route.endPort];
      if (!p1 || !p2) return;

      const pt1 = this.project(p1.lon, p1.lat);
      const pt2 = this.project(p2.lon, p2.lat);

      const cx = (pt1.x + pt2.x) / 2 - 25;
      const cy = (pt1.y + pt2.y) / 2 - 35;

      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(180, 135, 45, 0.65)' : 'rgba(45, 95, 160, 0.6)';
      ctx.beginPath();
      ctx.moveTo(pt1.x, pt1.y);
      ctx.quadraticCurveTo(cx, cy, pt2.x, pt2.y);
      ctx.stroke();
    });

    ctx.restore();
  }

  drawPorts(ctx) {
    const portTheme = {
      britain: { color: '#8b0c16', border: '#ffd700', flag: '🇬🇧' },
      france: { color: '#1a4b8c', border: '#ffffff', flag: '⚜️' },
      spain: { color: '#b87700', border: '#8b0000', flag: '🇪🇸' },
      pirates: { color: '#111111', border: '#ff3333', flag: '☠️' }
    };

    this.ports.forEach(port => {
      const pt = this.project(port.lon, port.lat);
      const theme = portTheme[port.owner] || portTheme.britain;
      const isSelected = this.selectedPort && this.selectedPort.id === port.id;
      const isHovered = this.hoveredPort && this.hoveredPort.id === port.id;

      ctx.save();

      // Selection pulse ring
      if (isSelected || isHovered) {
        const pulse = 16 + Math.sin(this.timeCounter * 6) * 4;
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Stone Bastion Outer Ring
      ctx.fillStyle = theme.color;
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner Brass Pin
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Port Name Banner
      ctx.font = 'bold 11px "Cinzel", "Amiri", serif';
      ctx.fillStyle = '#1c1308';
      ctx.textAlign = 'center';
      ctx.fillText(port.nameAr.split(' ')[0], pt.x, pt.y + 18);

      // Flag Icon
      ctx.font = '11px serif';
      ctx.fillText(theme.flag, pt.x, pt.y - 11);

      ctx.restore();
    });
  }

  // --- Active Fleets & Squadrons Miniatures ---
  drawSquadrons(ctx) {
    this.squadrons.forEach(sq => {
      const pt = this.project(sq.lon, sq.lat);
      const isPlayer = sq.faction === 'britain';
      const isSelected = this.selectedSquadron && this.selectedSquadron.id === sq.id;
      const isHovered = this.hoveredSquadron && this.hoveredSquadron.id === sq.id;

      ctx.save();

      // Active Route Navigation Line to Target
      if (sq.targetLon !== null && sq.targetLat !== null) {
        const targetPt = this.project(sq.targetLon, sq.targetLat);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = isPlayer ? '#ffd700' : '#ff4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(targetPt.x, targetPt.y);
        ctx.stroke();

        // Destination Marker
        ctx.fillStyle = isPlayer ? '#ffd700' : '#ff4444';
        ctx.beginPath();
        ctx.arc(targetPt.x, targetPt.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Selected Fleet Golden Aura
      if (isSelected || isHovered) {
        const pulse = 22 + Math.sin(this.timeCounter * 5) * 4;
        ctx.strokeStyle = isPlayer ? '#ffd700' : '#ff4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Miniature Ship Wake in Water
      const wakeX = pt.x - 12;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(wakeX, pt.y, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fleet Token Background Badge
      ctx.fillStyle = isPlayer ? '#091c38' : (sq.faction === 'france' ? '#14386b' : (sq.faction === 'spain' ? '#8a1c1c' : '#111111'));
      ctx.strokeStyle = isPlayer ? '#ffd700' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(pt.x - 18, pt.y - 18, 36, 36, 6) : ctx.rect(pt.x - 18, pt.y - 18, 36, 36);
      ctx.fill();
      ctx.stroke();

      // Ship Icon
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sq.icon || '⛵', pt.x, pt.y);

      // Fleet Label Plate
      ctx.fillStyle = 'rgba(10, 20, 35, 0.92)';
      ctx.strokeStyle = isPlayer ? '#ffd700' : '#c0c0c0';
      ctx.lineWidth = 1;
      const labelW = 135;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(pt.x - labelW / 2, pt.y + 22, labelW, 20, 3) : ctx.rect(pt.x - labelW / 2, pt.y + 22, labelW, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isPlayer ? '#ffd700' : '#ffffff';
      ctx.font = 'bold 10px "Cinzel", "Amiri", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let shortName = sq.nameAr.replace(' الملكي', '').replace(' (Marine Royale)', '').replace(' (الأرمادا الذهبية)', '');
      if (shortName.length > 20) shortName = shortName.substring(0, 18) + '..';
      ctx.fillText(shortName + ' (' + sq.ships.length + ' سفن)', pt.x, pt.y + 32);

      // Blockade Banner if blockading
      if (sq.state === 'blockading') {
        ctx.fillStyle = '#ba1826';
        ctx.font = 'bold 9px "Amiri", serif';
        ctx.fillText('حصار بحري نيلسوني ⚔️', pt.x, pt.y - 24);
      }

      ctx.restore();
    });
  }

  drawChartCartouche(ctx, w, h) {
    ctx.save();
    // Top right ornate royal cartouche
    const cx = w - 240;
    const cy = 20;
    ctx.fillStyle = 'rgba(25, 17, 8, 0.92)';
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(cx, cy, 220, 85, 6) : ctx.rect(cx, cy, 220, 85);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 13px "Cinzel", "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.fillText('خريطة الأميرالية الملكية العالمية', cx + 110, cy + 24);

    ctx.fillStyle = '#e8d5b7';
    ctx.font = '11px "Amiri", serif';
    ctx.fillText(`السنة: ${this.currentYear} م • دورة الإبحار: ${this.turnNumber}`, cx + 110, cy + 44);
    ctx.fillText('انقر على أي أسطول ملكي لتوجيهه في المحيط', cx + 110, cy + 62);
    ctx.fillText('استخدم عجلة الفأرة للتقريب والتكبير 🔍', cx + 110, cy + 78);

    ctx.restore();
  }

  drawZoomControls(ctx, w, h) {
    ctx.save();
    // Bottom left zoom buttons
    const bx = 20;
    const by = h - 60;
    ctx.fillStyle = 'rgba(15, 25, 45, 0.85)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;

    // Reset button
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(bx, by, 90, 36, 4) : ctx.rect(bx, by, 90, 36);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`تكبير: ${(this.zoom * 100).toFixed(0)}%`, bx + 45, by + 18);

    ctx.restore();
  }

  // --- Strategic Turn Progression ---
  nextTurn() {
    this.turnNumber++;
    if (this.turnNumber % 4 === 0) {
      this.currentYear++;
    }

    // Port Revenues
    let portIncome = 0;
    this.ports.filter(p => p.owner === 'britain').forEach(p => {
      portIncome += p.revenuePerTurn;
    });

    // Blockade Prize Money
    let blockadeGain = 0;
    this.squadrons.filter(s => s.faction === 'britain' && s.state === 'blockading').forEach(s => {
      blockadeGain += 250;
    });

    const fleetUpkeep = this.squadrons.filter(s => s.faction === 'britain').length * 220;
    const netGain = portIncome + blockadeGain - fleetUpkeep;

    this.playerGold += netGain;
    this.playerPrestige += 20;
    this.playerTimber += 45;
    this.playerRum += 30;

    // AI Enemy Fleets Autonomous Maneuvers
    this.advanceEnemyAI();

    // Trigger Random Historical Event
    const event = this.triggerRandomEvent();

    if (window.AdmiraltyAudio) window.AdmiraltyAudio.playShipBell();
    this.updateHUD();

    return {
      turn: this.turnNumber,
      year: this.currentYear,
      income: portIncome + blockadeGain,
      upkeep: fleetUpkeep,
      net: netGain,
      event
    };
  }

  advanceEnemyAI() {
    // Spanish Silver Armada sails towards Europe
    const spanishArmada = this.squadrons.find(s => s.id === 'spanish_silver_armada');
    if (spanishArmada && spanishArmada.state === 'sailing') {
      spanishArmada.lon += 1.8;
      spanishArmada.lat += 0.6;
      if (spanishArmada.lon > -10) {
        spanishArmada.lon = -68.0;
        spanishArmada.lat = 26.0; // Reset loop
      }
    }

    // Pirate raiders roam the Caribbean
    const pirates = this.squadrons.find(s => s.id === 'caribbean_pirates');
    if (pirates) {
      pirates.lon += (Math.random() - 0.5) * 2.5;
      pirates.lat += (Math.random() - 0.5) * 1.5;
      pirates.lon = Math.max(-85, Math.min(-65, pirates.lon));
      pirates.lat = Math.max(15, Math.min(28, pirates.lat));
    }
  }

  triggerRandomEvent() {
    const events = [
      {
        titleAr: 'اعتراض سفينة إسبانية محملة بالذهب',
        textAr: 'أسرت دوريات الأسطول الملكي في خليج قادس سفينة شحن إسبانية واستولت على 600 غينيا كجوائز حرب للأميرالية.',
        goldBonus: 600
      },
      {
        titleAr: 'رياح مواتية في القناة الإنجليزية',
        textAr: 'هبت رياح غربية قوية مكّنت أسطول القناة من فرض حصار خانق على ميناء بريست الفرنسي. +30 نقطة هيبة.',
        goldBonus: 0
      },
      {
        titleAr: 'وصول أسطول التوابل من كلكتا وبومباي',
        textAr: 'رست 4 سفن تابعة لشركة الهند الشرقية في لندن محملة بآلاف الأطنان من الشاي والحرير. أرباح استثنائية: +750 غينيا.',
        goldBonus: 750
      },
      {
        titleAr: 'تمرد قراصنة في مضيق البهاماس',
        textAr: 'هاجم قراصنة ناسو سفينة تجارية بريطانية. أصدرت الأميرالية أوامر فورية لأسطول جزر الهند الغربية بالتحرك والقضاء عليهم.',
        goldBonus: 0
      }
    ];

    const ev = events[Math.floor(Math.random() * events.length)];
    if (ev.goldBonus) this.playerGold += ev.goldBonus;
    return ev;
  }

  upgradePort(portId, upgradeType) {
    const port = this.ports.find(p => p.id === portId);
    if (!port || port.owner !== 'britain') return { success: false, msg: 'لا يمكن ترقية ميناء غير خاضع للتاج البريطاني.' };

    const cost = upgradeType === 'fort' ? 500 : 700;
    if (this.playerGold < cost) return { success: false, msg: 'الخزينة الملكية لا تكفي لدفع تكلفة المشروع.' };

    if (upgradeType === 'fort') {
      if (port.fortLevel >= 4) return { success: false, msg: 'الحصن في أقصى مستوى تطويري (قلعة عظمى).' };
      port.fortLevel++;
      port.revenuePerTurn += 80;
    } else {
      if (port.dockyardLevel >= 4) return { success: false, msg: 'الترسانة في أقصى مستوى تطويري.' };
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
