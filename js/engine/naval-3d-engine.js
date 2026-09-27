/**
 * Sovereign of the Seas: Empire & Admiralty
 * Master 3D Naval Warfare Simulator Engine
 * Powered by Three.js
 * 3D Ocean Waves, Procedural Warships of the Line, Wind Aerodynamics,
 * Ballistic Broadsides, Black Powder Smoke Particles, and Boarding Actions
 */

class Naval3DEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.waterMesh = null;
    this.clock = new THREE.Clock();

    // Weather & Ocean Conditions
    this.wind = {
      angle: (280 * Math.PI) / 180, // Radians
      speedKnots: 16
    };

    // Fleet Entities
    this.playerShip = null;
    this.enemyShips = [];
    this.cannonballs = [];
    this.particles = [];
    this.waterSplashes = [];

    // Firing Arcs Visuals
    this.portArcMesh = null;
    this.starboardArcMesh = null;

    // Camera Modes: 'quarterdeck', 'tactical', 'broadside'
    this.cameraMode = 'quarterdeck';

    // Combat State
    this.ammoType = 'round'; // 'round', 'chain', 'grape'
    this.isBoarding = false;
    this.activeMission = null;

    this.init();
  }

  init() {
    if (!this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 650;

    // 1. Three.js Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xb5cde6, 0.0018);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(55, width / height, 1, 4000);
    this.camera.position.set(0, 45, 120);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls (for free tactical inspection)
    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't dip below water
      this.controls.minDistance = 25;
      this.controls.maxDistance = 500;
    }

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Realistic 3D Ocean Surface
    this.createOcean();

    // 7. Skybox / Atmosphere
    this.createSkyDome();

    // 8. Event Listeners
    window.addEventListener('resize', () => this.onResize());

    // 9. Start Render & Physics Loop
    this.animate();
  }

  setupLighting() {
    // Ambient Light with nautical maritime tint
    const ambient = new THREE.AmbientLight(0xdbe9f4, 0.7);
    this.scene.add(ambient);

    // Sunlight
    this.sunLight = new THREE.DirectionalLight(0xfff3db, 1.4);
    this.sunLight.position.set(250, 400, 200);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 50;
    this.sunLight.shadow.camera.far = 1000;
    const d = 350;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);
  }

  createSkyDome() {
    const skyGeo = new THREE.SphereGeometry(2500, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x93b7d8,
      side: THREE.BackSide
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(skyDome);
  }

  createOcean() {
    const oceanGeo = new THREE.PlaneGeometry(3500, 3500, 120, 120);
    oceanGeo.rotateX(-Math.PI / 2);

    // Custom water material with specular sun reflections and deep cyan undertone
    this.oceanMat = new THREE.MeshStandardMaterial({
      color: 0x114263,
      roughness: 0.18,
      metalness: 0.85,
      flatShading: true
    });

    this.waterMesh = new THREE.Mesh(oceanGeo, this.oceanMat);
    this.waterMesh.receiveShadow = true;
    this.scene.add(this.waterMesh);

    // Save initial vertices for procedural wave animation
    const pos = oceanGeo.attributes.position;
    this.initialWaterVertices = [];
    for (let i = 0; i < pos.count; i++) {
      this.initialWaterVertices.push(pos.getY(i));
    }
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 650;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // --- Procedural 3D Warship Builder ---
  createShipModel(config = {}) {
    const group = new THREE.Group();

    const isFirstRate = config.classId === 'firstRate';
    const isThirdRate = config.classId === 'thirdRate';
    const isFrigate = config.classId === 'frigateFifthRate';

    const length = isFirstRate ? 48 : (isThirdRate ? 40 : 32);
    const beam = isFirstRate ? 14 : (isThirdRate ? 11 : 9);
    const height = isFirstRate ? 12 : (isThirdRate ? 10 : 7);

    // Color theme
    let hullWoodColor = 0x22180e;
    let stripeColor = 0xe0a838; // Royal Navy "Nelson Chequer" yellow ochre
    if (config.faction === 'france') {
      hullWoodColor = 0x1c1a24;
      stripeColor = 0x255b9e;
    } else if (config.faction === 'spain') {
      hullWoodColor = 0x261414;
      stripeColor = 0xb82828;
    } else if (config.faction === 'pirates') {
      hullWoodColor = 0x111111;
      stripeColor = 0x333333;
    }

    const hullMat = new THREE.MeshStandardMaterial({
      color: hullWoodColor,
      roughness: 0.75,
      metalness: 0.1
    });

    const stripeMat = new THREE.MeshStandardMaterial({
      color: stripeColor,
      roughness: 0.6,
      metalness: 0.15
    });

    const copperBottomMat = new THREE.MeshStandardMaterial({
      color: 0x935b34, // Tarnished copper
      roughness: 0.45,
      metalness: 0.55
    });

    // 1. Lower Keel & Copper Sheathing
    const keelGeo = new THREE.BoxGeometry(beam * 0.9, height * 0.4, length);
    const keelMesh = new THREE.Mesh(keelGeo, copperBottomMat);
    keelMesh.position.y = -height * 0.15;
    group.add(keelMesh);

    // 2. Main Wooden Hull Deck Block
    const hullGeo = new THREE.BoxGeometry(beam, height * 0.6, length * 0.95);
    const hullMesh = new THREE.Mesh(hullGeo, hullMat);
    hullMesh.position.y = height * 0.25;
    hullMesh.castShadow = true;
    hullMesh.receiveShadow = true;
    group.add(hullMesh);

    // 3. Gun Deck Nelson Chequer Stripe
    const stripeGeo = new THREE.BoxGeometry(beam * 1.02, height * 0.22, length * 0.94);
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.position.y = height * 0.3;
    group.add(stripeMesh);

    // 4. Pointed Bow (Front of Ship) & Bowsprit
    const bowGeo = new THREE.ConeGeometry(beam * 0.6, length * 0.35, 4);
    bowGeo.rotateX(Math.PI / 2);
    bowGeo.rotateZ(Math.PI / 4);
    const bowMesh = new THREE.Mesh(bowGeo, hullMat);
    bowMesh.position.set(0, height * 0.2, length * 0.55);
    group.add(bowMesh);

    // Bowsprit Spar
    const sparGeo = new THREE.CylinderGeometry(0.4, 0.7, length * 0.45, 8);
    sparGeo.rotateX(Math.PI / 3);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5a3d1c, roughness: 0.8 });
    const sparMesh = new THREE.Mesh(sparGeo, woodMat);
    sparMesh.position.set(0, height * 0.5, length * 0.62);
    group.add(sparMesh);

    // 5. Stern Castle & Admiral's Gallery (Rear)
    const sternGeo = new THREE.BoxGeometry(beam * 0.95, height * 0.7, length * 0.2);
    const sternMesh = new THREE.Mesh(sternGeo, hullMat);
    sternMesh.position.set(0, height * 0.55, -length * 0.42);
    group.add(sternMesh);

    // 6. Cannons protruding from gunports
    const cannonMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.3 });
    const gunCountPerSide = isFirstRate ? 12 : (isThirdRate ? 8 : 5);
    for (let i = 0; i < gunCountPerSide; i++) {
      const zPos = -length * 0.32 + (i / gunCountPerSide) * length * 0.7;
      // Port cannon (Left)
      const portGun = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 2.2, 6), cannonMat);
      portGun.rotateZ(Math.PI / 2);
      portGun.position.set(-beam * 0.52, height * 0.3, zPos);
      group.add(portGun);

      // Starboard cannon (Right)
      const stbdGun = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 2.2, 6), cannonMat);
      stbdGun.rotateZ(-Math.PI / 2);
      stbdGun.position.set(beam * 0.52, height * 0.3, zPos);
      group.add(stbdGun);
    }

    // 7. Three Full Ship Masts with Yards and Billowing White Sails
    const mastPositions = [
      { z: length * 0.24, scale: 0.9 },   // Foremast
      { z: -length * 0.05, scale: 1.1 },  // Mainmast
      { z: -length * 0.3, scale: 0.8 }    // Mizzenmast
    ];

    const sailMat = new THREE.MeshStandardMaterial({
      color: 0xf4eedb, // Natural hemp canvas
      roughness: 0.9,
      side: THREE.DoubleSide
    });

    mastPositions.forEach(mast => {
      const mastHeight = height * 3.8 * mast.scale;
      const mastGeo = new THREE.CylinderGeometry(0.45, 0.7, mastHeight, 8);
      const mastMesh = new THREE.Mesh(mastGeo, woodMat);
      mastMesh.position.set(0, mastHeight / 2 + height * 0.3, mast.z);
      mastMesh.castShadow = true;
      group.add(mastMesh);

      // 3 Tiers of Sails on each mast (Courses, Topsails, Topgallants)
      const tiers = [0.35, 0.65, 0.88];
      tiers.forEach(tierH => {
        const yardW = beam * 1.5 * mast.scale * (1.1 - tierH * 0.3);
        const yardGeo = new THREE.CylinderGeometry(0.25, 0.25, yardW, 6);
        yardGeo.rotateZ(Math.PI / 2);
        const yardMesh = new THREE.Mesh(yardGeo, woodMat);
        yardMesh.position.set(0, mastHeight * tierH + height * 0.3, mast.z);
        group.add(yardMesh);

        // Curved Billowing Sail
        const sailGeo = new THREE.PlaneGeometry(yardW * 0.95, height * 0.95 * mast.scale, 8, 4);
        // Curve sail forward to mimic wind pressure
        const posAttr = sailGeo.attributes.position;
        for (let j = 0; j < posAttr.count; j++) {
          const zOffset = Math.sin((posAttr.getY(j) / (height * 0.95)) * Math.PI) * 2.2;
          posAttr.setZ(j, zOffset);
        }
        sailGeo.computeVertexNormals();

        const sailMesh = new THREE.Mesh(sailGeo, sailMat);
        sailMesh.position.set(0, mastHeight * tierH + height * 0.3 - height * 0.45, mast.z);
        sailMesh.castShadow = true;
        group.add(sailMesh);
      });
    });

    // 8. Royal Flag / Ensign at the Stern Peak
    const flagGeo = new THREE.PlaneGeometry(6.5, 4.0, 6, 2);
    let flagColor = 0xffffff;
    if (config.faction === 'france') flagColor = 0x1d4e89;
    if (config.faction === 'spain') flagColor = 0xc43232;
    if (config.faction === 'pirates') flagColor = 0x111111;

    const flagMat = new THREE.MeshStandardMaterial({
      color: flagColor,
      roughness: 0.8,
      side: THREE.DoubleSide
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(0, height * 2.8, -length * 0.38);
    flagMesh.rotateY(Math.PI / 2);
    group.add(flagMesh);

    // Attach Entity Physics & Stats
    group.userData = {
      isPlayer: !!config.isPlayer,
      name: config.name || 'HMS Sovereign',
      classId: config.classId || 'thirdRate',
      faction: config.faction || 'britain',
      maxHull: config.hull || 2500,
      hull: config.hull || 2500,
      maxRigging: config.rigging || 1600,
      rigging: config.rigging || 1600,
      crew: config.crew || 650,
      morale: 100,
      speedKnots: 0,
      targetSpeed: 0,
      sailState: 'battle', // 'furled', 'battle', 'full'
      rudderAngle: 0,
      turnVelocity: 0,
      reloadPortTimer: 0,
      reloadStarboardTimer: 0,
      reloadMaxTime: config.reloadTime || 6.5,
      isSunk: false,
      flagMesh: flagMesh
    };

    return group;
  }

  // --- Start Tactical Battle Scenario ---
  loadMission(missionId) {
    this.activeMission = window.AdmiraltyMissionsData.campaigns.find(c => c.id === missionId) || window.AdmiraltyMissionsData.campaigns[0];

    // Clear prior battle entities
    if (this.playerShip) this.scene.remove(this.playerShip);
    this.enemyShips.forEach(e => this.scene.remove(e));
    this.enemyShips = [];

    // Set Wind & Weather
    this.wind.angle = (this.activeMission.windDirection * Math.PI) / 180;
    this.wind.speedKnots = this.activeMission.windSpeedKnots;

    // Build Player Ship
    const pClass = window.AdmiraltyShipsData.classes[this.activeMission.playerShipClass];
    this.playerShip = this.createShipModel({
      isPlayer: true,
      name: this.activeMission.playerName,
      classId: this.activeMission.playerShipClass,
      faction: 'britain',
      hull: pClass ? pClass.hullMax : 2500,
      rigging: pClass ? pClass.riggingMax : 1600,
      crew: pClass ? pClass.crewMax : 650,
      reloadTime: pClass ? pClass.reloadTimeSeconds : 6.5
    });
    this.playerShip.position.set(0, 0, 0);
    this.scene.add(this.playerShip);

    // Build Enemy Fleet
    this.activeMission.enemyFleet.forEach(ef => {
      const eShip = this.createShipModel({
        isPlayer: false,
        name: ef.name,
        classId: ef.shipClass,
        faction: ef.faction,
        hull: ef.hull,
        crew: ef.crew,
        reloadTime: 7.5
      });
      eShip.position.set(ef.position.x, 0, ef.position.z);
      eShip.rotation.y = Math.PI + (Math.random() * 0.4 - 0.2);
      this.enemyShips.push(eShip);
      this.scene.add(eShip);
    });

    if (window.AdmiraltyAudio) {
      window.AdmiraltyAudio.playShipBell();
      window.AdmiraltyAudio.startAmbientSea();
    }

    this.updateBattleHUD();
  }

  // --- Tactical Controls for Player ---
  setSailState(state) {
    if (!this.playerShip || this.playerShip.userData.isSunk) return;
    this.playerShip.userData.sailState = state;
    if (window.AdmiraltyAudio) window.AdmiraltyAudio.playShipBell();
    this.updateBattleHUD();
  }

  steer(deltaRudder) {
    if (!this.playerShip || this.playerShip.userData.isSunk) return;
    this.playerShip.userData.rudderAngle = Math.max(-0.45, Math.min(0.45, this.playerShip.userData.rudderAngle + deltaRudder));
  }

  setAmmoType(type) {
    this.ammoType = type;
    this.updateBattleHUD();
  }

  // --- Fire Broadside Artillery (إطلاق نيران المدافع الجانبية) ---
  fireBroadside(side = 'port') {
    if (!this.playerShip || this.playerShip.userData.isSunk) return;
    const u = this.playerShip.userData;

    if (side === 'port' && u.reloadPortTimer > 0) return;
    if (side === 'starboard' && u.reloadStarboardTimer > 0) return;

    if (side === 'port') u.reloadPortTimer = u.reloadMaxTime;
    if (side === 'starboard') u.reloadStarboardTimer = u.reloadMaxTime;

    // Ship position & heading
    const pPos = this.playerShip.position.clone();
    const heading = this.playerShip.rotation.y;
    const fireDirAngle = side === 'port' ? (heading + Math.PI / 2) : (heading - Math.PI / 2);

    const gunCount = u.classId === 'firstRate' ? 12 : (u.classId === 'thirdRate' ? 8 : 5);

    // Audio & Black Powder Smoke
    if (window.AdmiraltyAudio) {
      window.AdmiraltyAudio.playBroadside(gunCount, 1.0);
    }

    // Spawn Cannonballs & Smoke Puffs
    for (let i = 0; i < gunCount; i++) {
      const zOffset = (i - gunCount / 2) * 2.8;
      const origin = pPos.clone();
      origin.x += Math.cos(fireDirAngle) * 8 + Math.sin(heading) * zOffset;
      origin.z += -Math.sin(fireDirAngle) * 8 + Math.cos(heading) * zOffset;
      origin.y = 4.5;

      const spread = (Math.random() - 0.5) * 0.08;
      const trajectoryAngle = fireDirAngle + spread;
      const speed = 110 + Math.random() * 20;

      const ballVelocity = new THREE.Vector3(
        Math.cos(trajectoryAngle) * speed,
        8 + Math.random() * 4,
        -Math.sin(trajectoryAngle) * speed
      );

      this.spawnCannonball(origin, ballVelocity, true, this.ammoType);
      this.spawnSmokePuff(origin);
    }

    this.updateBattleHUD();
  }

  spawnCannonball(pos, vel, isFromPlayer, ammo) {
    const geo = new THREE.SphereGeometry(0.55, 8, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, metalness: 0.9, roughness: 0.2 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    this.scene.add(mesh);

    this.cannonballs.push({
      mesh,
      velocity: vel,
      isFromPlayer,
      ammo,
      life: 3.2
    });
  }

  spawnSmokePuff(pos) {
    const geo = new THREE.SphereGeometry(1.5 + Math.random() * 1.5, 6, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      transparent: true,
      opacity: 0.75
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    this.scene.add(mesh);

    this.particles.push({
      mesh,
      scaleSpeed: 3.2,
      fadeSpeed: 0.85,
      life: 1.2
    });
  }

  spawnWaterSplash(pos) {
    const geo = new THREE.CylinderGeometry(0.8, 2.2, 5.0, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xebf6ff, transparent: true, opacity: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.position.y = 2.5;
    this.scene.add(mesh);

    this.waterSplashes.push({
      mesh,
      life: 0.6
    });

    if (window.AdmiraltyAudio) window.AdmiraltyAudio.playWaterSplash();
  }

  // --- Main Simulation & Animation Loop ---
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.05);

    // 1. Animate Ocean Waves
    this.updateOceanWaves();

    // 2. Simulate Warship Aerodynamics & Sailing Physics
    if (this.playerShip) this.updateShipPhysics(this.playerShip, delta);
    this.enemyShips.forEach(e => {
      this.updateShipPhysics(e, delta);
      this.updateEnemyAI(e, delta);
    });

    // 3. Update Ballistics & Cannonball Collisions
    this.updateCannonballs(delta);

    // 4. Update Smoke & Water Particles
    this.updateParticles(delta);

    // 5. Update Camera Tracking
    this.updateCameraFollow();

    // 6. Render Frame
    if (this.controls && this.cameraMode === 'tactical') {
      this.controls.update();
    }
    this.renderer.render(this.scene, this.camera);
  }

  updateOceanWaves() {
    if (!this.waterMesh || !this.initialWaterVertices) return;
    const time = this.clock.getElapsedTime();
    const pos = this.waterMesh.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getZ(i);
      // Dual rolling sine wave equation
      const wave = Math.sin(u * 0.015 + time * 1.8) * 1.8 + Math.cos(v * 0.018 + time * 1.2) * 1.4;
      pos.setY(i, this.initialWaterVertices[i] + wave);
    }
    pos.needsUpdate = true;
  }

  updateShipPhysics(ship, delta) {
    const u = ship.userData;
    if (u.isSunk) {
      ship.position.y -= delta * 1.2;
      ship.rotation.z += delta * 0.05;
      return;
    }

    // 1. Reload Timers Countdown
    if (u.reloadPortTimer > 0) u.reloadPortTimer = Math.max(0, u.reloadPortTimer - delta);
    if (u.reloadStarboardTimer > 0) u.reloadStarboardTimer = Math.max(0, u.reloadStarboardTimer - delta);

    // 2. Sail Speed Multiplier according to Sail State
    let sailMultiplier = 0;
    if (u.sailState === 'battle') sailMultiplier = 0.65;
    if (u.sailState === 'full') sailMultiplier = 1.0;

    // 3. True Wind Aerodynamics (Polar Sailing Theory)
    // Relative angle between ship heading and wind
    const shipHeading = ship.rotation.y;
    const relWindAngle = Math.abs((shipHeading - this.wind.angle) % (Math.PI * 2));
    const angleFromHeadwind = Math.min(relWindAngle, Math.PI * 2 - relWindAngle);

    // In irons (Head to wind): dead stop
    let windEfficiency = 0.15;
    if (angleFromHeadwind > Math.PI * 0.25) {
      // Beam reach / Running with the wind
      windEfficiency = 0.5 + Math.sin(angleFromHeadwind * 0.8) * 0.65;
    }

    // Rigging damage impact on max speed
    const riggingFactor = Math.max(0.2, u.rigging / u.maxRigging);

    u.targetSpeed = this.wind.speedKnots * 0.85 * sailMultiplier * windEfficiency * riggingFactor;
    u.speedKnots += (u.targetSpeed - u.speedKnots) * delta * 0.6;

    // 4. Rudder Steering (Turning requires forward water momentum)
    const turnAbility = Math.min(1.0, u.speedKnots / 4.0);
    u.turnVelocity = u.rudderAngle * 0.55 * turnAbility;
    ship.rotation.y += u.turnVelocity * delta;

    // Straighten rudder slowly
    u.rudderAngle *= (1 - delta * 0.8);

    // 5. Position Movement
    const speedWorld = u.speedKnots * 1.2 * delta;
    ship.position.x += Math.sin(ship.rotation.y) * speedWorld;
    ship.position.z += Math.cos(ship.rotation.y) * speedWorld;

    // 6. Buoyant Ship Pitch and Roll over Waves
    const time = this.clock.getElapsedTime();
    ship.rotation.z = Math.sin(time * 1.8 + ship.position.x * 0.05) * 0.04 - (u.turnVelocity * 0.15);
    ship.rotation.x = Math.cos(time * 1.4 + ship.position.z * 0.05) * 0.03;
    ship.position.y = Math.sin(time * 2.0 + ship.position.x * 0.02) * 0.6;

    // Flag flutter in wind
    if (u.flagMesh) {
      u.flagMesh.rotation.z = Math.sin(time * 8) * 0.12;
    }
  }

  updateEnemyAI(ship, delta) {
    if (!this.playerShip || ship.userData.isSunk) return;
    const u = ship.userData;

    const toPlayer = this.playerShip.position.clone().sub(ship.position);
    const dist = toPlayer.length();

    // AI Maneuver: Try to bring broadside into firing arc (parallel or perpendicular pass)
    const targetAngle = Math.atan2(toPlayer.x, toPlayer.z) + Math.PI / 2;
    const diff = (targetAngle - ship.rotation.y) % (Math.PI * 2);

    ship.userData.rudderAngle = Math.max(-0.4, Math.min(0.4, diff * 0.6));
    ship.userData.sailState = dist > 140 ? 'full' : 'battle';

    // AI Firing Condition
    if (dist < 180) {
      const relAngle = Math.abs(diff);
      if ((relAngle > 1.2 && relAngle < 1.9) || (relAngle > 4.4 && relAngle < 5.1)) {
        const side = diff > 0 ? 'port' : 'starboard';
        if ((side === 'port' && u.reloadPortTimer <= 0) || (side === 'starboard' && u.reloadStarboardTimer <= 0)) {
          this.fireAIBroadside(ship, side);
        }
      }
    }
  }

  fireAIBroadside(ship, side) {
    const u = ship.userData;
    if (side === 'port') u.reloadPortTimer = u.reloadMaxTime;
    if (side === 'starboard') u.reloadStarboardTimer = u.reloadMaxTime;

    const heading = ship.rotation.y;
    const fireDirAngle = side === 'port' ? (heading + Math.PI / 2) : (heading - Math.PI / 2);
    const count = 6;

    if (window.AdmiraltyAudio) window.AdmiraltyAudio.playBroadside(count, 0.7);

    for (let i = 0; i < count; i++) {
      const origin = ship.position.clone();
      origin.x += Math.cos(fireDirAngle) * 6;
      origin.z += -Math.sin(fireDirAngle) * 6;
      origin.y = 4.0;

      const spread = (Math.random() - 0.5) * 0.1;
      const speed = 100 + Math.random() * 20;

      const vel = new THREE.Vector3(
        Math.cos(fireDirAngle + spread) * speed,
        7 + Math.random() * 3,
        -Math.sin(fireDirAngle + spread) * speed
      );

      this.spawnCannonball(origin, vel, false, 'round');
      this.spawnSmokePuff(origin);
    }
  }

  updateCannonballs(delta) {
    for (let i = this.cannonballs.length - 1; i >= 0; i--) {
      const ball = this.cannonballs[i];
      ball.life -= delta;

      // Ballistic gravity
      ball.velocity.y -= 9.8 * delta * 2.8;
      ball.mesh.position.addScaledVector(ball.velocity, delta);

      // Hit Water Surface
      if (ball.mesh.position.y <= 0) {
        this.spawnWaterSplash(ball.mesh.position);
        this.scene.remove(ball.mesh);
        this.cannonballs.splice(i, 1);
        continue;
      }

      // Check Ship Collisions
      const targets = ball.isFromPlayer ? this.enemyShips : [this.playerShip];
      let hasHit = false;

      for (const target of targets) {
        if (!target || target.userData.isSunk) continue;
        const d = ball.mesh.position.distanceTo(target.position);
        if (d < 16) {
          // Impact detected!
          this.applyDamage(target, ball.ammo, ball.isFromPlayer);
          this.spawnSmokePuff(ball.mesh.position);
          this.scene.remove(ball.mesh);
          this.cannonballs.splice(i, 1);
          hasHit = true;
          break;
        }
      }

      if (!hasHit && ball.life <= 0) {
        this.scene.remove(ball.mesh);
        this.cannonballs.splice(i, 1);
      }
    }
  }

  applyDamage(target, ammoType, isPlayerAttacking) {
    const u = target.userData;

    if (window.AdmiraltyAudio) {
      window.AdmiraltyAudio.playTimberCrash();
    }

    if (ammoType === 'round') {
      // Hull Damage
      const dmg = 95 + Math.random() * 45;
      u.hull = Math.max(0, u.hull - dmg);
    } else if (ammoType === 'chain') {
      // Rigging & Sail shredding
      const dmg = 120 + Math.random() * 60;
      u.rigging = Math.max(0, u.rigging - dmg);
    } else if (ammoType === 'grape') {
      // Crew casualties
      const dmg = 35 + Math.random() * 25;
      u.crew = Math.max(0, u.crew - dmg);
      u.morale = Math.max(10, u.morale - 12);
    }

    // Check if Ship Sinks
    if (u.hull <= 0 && !u.isSunk) {
      u.isSunk = true;
      if (window.AdmiraltyAudio) {
        window.AdmiraltyAudio.playVictoryFanfare();
      }
      this.checkBattleVictory();
    }

    this.updateBattleHUD();
  }

  updateParticles(delta) {
    // Smoke
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;
      p.mesh.scale.addScalar(p.scaleSpeed * delta);
      p.mesh.position.y += 4.5 * delta;
      p.mesh.material.opacity = Math.max(0, p.mesh.material.opacity - p.fadeSpeed * delta);

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }

    // Water Splashes
    for (let i = this.waterSplashes.length - 1; i >= 0; i--) {
      const s = this.waterSplashes[i];
      s.life -= delta;
      s.mesh.scale.y += delta * 4;
      s.mesh.material.opacity = Math.max(0, s.mesh.material.opacity - delta * 1.5);
      if (s.life <= 0) {
        this.scene.remove(s.mesh);
        this.waterSplashes.splice(i, 1);
      }
    }
  }

  updateCameraFollow() {
    if (!this.playerShip || this.cameraMode === 'tactical') return;

    const pPos = this.playerShip.position;
    const heading = this.playerShip.rotation.y;

    if (this.cameraMode === 'quarterdeck') {
      // Behind & slightly above the stern
      const offsetDist = 65;
      const offsetHeight = 28;
      const camX = pPos.x - Math.sin(heading) * offsetDist;
      const camZ = pPos.z - Math.cos(heading) * offsetDist;
      const camY = pPos.y + offsetHeight;

      this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.1);
      this.camera.lookAt(pPos.x, pPos.y + 12, pPos.z);
    } else if (this.cameraMode === 'broadside') {
      // Cinematic low side view
      const camX = pPos.x + Math.cos(heading) * 35;
      const camZ = pPos.z - Math.sin(heading) * 35;
      const camY = pPos.y + 8;
      this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.1);
      this.camera.lookAt(pPos.x, pPos.y + 6, pPos.z);
    }
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
    if (this.controls) {
      this.controls.enabled = (mode === 'tactical');
    }
  }

  // --- Boarding Melee Minigame (اقتحام سفينة العدو) ---
  attemptBoarding() {
    if (!this.playerShip || this.playerShip.userData.isSunk) return;

    // Find nearest enemy ship
    let closest = null;
    let minDist = 999;
    for (const e of this.enemyShips) {
      if (e.userData.isSunk) continue;
      const d = this.playerShip.position.distanceTo(e.position);
      if (d < minDist) {
        minDist = d;
        closest = e;
      }
    }

    if (!closest || minDist > 45) {
      return { success: false, msg: 'سفينة العدو بعيدة جداً! اقترب لأقل من 45 ياردة لإلقاء كلابات التثبيت.' };
    }

    if (window.AdmiraltyAudio) {
      window.AdmiraltyAudio.playBoardingHorn();
    }

    const pCrew = this.playerShip.userData.crew;
    const eCrew = closest.userData.crew;

    // Boarding combat formula with Royal Marines bonus
    const pRoll = Math.floor(Math.random() * 40) + pCrew * 0.2;
    const eRoll = Math.floor(Math.random() * 30) + eCrew * 0.15;

    if (pRoll >= eRoll) {
      // Victory: Enemy ship captured as prize of war!
      closest.userData.isSunk = true;
      const prizeMoney = 1500;
      if (window.admiraltyWorldEngine) {
        window.admiraltyWorldEngine.playerGold += prizeMoney;
        window.admiraltyWorldEngine.playerPrestige += 120;
        window.admiraltyWorldEngine.updateHUD();
      }
      this.checkBattleVictory();
      return {
        success: true,
        captured: true,
        prize: prizeMoney,
        msg: `تم اقتحام سفينة «${closest.userData.name}» بنجاح وأسر طاقمها! غنائم المعركة: +${prizeMoney} غينيا ذهبية.`
      };
    } else {
      // Repelled with casualties
      const loss = Math.floor(30 + Math.random() * 40);
      this.playerShip.userData.crew = Math.max(10, pCrew - loss);
      this.updateBattleHUD();
      return {
        success: true,
        captured: false,
        msg: `تصدى جنود العدو للاقتحام! خسائر المشاة البحرية: ${loss} بطل.`
      };
    }
  }

  checkBattleVictory() {
    const allEnemiesDefeated = this.enemyShips.every(e => e.userData.isSunk);
    if (allEnemiesDefeated) {
      setTimeout(() => {
        if (window.onBattleWonCallback) {
          window.onBattleWonCallback(this.activeMission);
        }
      }, 1200);
    }
  }

  updateBattleHUD() {
    if (!this.playerShip) return;
    const u = this.playerShip.userData;

    const elHull = document.getElementById('hud-player-hull');
    const elRigging = document.getElementById('hud-player-rigging');
    const elCrew = document.getElementById('hud-player-crew');
    const elSpeed = document.getElementById('hud-player-speed');
    const elSails = document.getElementById('hud-player-sails');
    const elPortReady = document.getElementById('hud-reload-port');
    const elStbdReady = document.getElementById('hud-reload-starboard');

    if (elHull) {
      const pct = Math.round((u.hull / u.maxHull) * 100);
      elHull.textContent = `${pct}% (${Math.round(u.hull)} / ${u.maxHull})`;
      elHull.style.color = pct > 50 ? '#4ade80' : (pct > 25 ? '#facc15' : '#f87171');
    }
    if (elRigging) {
      const pct = Math.round((u.rigging / u.maxRigging) * 100);
      elRigging.textContent = `${pct}%`;
    }
    if (elCrew) elCrew.textContent = `${Math.round(u.crew)}`;
    if (elSpeed) elSpeed.textContent = `${u.speedKnots.toFixed(1)} عقدة`;
    if (elSails) {
      const labels = { furled: 'مطوية (توقف)', battle: 'أشرعة المعركة (مناورة)', full: 'أشرعة كاملة (سرعة)' };
      elSails.textContent = labels[u.sailState] || u.sailState;
    }
    if (elPortReady) {
      elPortReady.textContent = u.reloadPortTimer <= 0 ? 'جاهز للإطلاق 💥' : `تلقيم (${u.reloadPortTimer.toFixed(1)} ث)`;
      elPortReady.style.color = u.reloadPortTimer <= 0 ? '#4ade80' : '#f87171';
    }
    if (elStbdReady) {
      elStbdReady.textContent = u.reloadStarboardTimer <= 0 ? 'جاهز للإطلاق 💥' : `تلقيم (${u.reloadStarboardTimer.toFixed(1)} ث)`;
      elStbdReady.style.color = u.reloadStarboardTimer <= 0 ? '#4ade80' : '#f87171';
    }
  }
}

window.Naval3DEngine = Naval3DEngine;
