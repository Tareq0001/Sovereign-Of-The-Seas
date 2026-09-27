/**
 * Sovereign of the Seas: Empire & Admiralty
 * Master Ship Classes, Enemy Fleets, Upgrades & Historical Admirals
 * Royal Navy 18th-19th Century Age of Sail
 */

window.AdmiraltyShipsData = {
  // Playable & Buildable Ship Classes
  classes: {
    firstRate: {
      id: 'firstRate',
      nameAr: 'سفينة خط المعركة الدرجة الأولى (104 مدافع)',
      nameEn: '1st Rate Ship of the Line (104-Gun)',
      roleAr: 'قلعة بحرية عائمة جبارة • سحق أساطيل العدو',
      roleEn: 'Floating Fortress • Fleet Decimator',
      historicalExample: 'HMS Victory (1765) • HMS Royal Sovereign',
      decks: 3,
      hullMax: 3500,
      riggingMax: 1500,
      crewMax: 850,
      marines: 180,
      broadsideGunsPerSide: 52,
      gunCalibers: '32-Pounders, 24-Pounders, 12-Pounders & 68-Pdr Carronades',
      baseSpeedKnots: 8.5,
      turnRate: 0.85,
      reloadTimeSeconds: 8.0,
      costGuineas: 5500,
      timberRequired: 350,
      sailClothRequired: 220,
      unlockedAtRank: 4 // Admiral
    },
    thirdRate: {
      id: 'thirdRate',
      nameAr: 'سفينة خط المعركة الدرجة الثالثة (74 مدفعاً)',
      nameEn: '3rd Rate Ship of the Line (74-Gun)',
      roleAr: 'عماد الأسطول الملكي • التوازن الكامل بين القوة والسرعة',
      roleEn: 'Backbone of the Line • Perfect Balance of Firepower & Speed',
      historicalExample: 'HMS Bellerophon • HMS Temeraire',
      decks: 2,
      hullMax: 2500,
      riggingMax: 1700,
      crewMax: 650,
      marines: 120,
      broadsideGunsPerSide: 37,
      gunCalibers: '24-Pounders & 18-Pounders Long Guns',
      baseSpeedKnots: 10.5,
      turnRate: 1.15,
      reloadTimeSeconds: 6.5,
      costGuineas: 3800,
      timberRequired: 240,
      sailClothRequired: 160,
      unlockedAtRank: 2 // Commodore
    },
    frigateFifthRate: {
      id: 'frigateFifthRate',
      nameAr: 'الفرقاطة الملكية الثقيلة (38 مدفعاً)',
      nameEn: '5th Rate Heavy Frigate (38-Gun)',
      roleAr: 'عين الأسطول وكروزر البحار • صائدة السفن السريعة',
      roleEn: 'Eyes of the Fleet • Swift Hunter & Convoy Protector',
      historicalExample: 'HMS Indefatigable • HMS Shannon',
      decks: 1,
      hullMax: 1600,
      riggingMax: 1900,
      crewMax: 340,
      marines: 60,
      broadsideGunsPerSide: 20,
      gunCalibers: '18-Pounders & 32-Pdr Carronades',
      baseSpeedKnots: 13.5,
      turnRate: 1.65,
      reloadTimeSeconds: 5.2,
      costGuineas: 2200,
      timberRequired: 140,
      sailClothRequired: 110,
      unlockedAtRank: 1 // Post-Captain
    },
    sloopOfWar: {
      id: 'sloopOfWar',
      nameAr: 'الكورفيت / سلوب حربي سريع (18 مدفعاً)',
      nameEn: 'Sloop of War / Brig (18-Gun)',
      roleAr: 'مطاردة القراصنة والاستطلاع الساحلي السريع',
      roleEn: 'Pirate Chaser • Coastal Raiding & Inshore Patrol',
      historicalExample: 'HMS Cruizer • HMS Sophie (Lord Cochrane)',
      decks: 1,
      hullMax: 900,
      riggingMax: 1300,
      crewMax: 135,
      marines: 25,
      broadsideGunsPerSide: 9,
      gunCalibers: '32-Pdr Carronades & 6-Pounder Bow Chasers',
      baseSpeedKnots: 15.0,
      turnRate: 2.1,
      reloadTimeSeconds: 4.2,
      costGuineas: 1100,
      timberRequired: 70,
      sailClothRequired: 60,
      unlockedAtRank: 0 // Lieutenant
    },
    eastIndiaman: {
      id: 'eastIndiaman',
      nameAr: 'سفينة شركة الهند الشرقية المسلحة (28 مدفعاً)',
      nameEn: 'Armed East Indiaman Merchantman',
      roleAr: 'نقل الثروات والتوابل والشاي مع حماية مدفعية قوية',
      roleEn: 'Heavy Trade Carrier • Transoceanic Riches',
      historicalExample: 'Earl of Abergavenny • Kent',
      decks: 2,
      hullMax: 1800,
      riggingMax: 1400,
      crewMax: 210,
      marines: 30,
      broadsideGunsPerSide: 14,
      gunCalibers: '12-Pounders Defense Battery',
      baseSpeedKnots: 9.5,
      turnRate: 0.95,
      reloadTimeSeconds: 7.5,
      cargoCapacityTons: 1200,
      costGuineas: 2800,
      timberRequired: 180,
      sailClothRequired: 140,
      unlockedAtRank: 1
    }
  },

  // Historic Royal Navy Admirals for Fleet Appointment
  admirals: [
    {
      id: 'nelson',
      nameAr: 'نائب الأدميرال اللورد هوراشيو نيلسون',
      nameEn: 'Vice-Admiral Lord Horatio Nelson',
      portraitIcon: '👑⚓',
      traitAr: 'لمسة نيلسون (The Nelson Touch) • +25% ضرر المدافع الجانبية، كسر خطوط العدو بجرأة أسطورية',
      traitEn: '+25% Broadside Damage & +15% Boarding Morale',
      unlocked: true,
      bioAr: 'بطل معارك النيل وكوبنهاغن وترافلغار. قائد أسطوري يؤمن بالهجوم المباشر والالتحام عن قرب.'
    },
    {
      id: 'rodney',
      nameAr: 'الأدميرال جورج رودني',
      nameEn: 'Admiral Sir George Rodney',
      portraitIcon: '⚔️📜',
      traitAr: 'كسر الخطوط الكلاسيكي • +20% دقة المدافع عن المدى البعيد و +15% سرعة الدوران',
      traitEn: '+20% Long-range Accuracy & +15% Turn Rate',
      unlocked: true,
      bioAr: 'قاهر الأسطول الفرنسي في معركة القديسين (1782)، مبتكر تكتيك قطع خط معركة العدو إلى شطرين.'
    },
    {
      id: 'howe',
      nameAr: 'الأدميرال اللورد ريتشارد هاو ("بلاك ديك")',
      nameEn: 'Admiral Lord Richard Howe',
      portraitIcon: '🛡️⚓',
      traitAr: 'انضباط الأسطول الحديدي • خفض أضرار الهيكل بنسبة 20% ورفع سرعة إخماد الحرائق بنسبة 40%',
      traitEn: '-20% Hull Damage taken & Fast Damage Control',
      unlocked: false,
      unlockCost: 1500,
      bioAr: 'بطل معركة أول يونيو المجيدة (1794). خبير المناورات التكتيكية والانضباط البحري الصارم.'
    },
    {
      id: 'cochrane',
      nameAr: 'النقيب اللورد توماس كوكرين ("ذئب البحار")',
      nameEn: 'Captain Lord Thomas Cochrane (The Sea Wolf)',
      portraitIcon: '🐺💥',
      traitAr: 'غارات الصدمة المفاجئة • +30% سرعة الفرقاطات والسفن الخفيفة، وفرصة مضاعفة لغنائم الأسر',
      traitEn: '+30% Speed for Frigates & 2x Prize Money',
      unlocked: false,
      unlockCost: 2000,
      bioAr: 'أجرأ قباطنة الفرقاطات في التاريخ، أرعب السواحل الفرنسية والإسبانية بغارات ليلية استثنائية.'
    }
  ],

  // Royal Naval Yard Upgrades (ترقيات الترسانة الملكية)
  upgrades: [
    {
      id: 'copperSheathing',
      nameAr: 'التصفيح النحاسي لقاع السفينة (Copper Sheathing)',
      nameEn: 'Copper Sheathing',
      descAr: 'تغطية الجزء المغمور بصفائح نحاسية لمنع التصاق الطحالب وديدان الخشب، لزيادة سرعة الإبحار 15%.',
      costGuineas: 850,
      speedBonusPercent: 15,
      accelerationBonus: 20
    },
    {
      id: 'carronadesSmashers',
      nameAr: 'مدافع الكارونيد "المحطمة" عيار 68 رطلاً',
      nameEn: '68-Pounder Carronades "The Smashers"',
      descAr: 'مدافع قصيرة المدى ذات قدرة تدميرية هائلة تمزق هياكل العدو عند الاقتراب المباشر.',
      costGuineas: 1200,
      damageBonusPercent: 25,
      penetrationBonus: 30
    },
    {
      id: 'seasonedOakPlating',
      nameAr: 'دروع البلوط الإنجليزي المعتق (English Oak Plating)',
      nameEn: 'Seasoned English Oak Plating',
      descAr: 'تعزيز أضلاع السفينة بأخشاب البلوط الملكي المعتق لزيادة متانة الهيكل بنسبة 25%.',
      costGuineas: 1100,
      hullBonusPercent: 25
    },
    {
      id: 'flintlockGunlocks',
      nameAr: 'ميكانيزم زناد الصوان السريع للمدافع (Flintlock Gunlocks)',
      nameEn: 'Flintlock Gunlocks',
      descAr: 'استبدال فتيل الإشعال القديم بآلية صوان فورية مما يقلل وقت إعادة تلقيم المدافع 25%.',
      costGuineas: 950,
      reloadSpeedBonusPercent: 25
    },
    {
      id: 'marineSharpshooters',
      nameAr: 'قناصة المشاة البحرية الملكية (Royal Marine Marksmen)',
      nameEn: 'Royal Marine Mast Sharpshooters',
      descAr: 'تمركز رماة نخبويين في أعالي الصواري لاقتناص ضباط العدو قبل الاقتحام وتقليل معنوياتهم.',
      costGuineas: 750,
      boardingBonusPercent: 30,
      enemyMoraleDebuff: 20
    }
  ],

  // Enemy Factions and Historic Ships
  enemyFactions: {
    france: {
      id: 'france',
      nameAr: 'البحرية الملكية الفرنسية (Marine Royale)',
      nameEn: 'Marine Royale (France)',
      flag: '⚜️',
      color: '#1a4b8c',
      doctrineAr: 'تصميم سفن سريعة وخفيفة واستهداف صواري العدو لشل حركته.',
      flagships: [
        { name: 'Bucentaure', guns: 80, class: '3rd Rate Flagship', captain: 'Admiral Villeneuve' },
        { name: 'Redoutable', guns: 74, class: '3rd Rate Elite', captain: 'Captain Lucas' },
        { name: 'Orient', guns: 118, class: '1st Rate Colossus', captain: 'Admiral Brueys' }
      ]
    },
    spain: {
      id: 'spain',
      nameAr: 'الأرمادا الإسبانية الملكية (Armada Española)',
      nameEn: 'Real Armada Española',
      flag: '🇪🇸',
      color: '#b82e2e',
      doctrineAr: 'أضخم السفن في العالم ذات الدروع الثقيلة والمدفعية الجبارة.',
      flagships: [
        { name: 'Santísima Trinidad', guns: 136, class: '4-Decker Super First-Rate', captain: 'Don Baltasar de Cisneros' },
        { name: 'Santa Ana', guns: 112, class: '1st Rate Fortress', captain: 'Admiral Álava' },
        { name: 'San Juan Nepomuceno', guns: 74, class: '3rd Rate Heroic', captain: 'Don Cosme de Churruca' }
      ]
    },
    pirates: {
      id: 'pirates',
      nameAr: 'قراصنة الكاريبي والقرصنة المفوضة (Buccaneers & Privateers)',
      nameEn: 'Caribbean Buccaneers & Privateers',
      flag: '☠️',
      color: '#111111',
      doctrineAr: 'سفن خفيفة وسريعة، غارات مباغتة، واقتحام دموي.',
      flagships: [
        { name: 'Queen Anne\'s Revenge', guns: 40, class: 'Heavy Frigate', captain: 'Blackbeard' },
        { name: 'The Black Corsair', guns: 32, class: 'Privateer Galleon', captain: 'Captain Vane' }
      ]
    }
  }
};
