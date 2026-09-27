/**
 * Sovereign of the Seas: Empire & Admiralty
 * Admiralty Dispatches, Historical Campaigns & Tactical Battles Data
 */

window.AdmiraltyMissionsData = {
  // Official Admiralty Rank Progression
  ranks: [
    { rank: 0, titleAr: 'ملازم أول بحري (Lieutenant)', titleEn: 'Lieutenant RN', minPrestige: 0, commandCap: 'Sloop of War' },
    { rank: 1, titleAr: 'نقيب وقائد فرقاطة (Post-Captain)', titleEn: 'Post-Captain RN', minPrestige: 300, commandCap: '5th Rate Frigate' },
    { rank: 2, titleAr: 'كومودور بحري (Commodore)', titleEn: 'Commodore', minPrestige: 800, commandCap: '3rd Rate Squadron' },
    { rank: 3, titleAr: 'نائب أدميرال البحرية الملكية (Vice-Admiral)', titleEn: 'Vice-Admiral of the White', minPrestige: 1600, commandCap: '1st Rate Battlefleet' },
    { rank: 4, titleAr: 'أدميرال الأسطول ولورد الأميرالية الأول (Admiral of the Fleet)', titleEn: 'Admiral of the Fleet & First Lord', minPrestige: 3000, commandCap: 'Supreme Command' }
  ],

  // Historical Campaigns & Scenarios
  campaigns: [
    {
      id: 'trafalgar1805',
      nameAr: 'معركة ترافلغار الخالدة (1805)',
      nameEn: 'The Battle of Trafalgar (1805)',
      year: 1805,
      theatreAr: 'قبالة رأس الطرف الأغر (قادس، إسبانيا)',
      theatreEn: 'Off Cape Trafalgar, Spain',
      briefingAr: '«إنجلترا تتوقع من كل رجل أن يؤدي واجبه.» اقترب الأسطول الفرنسي الإسباني المشترك بـ 33 سفينة خط. قُد سفينة القيادة الملكية HMS Victory مع اللورد نيلسون واخترق صفوف العدو عمودياً لقطع خطهم لنصفين وتدمير سفينة القيادة الفرنسية Bucentaure وسفينة الحصن الإسبانية Santísima Trinidad.',
      briefingEn: '"England expects that every man will do his duty." Cut the Franco-Spanish line in two columns.',
      playerShipClass: 'firstRate',
      playerName: 'HMS Victory (104 Guns)',
      playerAdmiral: 'nelson',
      windDirection: 280, // degrees (WNW gale)
      windSpeedKnots: 16,
      weatherCondition: 'goldenHour',
      enemyFleet: [
        {
          name: 'Bucentaure',
          faction: 'france',
          shipClass: 'thirdRate',
          guns: 80,
          hull: 2700,
          crew: 750,
          position: { x: 120, z: -80 },
          role: 'Enemy Flagship'
        },
        {
          name: 'Santísima Trinidad',
          faction: 'spain',
          shipClass: 'firstRate',
          guns: 136,
          hull: 3600,
          crew: 950,
          position: { x: 260, z: 20 },
          role: '4-Decker Titan'
        },
        {
          name: 'Redoutable',
          faction: 'france',
          shipClass: 'thirdRate',
          guns: 74,
          hull: 2300,
          crew: 680,
          position: { x: 80, z: 120 },
          role: 'Deadly Sharpshooters'
        }
      ],
      rewardGuineas: 3500,
      rewardPrestige: 500,
      rewardTitleAr: 'سيد أعالي البحار وقاهر ترافلغار'
    },
    {
      id: 'nile1798',
      nameAr: 'معركة النيل وخليج أبو قير (1798)',
      nameEn: 'Battle of the Nile (Aboukir Bay, 1798)',
      year: 1798,
      theatreAr: 'خليج أبو قير، الإسكندرية (مصر)',
      theatreEn: 'Aboukir Bay, Alexandria, Egypt',
      briefingAr: 'أسطول نابليون بونابرت راسي في خليج أبو قير معتقداً أنه في أمان تام. نيلسون يأمر بالهجوم الليلي المباغت بين الشاطئ والسفن الفرنسية الراسية. هدفك الأساسي: تطويق وإشعال سفينة العملاق الفرنسي L\'Orient (120 مدفعاً) وقطع إمدادات بونابرت في الشرق.',
      briefingEn: 'Night attack on the French fleet anchored in Aboukir Bay. Engage and destroy the 120-gun L\'Orient.',
      playerShipClass: 'thirdRate',
      playerName: 'HMS Vanguard (74 Guns)',
      playerAdmiral: 'nelson',
      windDirection: 330,
      windSpeedKnots: 12,
      weatherCondition: 'nightFire',
      enemyFleet: [
        {
          name: 'L\'Orient',
          faction: 'france',
          shipClass: 'firstRate',
          guns: 120,
          hull: 3800,
          crew: 1000,
          position: { x: 180, z: 0 },
          role: 'French Super Dreadnought'
        },
        {
          name: 'Le Guerrier',
          faction: 'france',
          shipClass: 'thirdRate',
          guns: 74,
          hull: 2100,
          crew: 600,
          position: { x: 70, z: -100 },
          role: 'Anchored Line Guard'
        }
      ],
      rewardGuineas: 2800,
      rewardPrestige: 400,
      rewardTitleAr: 'بطل معركة النيل والشرق'
    },
    {
      id: 'caribbeanPirates1780',
      nameAr: 'حرب الكاريبي وقمع قراصنة ناسو (1780)',
      nameEn: 'Caribbean Sea Supremacy & Pirate Haven Raid',
      year: 1780,
      theatreAr: 'مضيق البهاماس ومياه جامايكا',
      theatreEn: 'Bahamas Channel & Jamaican Waters',
      briefingAr: 'القراصنة بالتحالف مع قراصنة التفويض الفرنسيين يعترضون قوافل السكر والروم المتجهة إلى بورتسموث. انطلق بالفرقاطة الملكية السريعة وطارد أسطول القرصان الأسود واقتحم سفينته واستعد شحنة الذهب الملكية.',
      briefingEn: 'Pursue pirate raiders intercepting sugar convoys in the Bahamas. Board and seize their flagship.',
      playerShipClass: 'frigateFifthRate',
      playerName: 'HMS Surprise (38 Guns)',
      playerAdmiral: 'cochrane',
      windDirection: 90,
      windSpeedKnots: 18,
      weatherCondition: 'tropicalDay',
      enemyFleet: [
        {
          name: 'The Black Corsair',
          faction: 'pirates',
          shipClass: 'frigateFifthRate',
          guns: 36,
          hull: 1600,
          crew: 320,
          position: { x: 140, z: -60 },
          role: 'Pirate Raider'
        },
        {
          name: 'Sea Wolf Brig',
          faction: 'pirates',
          shipClass: 'sloopOfWar',
          guns: 18,
          hull: 850,
          crew: 140,
          position: { x: 60, z: 80 },
          role: 'Fast Escort'
        }
      ],
      rewardGuineas: 1800,
      rewardPrestige: 250,
      rewardTitleAr: 'فاتح بحار الكاريبي'
    },
    {
      id: 'gibraltarRelief1782',
      nameAr: 'فك حصار جبل طارق العظيم (1782)',
      nameEn: 'The Great Siege of Gibraltar Relief',
      year: 1782,
      theatreAr: 'خليج الجزيرة الخضراء ومضيق جبل طارق',
      theatreEn: 'Bay of Algeciras & Strait of Gibraltar',
      briefingAr: 'صخرة جبل طارق محاصرة منذ 3 سنوات تحت نيران المدافع العائمة الإسبانية. قُد أسطول الإغاثة بقيادة اللورد هاو، شتت الحصار الإسباني بالمدفعية الثقيلة، وأوصل قوافل الذخيرة والمؤن للحامية المحاصرة.',
      briefingEn: 'Relieve the Rock of Gibraltar against Franco-Spanish floating batteries.',
      playerShipClass: 'thirdRate',
      playerName: 'HMS Royal George (100 Guns)',
      playerAdmiral: 'howe',
      windDirection: 210,
      windSpeedKnots: 14,
      weatherCondition: 'stormyGale',
      enemyFleet: [
        {
          name: 'San Carlos (Floating Battery)',
          faction: 'spain',
          shipClass: 'thirdRate',
          guns: 74,
          hull: 2800,
          crew: 650,
          position: { x: 160, z: 40 },
          role: 'Bombardment Battery'
        },
        {
          name: 'Santa Rosa',
          faction: 'spain',
          shipClass: 'frigateFifthRate',
          guns: 40,
          hull: 1550,
          crew: 300,
          position: { x: 90, z: -90 },
          role: 'Blockade Frigate'
        }
      ],
      rewardGuineas: 2400,
      rewardPrestige: 350,
      rewardTitleAr: 'حامي صخرة جبل طارق'
    }
  ],

  // Admiralty Dispatches (أوامر ورسائل لوردات الأميرالية الملكية)
  dispatches: [
    {
      id: 'disp1',
      titleAr: 'أمر عاجل من الأميرالية: تعزيز حامية كينغستون',
      titleEn: 'Admiralty Dispatch: Reinforce Kingston Station',
      senderAr: 'اللورد الأول للأميرالية، قصر وايت هول، لندن',
      senderEn: 'First Lord of the Admiralty, Whitehall',
      date: '12 مايو 1779',
      textAr: '«إلى قائد الأسطول: وردتنا أنباء استخباراتية تفيد بحشد أسطول فرنسي في المارتينيك للهجوم على حقول السكر في جامايكا. تحرك فوراً بالفرقاطات لتعزيز الحامية وتسيير دوريات قتالية لحماية خطوط الشحن الملكية.»',
      targetPort: 'kingston',
      reward: 600
    },
    {
      id: 'disp2',
      titleAr: 'أمر اعتراض: قافلة الفضة القادمة من قادس',
      titleEn: 'Interception Order: Cadiz Treasure Galleons',
      senderAr: 'مجلس قيادة البحرية الملكية',
      senderEn: 'Board of Admiralty',
      date: '4 سبتمبر 1781',
      textAr: '«تحركت سفن الأرمادا الإسبانية المحملة بالسبائك من هافانا نحو قادس. صدرت لكم الأوامر باعتراض هذا الأسطول ومصادرة الكنوز كغنائم حرب ملكية لحساب خزينة جلالة الملك.»',
      targetPort: 'cadiz',
      reward: 1200
    },
    {
      id: 'disp3',
      titleAr: 'تطهير مضيق ملقا وطريق الهند الشرقية',
      titleEn: 'Clear the Malacca Straits & East India Route',
      senderAr: 'لجنة تجارة الهند الشرقية والبحرية',
      senderEn: 'East India Company & Royal Navy Liaison',
      date: '19 أكتوبر 1794',
      textAr: '«تتعرض سفن الشاي والحرير القادمة من كلكتا لهجمات قراصنة الشرق برعاية فرنسية. قم بتسيير دوريات فرقاطات حربية بمدافع الكارونيد لتأمين طريق رأس الرجاء الصالح.»',
      targetPort: 'calcutta',
      reward: 950
    }
  ]
};
