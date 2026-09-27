/**
 * Sovereign of the Seas: Empire & Admiralty
 * Colonies, Global Ports, Trade Routes & Commodity Markets Data
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

  // 16 Historic Ports & Colonies Across the Globe
  ports: [
    // --- BRITISH EMPIRE ---
    {
      id: 'portsmouth',
      nameAr: 'بورتسموث ولندن (المقر الملكي)',
      nameEn: 'Portsmouth & London (Admiralty HQ)',
      owner: 'britain',
      region: 'Home Waters',
      coords: { x: 495, y: 155 }, // Relative coordinates on global antique chart (1000x600)
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
      coords: { x: 255, y: 340 },
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
      coords: { x: 310, y: 375 },
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
      coords: { x: 290, y: 200 },
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
      coords: { x: 470, y: 245 },
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
      coords: { x: 790, y: 330 },
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
      coords: { x: 740, y: 345 },
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
      coords: { x: 550, y: 515 },
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
      coords: { x: 470, y: 170 },
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
      coords: { x: 510, y: 220 },
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
      coords: { x: 305, y: 355 },
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
      coords: { x: 765, y: 375 },
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
      coords: { x: 460, y: 235 },
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
      coords: { x: 235, y: 315 },
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
      coords: { x: 260, y: 395 },
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
      coords: { x: 250, y: 290 },
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
