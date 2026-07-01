const menuData = [
  // ПІЦА
  {
    id: 'p1',
    category: 'pizza',
    name: 'Маргарита',
    description: 'Класична піца з томатним соусом, моцарелою та свіжим базиліком.',
    composition: 'Тісто, томатний соус, сир моцарела, помідори, базилік, оливкова олія.',
    weight: '450 г',
    price: 180,
    image: 'https://images.unsplash.com/photo-1751200884901-c1c6f43ae1d6?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 'p2',
    category: 'pizza',
    name: 'Пепероні',
    description: 'Гостра піца з італійською ковбасою пепероні.',
    composition: 'Тісто, томатний соус, сир моцарела, пепероні, перець чилі.',
    weight: '500 г',
    price: 240,
    image: 'https://images.unsplash.com/photo-1666304819875-bb1ef98391bb?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 'p3',
    category: 'pizza',
    name: 'Чотири сири',
    description: 'Ніжна піца на вершковій основі з чотирма видами сиру.',
    composition: 'Тісто, вершковий соус, моцарела, пармезан, горгонзола, чедер.',
    weight: '480 г',
    price: 260,
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=600&h=400&q=80',
    available: false // Демонстрація відсутності
  },
  
  // ПАСТА
  {
    id: 'pa1',
    category: 'pasta',
    name: 'Карбонара',
    description: 'Автентична італійська паста з гуанчіале, жовтком та пекоріно.',
    composition: 'Спагеті, бекон (гуанчіале), яєчний жовток, сир пармезан, чорний перець.',
    weight: '350 г',
    price: 195,
    image: 'https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 'pa2',
    category: 'pasta',
    name: 'Болоньєзе',
    description: 'Паста з насиченим м\'ясним рагу та томатами.',
    composition: 'Тальятелле, фарш яловичий, томатний соус, цибуля, морква, селера, вино.',
    weight: '400 г',
    price: 210,
    image: 'https://images.unsplash.com/photo-1526121831791-40b298302271?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 'pa3',
    category: 'pasta',
    name: 'Фетучіні з куркою та грибами',
    description: 'Вершкова паста з ніжним курячим філе та печерицями.',
    composition: 'Фетучіні, куряче філе, печериці, вершки, часник, пармезан.',
    weight: '380 г',
    price: 225,
    image: 'https://images.unsplash.com/photo-1550431221-6f1495d56cf3?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },

  // САЛАТИ
  {
    id: 's1',
    category: 'salads',
    name: 'Цезар з куркою',
    description: 'Хрусткий салат ромен, соковита курка, грінки та фірмовий соус.',
    composition: 'Мікс салату, куряче філе, перепелині яйця, томати чері, пармезан, грінки, соус Цезар.',
    weight: '250 г',
    price: 185,
    image: 'https://images.unsplash.com/photo-1746211108786-ca20c8f80ecd?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 's2',
    category: 'salads',
    name: 'Грецький',
    description: 'Свіжий салат зі стиглими овочами та сиром фета.',
    composition: 'Помідори, огірки, болгарський перець, сир фета, оливки, синя цибуля, оливкова олія.',
    weight: '300 г',
    price: 160,
    image: 'https://images.unsplash.com/photo-1745126010010-da1c6f5300a9?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 's3',
    category: 'salads',
    name: 'Салат з прошуто та грушею',
    description: 'Вишукане поєднання солоного прошуто, солодкої груші та сиру дорблю.',
    composition: 'Рукола, прошуто, груша, сир дорблю, волоський горіх, медово-гірчична заправка.',
    weight: '220 г',
    price: 215,
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },

  // НАПОЇ
  {
    id: 'd1',
    category: 'drinks',
    name: 'Лимонад Цитрусовий',
    description: 'Освіжаючий лимонад власного приготування.',
    composition: 'Лимон, апельсин, м\'ята, цукровий сироп, газована вода, лід.',
    weight: '400 мл',
    price: 85,
    image: 'https://images.unsplash.com/photo-1555949366-819808d99159?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 'd2',
    category: 'drinks',
    name: 'Матча Лате',
    description: 'Ніжний японський чай матча зі збитим молоком.',
    composition: 'Чай матча, молоко (коров\'яче або рослинне), сироп за бажанням.',
    weight: '300 мл',
    price: 110,
    image: 'https://images.unsplash.com/photo-1560148196-df61132466ce?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 'd3',
    category: 'drinks',
    name: 'Капучино',
    description: 'Класичний кавовий напій з густою молочною пінкою.',
    composition: 'Еспресо, спінене молоко.',
    weight: '250 мл',
    price: 65,
    image: 'https://images.unsplash.com/photo-1550731358-491ded4af838?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },

  // ДЕСЕРТИ
  {
    id: 'de1',
    category: 'desserts',
    name: 'Тирамісу',
    description: 'Ніжний італійський десерт на основі маскарпоне та печива савоярді.',
    composition: 'Сир маскарпоне, печиво савоярді, кава еспресо, яйця, цукор, какао.',
    weight: '150 г',
    price: 140,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 'de2',
    category: 'desserts',
    name: 'Чизкейк Нью-Йорк',
    description: 'Класичний випечений чизкейк з ягідним кюлі.',
    composition: 'Крем-сир, вершки, пісочна основа, яйця, ваніль, ягідний соус.',
    weight: '160 г',
    price: 135,
    image: 'https://images.unsplash.com/photo-1702925614886-50ad13c88d3f?auto=format&fit=crop&w=600&h=400&q=80',
    available: true
  },
  {
    id: 'de3',
    category: 'desserts',
    name: 'Фондан шоколадний',
    description: 'Кекс з рідкою шоколадною серединкою, подається з кулькою морозива.',
    composition: 'Шоколад, вершкове масло, борошно, яйця, цукор, ванільне морозиво.',
    weight: '180 г',
    price: 155,
    image: 'https://images.unsplash.com/photo-1676300184760-aa72b43f13cb?auto=format&fit=crop&w=600&h=400&q=80',
    available: false // Демонстрація відсутності
  }
];

// Робимо доступним глобально
window.menuData = menuData;