/**
 * Sovereign of the Seas: Empire & Admiralty
 * Master Colonies, Ports, Trade Routes, Commodities, and Active Fleets Data
 * Age of Sail (1775-1815)
 */

window.AdmiraltyColoniesData = {
  // Global Commodity Catalog & Base Prices (in British Gold Guineas)
  commodities: {
    sugar: {
      id: 'sugar',
      nameAr: 'سكر القصب الكاريبي',
      nameEn: 'West Indian Sugar',
      icon: '🍬',
      basePrice: 45,
      weightPerTon: 1,
      descAr: 'الذهب الأبيض للكاريبي، السلعة الأكثر ربحية في الإمبراطورية.'
    },
    rum: {
      id: 'rum',
      nameAr: 'روم جامايكا المعتق',
      nameEn: 'Jamaica Navy Rum',
      icon: '🏺',
      basePrice: 60,
      weightPerTon: 1,
      descAr: 'وقود البحارة وشراب الموانئ، إمداد إجباري للأسطول الملكي (Pusser\'s Rum).'
    },
    tea: {
      id: 'tea',
      nameAr: 'شاي الهند وسيلان الفاخر',
      nameEn: 'East India Black Tea',
      icon: '🍃',
      basePrice: 90,
      weightPerTon: 0.8,
      descAr: 'سلعة النبلاء واللوردات، يُشحن عبر سفن شركة الهند الشرقية.'
    },
    spices: {
      id: 'spices',
      nameAr: 'التوابل والبهارات الشرقية',
      nameEn: 'Oriental Spices & Silk',
      icon: '🌶️',
      basePrice: 120,
      weightPerTon: 0.5,
      descAr: 'القرفة وجوزة الطيب والفلفل الأسود من ملقا وكلكتا.'
    },
    tobacco: {
      id: 'tobacco',
      nameAr: 'تبغ فرجينيا الذهبي',
      nameEn: 'Virginia Gold Leaf',
      icon: '🍂',
      basePrice: 50,
      weightPerTon: 1,
      descAr: 'محصول المستعمرات الأمريكية الفاخر وشريان تجارة الأطلسي.'
    },
    timber: {
      id: 'timber',
      nameAr: 'أخشاب البلوط وقنب الصواري',
      nameEn: 'Naval Oak Timber & Hemp',
      icon: '🌲',
      basePrice: 75,
      weightPerTon: 2,
      descAr: 'المادة الاستراتيجية الأولى؛ لا أسطول بدون بلوط إنجليزي وقنب بحري للصواري.'
    },
    silver: {
      id: 'silver',
      nameAr: 'سبائك الفضة والذهب الإسبانية',
      nameEn: 'Spanish Silver Pieces of Eight',
      icon: '🪙',
      basePrice: 200,
      weightPerTon: 1.5,
      descAr: 'كنوز مناجم بوتوسي والمكسيك، الهدف الأسمى للغارات البحرية.'
    }
  },

  // 16 Historic Ports & Colonies with Real Geographic Coordinates (lat, lon)
  ports: [
    // --- BRITISH EMPIRE ---
    {
      id: 'portsmouth',
      nameAr: 'بورتسموث ولندن (المقر الملكي)',
      nameEn: 'Portsmouth & London (Admiralty HQ)',
      owner: 'britain',
      region: 'Home Waters',
      lat: 50.8,
      lon: -1.1,
      fortLevel: 4, // Grand Citadel
      dockyardLevel: 4, // Royal Master Shipyard
      revenuePerTurn: 450,
      population: '1,200,000',
      produces: ['timber'],
      demands: ['sugar', 'rum', 'tea', 'spices', 'tobacco'],
      icon: '👑⚓',
      descAr: 'قلب الإمبراطورية ومقر لوردات الأميرالية وترسانة الأسطول العظيم.'
    },
    {
      id: 'kingston',
      nameAr: 'كينغستون (جامايكا)',
      nameEn: 'Kingston (Jamaica)',
      owner: 'britain',
      region: 'Caribbean',
      lat: 17.9,
      lon: -76.8,
      fortLevel: 3,
      dockyardLevel: 3,
      revenuePerTurn: 320,
      population: '45,000',
      produces: ['sugar', 'rum'],
      demands: ['timber', 'tobacco'],
      icon: '🏝️🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      descAr: 'عاصمة السكر والروم في جزر الهند الغربية ومقر أسطول الكاريبي الملكي.'
    },
    {
      id: 'bridgetown',
      nameAr: 'بريدجتاون (باربادوس)',
      nameEn: 'Bridgetown (Barbados)',
      owner: 'britain',
      region: 'Caribbean',
      lat: 13.1,
      lon: -59.6,
      fortLevel: 2,
      dockyardLevel: 2,
      revenuePerTurn: 220,
      population: '25,000',
      produces: ['sugar', 'rum'],
      demands: ['timber'],
      icon: '🌴',
      descAr: 'المحطة الأولى لسفن الأطلسي، أخصب مزارع القصب في جزر الأنتيل.'
    },
    {
      id: 'halifax',
      nameAr: 'هاليفاكس (نوفا سكوشا)',
      nameEn: 'Halifax (Nova Scotia)',
      owner: 'britain',
      region: 'North America',
      lat: 44.6,
      lon: -63.6,
      fortLevel: 3,
      dockyardLevel: 3,
      revenuePerTurn: 210,
      population: '18,000',
      produces: ['timber'],
      demands: ['rum', 'sugar', 'tea'],
      icon: '🌲⚓',
      descAr: 'حامية شمال الأطلسي ومورد أخشاب الصنوبر العملاقة لصواري السفن.'
    },
    {
      id: 'gibraltar',
      nameAr: 'مضيق جبل طارق (صخرة الدفاع)',
      nameEn: 'Gibraltar (The Rock)',
      owner: 'britain',
      region: 'Mediterranean',
      lat: 36.1,
      lon: -5.3,
      fortLevel: 4,
      dockyardLevel: 2,
      revenuePerTurn: 180,
      population: '12,000',
      produces: [],
      demands: ['timber', 'rum', 'sugar', 'tea'],
      icon: '🏰',
      descAr: 'مفتاح البحر الأبيض المتوسط وحصن الصخرة الذي لا يُقهر ضد الحصار.'
    },
    {
      id: 'calcutta',
      nameAr: 'كلكتا (البنغال وشركة الهند)',
      nameEn: 'Calcutta (Bengal Presidency)',
      owner: 'britain',
      region: 'India',
      lat: 22.6,
      lon: 88.4,
      fortLevel: 3,
      dockyardLevel: 3,
      revenuePerTurn: 520,
      population: '250,000',
      produces: ['tea', 'spices'],
      demands: ['timber'],
      icon: '🐘💎',
      descAr: 'درة التاج البريطاني، مركز ثروات شركة الهند الشرقية وتجارة الحرير والتوابل.'
    },
    {
      id: 'bombay',
      nameAr: 'بومباي (أحواض الساج)',
      nameEn: 'Bombay (Teak Dockyards)',
      owner: 'britain',
      region: 'India',
      lat: 18.9,
      lon: 72.8,
      fortLevel: 3,
      dockyardLevel: 4,
      revenuePerTurn: 380,
      population: '140,000',
      produces: ['spices', 'timber'],
      demands: ['sugar'],
      icon: '🪵⚓',
      descAr: 'أفضل أحواض بناء السفن في آسيا باستخدام خشب الساج المقاوم للقذائف.'
    },
    {
      id: 'capetown',
      nameAr: 'كيب تاون (رأس الرجاء الصالح)',
      nameEn: 'Cape Town (Cape of Good Hope)',
      owner: 'britain',
      region: 'South Africa',
      lat: -33.9,
      lon: 18.4,
      fortLevel: 3,
      dockyardLevel: 2,
      revenuePerTurn: 240,
      population: '22,000',
      produces: ['timber'],
      demands: ['rum', 'sugar', 'spices'],
      icon: '⚓⛰️',
      descAr: 'نقطة الربط الحيوية للملاحة بين أوروبا والمحيط الهندي وطريق الحرير البحري.'
    },

    // --- FRENCH EMPIRE ---
    {
      id: 'brest',
      nameAr: 'بريست (ترسانة الأطلسي الفرنسية)',
      nameEn: 'Brest (French Atlantic Fleet)',
      owner: 'france',
      region: 'Home Waters',
      lat: 48.4,
      lon: -4.5,
      fortLevel: 4,
      dockyardLevel: 4,
      revenuePerTurn: 390,
      population: '75,000',
      produces: ['timber'],
      demands: ['sugar', 'rum', 'tobacco'],
      icon: '⚜️⚓',
      descAr: 'أقوى قواعد البحرية الفرنسية ومرسى أسطول الأطلسي.'
    },
    {
      id: 'toulon',
      nameAr: 'طولون (ترسانة البحر الأبيض)',
      nameEn: 'Toulon (French Med Fleet)',
      owner: 'france',
      region: 'Mediterranean',
      lat: 43.1,
      lon: 5.9,
      fortLevel: 4,
      dockyardLevel: 4,
      revenuePerTurn: 360,
      population: '80,000',
      produces: ['timber'],
      demands: ['sugar', 'spices'],
      icon: '⚜️🏰',
      descAr: 'مرسى الأسطول الفرنسي في البحر المتوسط وقاعدة حملة بونابرت لمصر.'
    },
    {
      id: 'martinique',
      nameAr: 'فورت دو فرانس (المارتينيك)',
      nameEn: 'Fort-de-France (Martinique)',
      owner: 'france',
      region: 'Caribbean',
      lat: 14.6,
      lon: -61.1,
      fortLevel: 3,
      dockyardLevel: 2,
      revenuePerTurn: 280,
      population: '40,000',
      produces: ['sugar'],
      demands: ['timber', 'tobacco'],
      icon: '⚜️🏝️',
      descAr: 'جوهرة المستعمرات الفرنسية وقاعدة انطلاق قراصنة التفويض الفرنسيين.'
    },
    {
      id: 'pondicherry',
      nameAr: 'بونديشيري (الهند الفرنسية)',
      nameEn: 'Pondicherry (French India)',
      owner: 'france',
      region: 'India',
      lat: 11.9,
      lon: 79.8,
      fortLevel: 3,
      dockyardLevel: 2,
      revenuePerTurn: 260,
      population: '50,000',
      produces: ['spices', 'tea'],
      demands: ['timber'],
      icon: '⚜️💎',
      descAr: 'المعقل التجاري الفرنسي المنافس للنفوذ البريطاني في شبه القارة الهندية.'
    },

    // --- SPANISH EMPIRE ---
    {
      id: 'cadiz',
      nameAr: 'قادس (مرسى أسطول الفضة)',
      nameEn: 'Cádiz (Spanish Treasure Port)',
      owner: 'spain',
      region: 'Home Waters',
      lat: 36.5,
      lon: -6.3,
      fortLevel: 4,
      dockyardLevel: 3,
      revenuePerTurn: 420,
      population: '90,000',
      produces: ['silver'],
      demands: ['timber', 'sugar', 'spices'],
      icon: '🇪🇸🪙',
      descAr: 'بوابة إسبانيا إلى العالم الجديد وميناء وصول أساطيل الذهب والفضة.'
    },
    {
      id: 'havana',
      nameAr: 'هافانا (حصن الأنتيل العظيم)',
      nameEn: 'Havana (Fortress of the Indies)',
      owner: 'spain',
      region: 'Caribbean',
      lat: 23.1,
      lon: -82.4,
      fortLevel: 4,
      dockyardLevel: 4,
      revenuePerTurn: 480,
      population: '110,000',
      produces: ['tobacco', 'silver', 'sugar'],
      demands: ['timber'],
      icon: '🇪🇸🏰',
      descAr: 'أضخم حصون العالم الجديد ومحطة تجمع أسطول الفضة الإسباني (Flota de Indias).'
    },
    {
      id: 'cartagena',
      nameAr: 'قرطاجنة الهندية (ساحل الذهب)',
      nameEn: 'Cartagena de Indias',
      owner: 'spain',
      region: 'Caribbean',
      lat: 10.4,
      lon: -75.5,
      fortLevel: 4,
      dockyardLevel: 2,
      revenuePerTurn: 350,
      population: '38,000',
      produces: ['silver'],
      demands: ['timber', 'rum'],
      icon: '🇪🇸💎',
      descAr: 'مستودع زمرد وفضة كولومبيا وبيرو، ومقبرة الحملات العسكرية الغازية.'
    },

    // --- PIRATE / PRIVATEER HAVENS ---
    {
      id: 'nassau',
      nameAr: 'ناسو (جمهورية القراصنة والبهاماس)',
      nameEn: 'Nassau (Pirate Republic Haven)',
      owner: 'pirates',
      region: 'Caribbean',
      lat: 25.0,
      lon: -77.3,
      fortLevel: 2,
      dockyardLevel: 1,
      revenuePerTurn: 160,
      population: '8,000',
      produces: ['rum'],
      demands: ['silver', 'sugar', 'timber'],
      icon: '☠️🏝️',
      descAr: 'ملاذ القراصنة وسفن القرصنة المفوضة، ممر حرج يهدد تجارة الأطلسي.'
    }
  ],

  // Active Fleets & Squadrons on the Global Chart
  squadrons: [
    // BRITISH ROYAL NAVY SQUADRONS (Player Controlled)
    {
      id: 'channel_fleet',
      nameAr: 'أسطول القناة الإنجليزية الملكي',
      nameEn: 'Royal Channel Fleet',
      faction: 'britain',
      commanderAr: 'الأدميرال اللورد ريتشارد هاو',
      lat: 49.8,
      lon: -3.8,
      targetLat: null,
      targetLon: null,
      ships: [
        { name: 'HMS Victory', classId: 'firstRate', guns: 104, hull: 3500, maxHull: 3500 },
        { name: 'HMS Sovereign', classId: 'thirdRate', guns: 74, hull: 2500, maxHull: 2500 },
        { name: 'HMS Temeraire', classId: 'thirdRate', guns: 74, hull: 2500, maxHull: 2500 }
      ],
      state: 'patrolling',
      icon: '🇬🇧⛵'
    },
    {
      id: 'west_indies_squadron',
      nameAr: 'أسطول جزر الهند الغربية الكاريبي',
      nameEn: 'West Indies Squadron',
      faction: 'britain',
      commanderAr: 'الأدميرال السير جورج رودني',
      lat: 18.5,
      lon: -75.0,
      targetLat: null,
      targetLon: null,
      ships: [
        { name: 'HMS Surprise', classId: 'frigateFifthRate', guns: 38, hull: 1600, maxHull: 1600 },
        { name: 'HMS Indefatigable', classId: 'frigateFifthRate', guns: 44, hull: 1750, maxHull: 1750 },
        { name: 'HMS Sophie', classId: 'sloopOfWar', guns: 18, hull: 900, maxHull: 900 }
      ],
      state: 'patrolling',
      icon: '🇬🇧⛵'
    },
    {
      id: 'mediterranean_squadron',
      nameAr: 'أسطول البحر الأبيض المتوسط الملكي',
      nameEn: 'Royal Mediterranean Fleet',
      faction: 'britain',
      commanderAr: 'نائب الأدميرال اللورد هوراشيو نيلسون',
      lat: 36.4,
      lon: -5.0,
      targetLat: null,
      targetLon: null,
      ships: [
        { name: 'HMS Vanguard', classId: 'thirdRate', guns: 74, hull: 2500, maxHull: 2500 },
        { name: 'HMS Bellerophon', classId: 'thirdRate', guns: 74, hull: 2500, maxHull: 2500 },
        { name: 'HMS Shannon', classId: 'frigateFifthRate', guns: 38, hull: 1600, maxHull: 1600 }
      ],
      state: 'blockading',
      icon: '🇬🇧⛵'
    },
    {
      id: 'east_indies_squadron',
      nameAr: 'أسطول الهند الشرقية والبنغال',
      nameEn: 'East Indies Station',
      faction: 'britain',
      commanderAr: 'الكومودور إدوارد هيوز',
      lat: 16.5,
      lon: 82.0,
      targetLat: null,
      targetLon: null,
      ships: [
        { name: 'HMS Intrepid', classId: 'thirdRate', guns: 64, hull: 2200, maxHull: 2200 },
        { name: 'Kent (East Indiaman)', classId: 'eastIndiaman', guns: 28, hull: 1800, maxHull: 1800 }
      ],
      state: 'patrolling',
      icon: '🇬🇧⛵'
    },

    // ENEMY FACTIONS SQUADRONS (AI Controlled)
    {
      id: 'french_atlantic_fleet',
      nameAr: 'أسطول بريست الفرنسي (Marine Royale)',
      nameEn: 'French Atlantic Fleet (Brest)',
      faction: 'france',
      commanderAr: 'الأدميرال بيير دي فيلنوف',
      lat: 47.6,
      lon: -6.5,
      targetLat: null,
      targetLon: null,
      ships: [
        { name: 'Bucentaure', classId: 'thirdRate', guns: 80, hull: 2700, maxHull: 2700 },
        { name: 'Redoutable', classId: 'thirdRate', guns: 74, hull: 2300, maxHull: 2300 },
        { name: 'Formidable', classId: 'thirdRate', guns: 80, hull: 2600, maxHull: 2600 }
      ],
      state: 'patrolling',
      icon: '⚜️⛵'
    },
    {
      id: 'spanish_silver_armada',
      nameAr: 'أسطول الفضة الإسباني (الأرمادا الذهبية)',
      nameEn: 'Spanish Silver Treasure Armada',
      faction: 'spain',
      commanderAr: 'الأدميرال دون فيديريكو غرافينا',
      lat: 23.2,
      lon: -81.5, // Gathers at Havana, Cuba before crossing the Atlantic
      targetLat: 36.5,
      targetLon: -6.3, // Ultimate destination: Cadiz
      ships: [
        { name: 'Santísima Trinidad', classId: 'firstRate', guns: 136, hull: 3600, maxHull: 3600 },
        { name: 'Santa Ana', classId: 'firstRate', guns: 112, hull: 3200, maxHull: 3200 },
        { name: 'San Juan Nepomuceno', classId: 'thirdRate', guns: 74, hull: 2400, maxHull: 2400 }
      ],
      treasureCargoGuineas: 2500,
      state: 'sailing',
      icon: '🇪🇸⛵'
    },
    {
      id: 'caribbean_pirates',
      nameAr: 'قراصنة الكاريبي والبهاماس',
      nameEn: 'Caribbean Buccaneer Corsairs',
      faction: 'pirates',
      commanderAr: 'القرصان إدوارد تيتش (اللحية السوداء)',
      lat: 24.2,
      lon: -76.5,
      targetLat: null,
      targetLon: null,
      ships: [
        { name: 'Queen Anne\'s Revenge', classId: 'frigateFifthRate', guns: 40, hull: 1600, maxHull: 1600 },
        { name: 'Sea Wolf Brig', classId: 'sloopOfWar', guns: 18, hull: 850, maxHull: 850 }
      ],
      state: 'raiding',
      icon: '☠️⛵'
    }
  ],

  // Global Historical Trade Routes for Convoys
  tradeRoutes: [
    {
      id: 'sugarTriangle',
      nameAr: 'مثلث السكر والروم الأطلسي (The Sugar Triangle)',
      nameEn: 'The Atlantic Sugar Triangle',
      startPort: 'kingston',
      endPort: 'portsmouth',
      distanceTurns: 3,
      profitGuineas: 950,
      piracyRiskPercent: 35,
      requiredEscort: 'frigateFifthRate'
    },
    {
      id: 'eastIndiaRun',
      nameAr: 'طريق الهند والشاي العظيم (The East Indiaman Route)',
      nameEn: 'The Grand East India Run',
      startPort: 'calcutta',
      endPort: 'portsmouth',
      distanceTurns: 5,
      profitGuineas: 1800,
      piracyRiskPercent: 45,
      requiredEscort: 'thirdRate'
    },
    {
      id: 'timberConvoy',
      nameAr: 'قافلة أخشاب الشمال الملكية (North American Timber Run)',
      nameEn: 'Royal Mast & Timber Convoy',
      startPort: 'halifax',
      endPort: 'portsmouth',
      distanceTurns: 2,
      profitGuineas: 650,
      piracyRiskPercent: 20,
      requiredEscort: 'sloopOfWar'
    },
    {
      id: 'silverGalleonRaid',
      nameAr: 'اعتراض أسطول الفضة الإسباني (Spanish Flota Interception)',
      nameEn: 'Spanish Silver Treasure Intercept',
      startPort: 'havana',
      endPort: 'cadiz',
      distanceTurns: 4,
      profitGuineas: 2400,
      piracyRiskPercent: 75,
      requiredEscort: 'firstRate'
    }
  ]
};
