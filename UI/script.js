var articlesBaseService = (function () {

    var articles = [
        {
            id: '1',
            title: 'В Минске девушка не пропустила скорую, в результате столкнулись три авто',
            summary: 'Вчера, 26 февраля, около 21:30 на пересечении Долгиновского тракта и улицы Орловской в Минске столкнулись три автомобиля.',
            createdAt: new Date('2017-03-02T21:40:24'),
            author: 'Татьяна Терентьева',
            content: '— Автомобиль скорой помощи двигался с включенными маячками по Долгиновскому тракту в направлении улицы Червякова. За рулем был мужчина 1963 года рождения. На перекрестке с улицей Орловской автомобилю не предоставила преимущество девушка 1994 года рождения, водитель Kia. Она ехала по улице Орловской со стороны улицы Нововиленской в направлении площади Бангалор, — сообщила корреспонденту Onliner.by старший инспектор ГАИ Центрального района Анастасия Редько.',
            tags: ['Минск', 'Авария']
        },
        {
            id: '2',
            title: '"Скидка еще больше". Россия настойчиво манит белорусские нефтепродукты в свои порты',
            summary: '«Российские железные дороги» (РЖД) увеличили с 25% до 50% скидку на перевозки нефтепродуктов в цистернах со станций Барбаров и Новополоцк в направлении припортовых станций Северо-Запада РФ.',
            createdAt: new Date('2017-03-02T21:33:20'),
            author: 'Саша Кузьмина',
            content: '«Утвердить внесение изменений (.) в части корректировки коэффициента 0,75 на 0,50 к тарифам на перевозки нефтепродуктов (…) в цистернах со станции Барбаров и Новополоцк Белорусской железной дороги в направлении припортовых станций Октябрьской железной дороги», говорится в сообщении. Коэффициент вступит в силу «в установленном порядке» (спустя 10 дней после официальной публикации в печатном издании РЖД) и будет действовать до изменения нынешних ценовых пределов. Монополия установила коэффициент в пределах «тарифного коридора», в рамках которого может варьировать утвержденные государством ставки.',
            tags: ['Россия', 'РЖД']
        },
        {
            id: '3',
            title: 'Президент Грузии пригласил Лукашенко в Тбилиси',
            summary: 'Президент Грузии Георгий Маргвелашвили пригласил президента Беларуси Александра Лукашенко совершить визит в Тбилиси. Об этом сообщает пресс-служба президента Грузии.',
            createdAt: new Date('2017-03-02T17:21:25'),
            author: 'Виталий Шидлов',
            content: 'Сегодня, 2 марта, в Минске состоялась еще одна встреча президентов двух стран.«Президенты сегодня подвели итоги визита Георгия Маргвелашвили в Минск и обсудили пути реализации достигнутых договоренностей. Президент Грузии пригласил президента Беларуси совершить визит в Тбилиси», — говорится в заявлении пресс-службы грузинского лидера.Там также сообщили, что накануне двусторонняя встреча президентов Беларуси и Грузии продолжалась более трех часов. Дата визита Лукашенко будет согласована позднее. Это будет второй визит президента Беларуси в Грузию. Первый раз в этой стране Александр Лукашенко побывал в апреле 2015 года.',
            tags: ['Грузия', 'Беларусь', 'Александр Лукашенко']
        },
        {
            id: '4',
            title: 'Мингорисполком о бизнес-центре у Куропат: запрета на стройку нет, застройщик сам ее приостановил',
            summary: 'Конфликт на стройплощадке возле Куропат временно затих: застройщик, как и обещал, увез всю технику и сейчас демонтирует площадку.',
            createdAt: new Date('2017-03-02T20:17:53'),
            author: 'Александр Новицкий',
            content: 'Сегодня же, пока застройщик встречался с лидером «Молодого фронта» Дмитрием Дашкевичем, зампред Виктор Лаптев высказал свое отношение к конфликту, назвав его официальной позицией города. — Я выскажу вам свою позицию по этому вопросу. Я лично встречался с участниками ситуации на стройплощадке, вчера у нас была встреча у председателя. Я лично достаточно подробно изучил этот вопрос. Мы как-то даже умышленно не высказывались по этому поводу ранее, и, наверное, можно сказать, что сейчас будет впервые озвучена моя позиция по этому вопросу. Да она и официальная тоже, — сказал Виктор Лаптев.',
            tags: ['Минск', 'Куропаты']
        },
        {
            id: '5',
            title: 'В мае Минскую городскую Ратушу начнут модернизировать',
            summary: '«Мультимедийное и техническое оборудование, установленное в Ратуше, уже устарело. Поэтому в ближайшее время там будет проведена модернизация», — рассказал TUT.',
            createdAt: new Date('2017-03-02T22:36:49'),
            author: 'Саша Кузьмина',
            content: 'Напомним, здание Ратуши было восстановлено на его историческом месте в 2003 году по архитектурному проекту Сергея Багласова. — Речь идет лишь о модернизации Ратуши, — уточнил Михаил Жих. — В конференц-зале будет установлена целая система аудиовизуального комплекса, а также мультимедийный экран, с помощью которого можно будет прямо с Ратуши вести пресс-конференции с городами-побратимами. Там же проведут и систему кондиционирования.',
            tags: ['Минск', 'Ратуша']
        },
        {
            id: '6',
            title: 'Шойгу доложил Путину о взятии Пальмиры сирийскими войсками.',
            summary: 'Вооруженные силы Сирии при поддержке ВКС России завершили операцию по взятию Пальмиры. Об этом доложил президенту России Владимиру Путину министр обороны Сергей Шойгу.',
            createdAt: new Date('2017-03-02T12:48:31'),
            author: 'Виктор Петрович',
            content: 'Боевики террористической группировки «Исламское государство» захватили Пальмиру в мае 2015 года. В конце марта 2016-го сирийские военные при поддержке российской авиации освободили город. В декабре минувшего года Пальмира вновь оказалась в руках экстремистов. Год назад операция по освобождению Пальмиры продолжалась две недели. Сирийские бойцы взяли штурмом старинную крепость на въезде в город 25 марта 2016 года. Спустя два дня они вошли в Пальмиру. Большой вклад в операцию по освобождению «жемчужины сирийской пустыни» внесли российские ВКС, которые наносили точечные удары по позициям ИГ. В дальнейшем военнослужащие РФ разминировали знаменитые развалины античной Пальмиры.',
            tags: ['Россия', 'Путин', 'Сирия']
        },
        {
            id: '7',
            title: '"Белэкспо" будет в Курасовщине, от Ноттингема еще не отказались, экс-Кемпински введут',
            summary: 'На пресс-конференции в Мингорисполкоме чиновники рассказали о крупных стройках, которые город сейчас ведет или планирует начать.',
            createdAt: new Date('2017-03-02T19:38:59'),
            author: 'Антон Тарлецкий',
            content: '— Снос 2-й больницы завершится в ноябре-декабре, — рассказал зампред Мингорисполкома Виктор Лаптев. — Что касается иных площадок для "Белэкспо", то мы раньше уже подбирали участок для строительства, сейчас вопрос только в финансировании. Если участок будет одобрен, то "Белэкспо" будем строить в районе улиц Корженевского - Кижеватова, есть и проектная документация по этому объекту. Вопрос схемы финансирования и привлечения инвесторов сейчас активно обсуждается. Но сказать, что участок определен конкретно, нельзя: это вопрос не только города, но и республиканских органов. Работа ведется.',
            tags: ['Минск', 'Белэкспо']
        },
        {
            id: '8',
            title: 'Дальмайер выиграла спринт на этапе КМ по биатлону в Южной Корее, Домрачева - 20-я',
            summary: 'Немецкая биатлонистка Лаура Дальмайер выиграла спринт на этапе Кубка мира по биатлону в Пхенчхане.',
            createdAt: new Date('2017-03-02T22:27:36'),
            author: 'Иван Иванов',
            content: 'Немка не допустила ни одного промаха (0+0) и на восемь секунд опередила норвежку Тириль Экхофф (0+0). Третьей стала француженка Анаис Шевалье (0+0). Отметим, что на подиум претендовала и ее соотечественница Мари Дорен-Абер, но она сошла с дистанции из-за головокружения.',
            tags: ['Биатлон', 'Дальмайер', 'Домрачева']
        },
        {
            id: '9',
            title: 'Тунеядцы, которые ухаживали за больными детьми, смогут претендовать на отмену налога',
            summary: 'Безработные, которые в 2015 году ухаживали за больными детьми до 14 лет или детьми-инвалидами до 18 лет, смогут претендовать на отмену налога на тунеядство из-за тяжелой жизненной ситуации.',
            createdAt: new Date('2017-03-02T22:42:23'),
            author: 'Сергей Иванов',
            content: 'С этого года в амбулаторных картах обязательно будут указывать, кто конкретно ухаживает за больным ребенком до 14 лет или ребенком-инвалидом до 18 лет, поясняют в Минздраве. Раньше эту информацию не вносили в карты. Поэтому когда безработные, которые в 2015 году ухаживали за больными детьми, начали обращаться за выписками, чтобы избежать уплаты налога на тунеядство, медики столкнулись с тем, что не могут указать в документе конкретного человека.',
            tags: ['Тунеядцы', 'Налог на тунеядство']
        },
        {
            id: '10',
            title: 'Цепкало освобожден от должности директора Администрации ПВТ ',
            summary: 'Валерий Цепкало освобожден от должности директора государственного учреждения «Администрация Парка высоких технологий».',
            createdAt: new Date('2017-03-02T14:38:10'),
            author: 'Иван Иванов',
            content: 'Соответствующее распоряжение президент Беларуси Александр Лукашенко подписал 2 марта, сообщает пресс-служба главы государства. Парк высоких технологий действует в Беларуси больше 10 лет, Валерий Цепкало возглавлял его с момента создания. Несмотря на динамичное развитие отрасли в последнее время, не все ставившиеся при создании особого режима задачи были решены, что в последнее время вызывало дискуссии экспертов и участников рынка.',
            tags: ['Цепкало', 'ПВТ', 'Александр Лукашенко']
        },
        {
            id: '11',
            title: 'Сильный ветер будет в пятницу. Объявлен оранжевый уровень опасности',
            summary: 'Из-за сильного ветра синоптики объявили оранжевый уровень опасности на пятницу, 3 марта. Однако температура будет плюсовой, в выходные также ожидается теплая погода. ',
            createdAt: new Date('2017-03-02T14:21:18'),
            author: 'Сергей Иванов',
            content: 'Ночью и утром 3 марта на большей части территории страны и в Минске, а днем по северо-востоку Беларуси ожидается усиление ветра порывами до 15?20 м/с. Оранжевый уровень опасности — погодные условия, представляющие реальную опасность, — шквалы, ливни, грозы, град, жара, морозы, снегопады, метели и пр. явления, которые могут негативно повлиять на социально-экономическую деятельность и привести к значительному материальному ущербу, также возможны человеческие жертвы. Синоптики выделяют 4 уровня опасности погодных явлений, обозначаются они зеленым, желтым, оранжевым и красным цветами.',
            tags: ['Погода', 'Сильный ветер']
        },
        {
            id: '12',
            title: 'Смазанная концовка. Почему минское "Динамо" вновь провалило плей-офф КХЛ',
            summary: 'После самого успешного регулярного сезона в истории минское «Динамо» вновь проваливается в первом же раунде плей-офф. После четвертого поражения от «Локомотива» SPORT.TUT.',
            createdAt: new Date('2017-03-02T16:31:44'),
            author: 'Николай Малышев',
            content: 'В течение всего сезона игра «зубров» была откровением для соперников. Лишь считаные команды КХЛ проповедуют столь дерзкий стиль игры. Минчане демонстрировали очень современный хоккей и показывали результат, обладая не самыми звездными исполнителями. Такая игра сначала ставила в тупик даже топ-клубы вроде московского «Динамо» и казанского «Ак Барса». Как только система начала сбоить, Крэйг Вудкрофт освежил ее благодаря добавлению сверхскоростных Петтерссона и Палушая. И минский локомотив летел вперед, пока не встретил «Локомотив» настоящий — ярославский.',
            tags: ['Хоккей', 'Динамо']
        },
        {
            id: '13',
            title: 'Дом балерин с ваннами на кухне. О сталинке за Большим театром, где жили звезды',
            summary: '«Дом балерин» находится за Большим театром оперы и балета на улице Пашкевич, 5. Четырехэтажное здание на три подъезда построили еще в 1935 году.',
            createdAt: new Date('2017-04-03T23:16:48'),
            author: 'Виталий Шидлов',
            content: 'С виду дом на улице Пашкевич — типичная сталинка вне пешеходных потоков, где из примечательных объектов — ресторан. Но старожилы еще помнят, как первый этаж дома со стороны театра занимали небольшие магазинчики — хлебный и антикварный. А потом — как под этот ресторан переделывали квартиру балерины.',
            tags: ['Дом балерин']
        },
        {
            id: '14',
            title: 'Полет над Атлантикой. Как купить самолет и привезти его через океан в январе',
            summary: 'Александр Центер в январе пригнал самолет из США. Пролетел тысячи километров над Атлантикой на легком винтовом Cessna 182.',
            createdAt: new Date('2017-03-02T12:23:12'),
            author: 'Татьяна Терентьева',
            content: '— Расскажите, как это — купить самолет? И почему решили покупать его в Америке? —  Ну, мы ж не первые, — Александр Центер кивает на цифру 490 — порядковый номер по белорусскому реестру, который уже нарисовали на фюзеляже. — Почему американский? Авиационный рынок примерно на 70% сконцентрирован в США, они законодатели мод, особенно по самолетам легких классов: Cessna, Piper. Традиционно их привозят из Америки, как автомобили: разбирают, снимают крылья, кладут в контейнер и везут на пароходе через океан, а здесь уже собирают. Второй путь, менее традиционный — перелет через Атлантику своим ходом, с посадками на промежуточных аэродромах. Обычно этот маршрут преодолевают весной или летом, но у нас так получилось это сделать зимой, в январе.',
            tags: ['Авиация']
        },
        {
            id: '15',
            title: 'Мингорисполком: "Газпром центр" будет достроен',
            summary: '«Газпром центр», стройку которого законсервировали 22 декабря, будет достроен. Об этом на пресс-конференции в Мингорисполкоме рассказал заместитель председателя Виктор Лаптев.',
            createdAt: new Date('2017-03-02T19:15:26'),
            author: 'Иван Иванов',
            content: '— Сейчас стройка законсервирована. Возможно, на сегодня это вопросы отношений заказчика с подрядчиком, — сказал Виктор Лаптев. — Но сегодня говорить о том, что стройка остановлена или она дальше осуществляться не будет, оснований никаких нет. Скажу так: у заказчика и инвестора желание завершать проект есть, так же, как и у города есть желание, чтобы проект реализовывался.',
            tags: ['Минск', 'Газпром центр']
        },
        {
            id: '16',
            title: 'Все страны Евросоюза одобрили безвизовый режим с Украиной ',
            summary: 'Сделан предпоследний шаг на пути к отмене виз для украинских граждан при въезде в ЕС. Все государства, входящие в Евросоюз, одобрили нововведение. Последнее слово — за Европарламентом.',
            createdAt: new Date('2017-03-02T15:41:31'),
            author: 'Виктор Петрович',
            content: 'Все 28 стран Европейского союза поддержали предложение предоставить гражданам Украины возможность на 90 дней въезжать в ЕС без виз. Послы государств — членов Евросоюза в четверг, 2 марта, одобрили неофициальное соглашение, касающееся либерализации визового режима с Украиной, которое было достигнуто 28 февраля Европарламентом и Советом ЕС. Теперь это нововведение будет вынесено на голосование в Европарламент, а затем передано в Европейский совет для принятия соответствующего закона.',
            tags: ['Евросоюз', 'Украина', 'Безвизовый режим']
        },
        {
            id: '17',
            title: 'Фонд Навального рассказал о "тайной недвижимости" Медведева',
            summary: 'Фонд борьбы с коррупцией Алексея Навального обнародовал расследование о резиденциях Дмитрия Медведева и о связанных с ним фондах, которые получили 70 млрд российских руб. в виде пожертвований.',
            createdAt: new Date('2017-03-02T15:12:59'),
            author: 'Виталий Шидлов',
            content: 'Глава правительства Дмитрий Медведев владеет «огромными участками земли в самых элитных районах, распоряжается яхтами, квартирами в старинных особняках, агрокомплексами и винодельнями в России и за рубежом». Об этом говорится в публикации Фонда борьбы с коррупцией Алексея Навального. Расследование было проведено на основе данных из Росреестра, выписок из разных реестров юридических лиц, а также на основе публикаций в СМИ и записей в социальных сетях.',
            tags: ['Россия', 'Медведев', 'Навальный']
        },
        {
            id: '18',
            title: 'Опра Уинфри задумалась об участии в президентских выборах из-за Трампа',
            summary: 'Американская телеведущая Опра Уинфри больше не исключает своего участия в президентских выборах в США — после избрания Дональда Трампа.',
            createdAt: new Date('2017-03-02T20:54:18'),
            author: 'Николай Малышев',
            content: 'В интервью телеканалу Bloomberg она заявила, что победа Трампа на выборах, несмотря на отсутствие у него политического опыта, заставила ее задуматься о возможности выставить собственную кандидатуру. 63-летняя телезвезда, которая на прошедших выборах поддерживала соперницу Трампа Хиллари Клинтон, ранее отмахивалась от любых вопросов о своих политических амбициях. Однако теперь она намекнула, что ее позиция уже не так категорична. «Я никогда даже не рассматривала подобную возможность», — сказала она, отвечая на вопрос об участии в выборах.',
            tags: ['США', 'Опра', 'Президентские выборы']
        },
        {
            id: '19',
            title: '"Кто поцарапает стены — будет 15 суток восстанавливать". Как министры открывали музей милиции',
            summary: 'Сегодня в Минске высокопоставленные чиновники торжественно открыли скульптуру городового и реконструированный Музей милиции.',
            createdAt: new Date('2017-03-02T11:13:37'),
            author: 'Иван Иванов',
            content: 'Около 12 часов дня возле одного из зданий МВД на Городском Валу стоят люди в погонах, чиновники и пресса. Обычных горожан просят обходить это место по противоположной стороне улицы. Сегодня здесь с участием главы МВД Игоря Шуневича открывают памятник городовому и реконструированный Музей милиции. На открытие также пришли глава Минска Андрей Шорец, министр обороны Андрей Равков, председатель Следственного комитета Иван Носкевич, глава МЧС Владимир Ващенко и министр культуры Борис Светлов. С памятника сняли покрывало, а Шуневич и Шорец произнесли короткие торжественные речи.',
            tags: ['Минск', 'Музей', 'Милиция']
        },
        {
            id: '20',
            title: 'Рыцари и битвы разных времен. В Верхнем городе пройдет большой исторический фестиваль ',
            summary: 'В пятницу в столице отмечают 950 лет со дня Битвы на Немиге, в связи с чем в Верхнем городе пройдет большой фестиваль исторической реконструкции.',
            createdAt: new Date('2017-03-02T20:18:38'),
            author: 'Татьяна Терентьева',
            content: 'Фестиваль «Рыцарство во все времена» начнется 3 марта, в 15.00, возле Ратуши. На нем реконструкторы покажут события и сражения разных эпох: от раннего Средневековья до конца 19-го века. На фестивале также будут работать интерактивные зоны — кузнецы и лучный тир. Кроме того, в 15.30 в Верхнем городе откроется Музей конки, который находится на улице Кирилла и Мефодия, 6.',
            tags: ['Минск', 'Фестиваль']
        }

    ];

    var tags = ['Авария', 'Авиация', 'Александр Лукашенко', 'Безвизовый режим', 'Беларусь', 'Белэкспо', 'Биатлон', 'Газпром центр', 'Грузия', 'Дальмайер', 'Динамо', 'Дом балерин', 'Домрачева', 'Евросоюз', 'Куропаты', 'Медведев', 'Милиция', 'Минск', 'Музей', 'Навальный', 'Налог на тунеядство', 'Опра', 'ПВТ', 'Погода', 'Президентские выборы', 'Путин', 'РЖД', 'Ратуша', 'Россия', 'США', 'Сильный ветер', 'Сирия', 'Тунеядцы', 'Украина', 'Фестиваль', 'Хоккей', 'Цепкало'];

    function addTag(tag) {
        if (tags.indexOf(tag) === -1) {
            tags.push(tag);
            tags.sort();
            return true;
        } else
            return false;
    }

    function removeTag(tag) {
        var fnd = tags.indexOf(tag);
        if (fnd != -1) {
            tags.splice(fnd, 1);
            return true;
        } else
            return false;
    }

    var numOfArticles = articles.length;

    function compareDate(a, b) {
        if (a.createdAt > b.createdAt)
            return -1;
        else
            return 1;
    }

    function isSatisfyingFilter(article, filter) {
        var ans = true;
        if (typeof filter != 'undefined') {
            if (typeof filter.author === 'string')
                if (article.author != filter.author)
                    ans = false;
            if (typeof filter.createdAtFrom === 'object')
                if (article.createdAt < filter.createdAtFrom)
                    ans = false;
            if (typeof filter.createdAtTo === 'object')
                if (article.createdAt > filter.createdAtTo)
                    ans = false;
            if (typeof filter.tags === 'object')
                filter.tags.forEach(
                    function (item, i, arr) {
                        var currtag = item;
                        var currans = false;
                        article.tags.forEach(
                            function (item, i, arr) {
                                if (item === currtag)
                                    currans = true;
                            }
                        );
                        if (currans == false)
                            ans = false;
                    }
                )
        }
        return ans;
    }

    function getArticles(skip, top, filter) {
        var filteredArticles = articles.filter(function (article) {
            var ans = true;
            if (typeof filter != 'undefined') {
                if (filter.author && filter.author != article.author)
                    ans = false;
                if (filter.createdAtFrom && article.createdAt < filter.createdAtFrom)
                    ans = false;
                if (filter.createdAtTo && article.createdAt < filter.createdAtTo)
                    ans = false;
                if (filter.tags != null)
                    filter.tags.forEach(
                        function (item, i, arr) {
                            var currtag = item;
                            var currans = false;
                            article.tags.forEach(
                                function (item, i, arr) {
                                    if (item === currtag)
                                        currans = true;
                                }
                            );
                            if (currans == false)
                                ans = false;
                        }
                    )
            }
            return ans;
        });
        filteredArticles.sort(compareDate);
        return filteredArticles.slice(skip, top);
    }

    function getArticle(id) {
        for (var i = 0; i < numOfArticles; i++) {
            if (articles[i].id === id)
                return articles[i];
        }
    }

    function validateArticle(article) {
        return (article.id && article.title && article.summary && article.content && article.author && article.tags);
    }

    function addArticle(article) {
        if (validateArticle(article)) {
            article.createdAt = new Date();
            if (articles.push(article) == numOfArticles + 1) {
                numOfArticles++;
                article.tags.forEach(
                    function (item, i, arr) {
                        addTag(item);
                    }
                );
                articles.sort(compareDate);
                tags.sort();
                return article.createdAt;
            } else
                return false;
        } else
            return false;

    }

    function createEmptyArticle() {
        return {
            id: '' + articles.length,
            title: '',
            summary: '',
            createdAt: new Date(),
            author: '',
            content: '',
            tags: ['']
        }
    }

    function editArticle(id, article) {
        var art = getArticle(id);
        if (typeof art === 'undefined')
            return false;
        else if (validateArticle(art)) {
            var check = [
                {
                    is: 0,
                    valid: 0
                },
                {
                    is: 0,
                    valid: 0
                },
                {
                    is: 0
                }
            ];
            if (typeof article.title === 'string') {
                check[0].is = 1;
                if (article.title.length <= 100)
                    check[0].valid = 1;
            }
            if (typeof article.summary === 'string') {
                check[1].is = 1;
                if (article.summary.length <= 200)
                    check[1].valid = 1;
            }
            if (typeof article.content === 'string')
                check[2].is = 1;
            if ((check[0].is + check[0].valid == 1) || (check[0].is + check[0].valid == 1))
                return false;
            else {
                if (check[0].is == 1)
                    art.title = article.title;
                if (check[1].is == 1)
                    art.summary = article.summary;
                if (check[2].is == 1)
                    art.content = article.content;
                art.createdAt = new Date();
                return true;
            }
        } else
            return false
    }

    function removeArticle(id) {
        return articles.splice(articles.indexOf(getArticle(id)), 1);
    }

    articles.forEach(function (article, i, arr) {
        if (!validateArticle(article))
            articles.splice(i, 1);
    });

    var users = ["Татьяна Терентьева", "Саша Кузьмина", "Виталий Шидлов", "Александр Новицкий", "Виктор Петрович", "Антон Тарлецкий", "Иван Иванов", "Сергей Иванов", "Николай Малышев"];
    users.sort();
    articles.sort(compareDate);

    return {
        getArticles: getArticles,
        getArticle: getArticle,
        addArticle: addArticle,
        editArticle: editArticle,
        removeArticle: removeArticle,
        createEmptyArticle: createEmptyArticle,
        articles: articles,
        users: users,
        tags: tags
    }

}());

var viewService = (function () {

    const states = ['feed', 'details', 'edit', 'add', 'login', 'submit', 'error'];
    var currentState = 'feed';
    var currentConfiguration = {
        currentState: 'feed'
    };
    var currentUser = "Иван Иванов";
    var currentArticlesList = articlesBaseService.articles;
    var currentShownArticlesList = currentArticlesList.slice(0, 9);
    var currentFilter = {};
    var currentPage = 1;
    var currentNumOfPages = articlesBaseService.articles.length;
    var currentArticle;


    function dateToString(date) {
        var months = ["SECRET KEY", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        var ret = date.getDate() + ' '
            + months[date.getMonth()] + ' '
            + date.getFullYear() + 'г. | '
            + date.getUTCHours() + ':'
            + date.getMinutes();
        return ret;
    }

    function setHeaders() {
        if (currentUser != null) {

            function handleMenu(event) {
                if (event.target.className == 'menu-item') {
                    if (event.target.textContent == 'Главная') {
                        currentState = 'feed';
                        currentPage = 1;
                        updateUI();
                    } else if (event.target.textContent == 'Добавить новость') {
                        currentArticle = {};
                        currentState = 'add';
                        updateUI();
                    }
                }
            }

            var userName = document.createElement("td");
            userName.innerHTML = '<b>' + currentUser + '</b>';
            var row = document.getElementsByClassName("top-menu")[0].firstElementChild.firstElementChild;
            row.insertBefore(userName, row.firstElementChild);
            var addNews = document.createElement("td");
            addNews.className = "menu-item";
            addNews.innerHTML = 'Добавить новость';
            row.insertBefore(addNews, row.lastElementChild);
            document.getElementsByClassName("top-menu")[0].addEventListener('click', handleMenu);
        }
        else {

        }
    }

    function init() {
        setHeaders();
        updateUI();
    }

    function setListeners() {
        function handleFilter(event) {
            if (event.target.id == 'name') {
                if (event.target.value == 'Все авторы')
                    currentFilter.author = null;
                else
                    currentFilter.author = event.target.value;
                currentPage = 1;
                updateDynamic();
            } else if (event.target.id == 'date') {

            } else if (event.target.id == 'tags') {
                if (event.target.value == 'Все теги')
                    currentFilter.tags = null;
                else
                    currentFilter.tags = [event.target.value];
                currentPage = 1;
                updateDynamic();
            }
        }

        function handleDetails(event) {
            if (event.target.className == 'news-cell') {
                currentArticle = articlesBaseService.getArticle(event.target.id);
                currentState = 'details';
                updateUI();
            }
        }

        function handleEdit(event) {
            if (event.target.className == 'news-cell') {
                currentArticle = articlesBaseService.getArticle(event.target.id);
                currentState = 'edit';
                updateUI();
            }
        }

        function handleSave() {
            if (currentState == 'edit') {
                var articleChanged = {};
                articleChanged.title = document.getElementById('title').value;
                articleChanged.summary = document.getElementById('summary').value;
                articleChanged.content = document.getElementById('content').value;
                articlesBaseService.editArticle(currentArticle.id, articleChanged);
                currentState = 'feed';
                updateUI();
            } else {
                currentArticle = articlesBaseService.createEmptyArticle();
                currentArticle.title = document.getElementById('title').value;
                currentArticle.summary = document.getElementById('summary').value;
                currentArticle.content = document.getElementById('content').value;
                currentArticle.author = currentUser;
                articlesBaseService.addArticle(currentArticle);
                currentState = 'feed';
                updateUI();
            }
        }

        function handleCancel() {
            currentState = 'feed';
            updateUI();
        }

        function handlePagination() {
            if (event.target.className == 'pagination-elem') {
                currentPage = parseInt(event.target.id);
                updateDynamic();
            }
        }

        if (currentState == 'feed') {
            var selectLi = document.getElementsByClassName("filter-list")[0].firstElementChild;
            while (selectLi != null) {
                selectLi.firstElementChild.addEventListener('change', handleFilter);
                selectLi = selectLi.nextElementSibling;
            }
            document.getElementsByClassName("news-table")[0].addEventListener('click', handleDetails);
            document.getElementsByClassName("news-table")[0].addEventListener('contextmenu', handleEdit);
            document.getElementsByClassName("pagination")[0].addEventListener('click', handlePagination);
        } else if (currentState == 'details') {

        } else if (currentState == 'edit' || currentState == 'add') {
            document.getElementsByClassName("edit-bot-right-col")[0].addEventListener('click', handleSave);
            document.getElementsByClassName("edit-bot-right-col")[1].addEventListener('click', handleCancel);
        }

    }

    function updateStatic() {
        var divMain = document.getElementById('main');
        divMain.parentNode.removeChild(divMain);
        divMain = document.createElement('div');
        divMain.id = 'main';
        if (currentState == 'feed') {
            divMain.className = 'feed';
            divMain.innerHTML =
                '<table class="central">'+
                '                   <tr>'+
                '<td class="left-panel">'+'</td>'+
                '                        <td>'+
                '                            <table class="news-table">'+
                '                                <tr>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                </tr>'+
                '                                <tr>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                </tr>'+
                '                                <tr>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                </tr>'+
                '                            </table>'+
                '                        </td>'+
                '                        <td class="right-panel">'+
                '                            <ul class="filter-list">'+
                '                                <li class="filter-element">'+
                '                                    <select class="filter" id="name">'+
                '                                        <option id="-1">'+'Все авторы'+'</option>'+
                '                                    </select>'+
                '                                </li>'+
                '                                <li class="filter-element">'+
                '                                    <select class="filter" id="date">'+
                '                                        <option id="-1">'+'Дата'+'</option>'+
                '                                    </select>'+
                '                                </li>'+
                '                                <li class="filter-element">'+
                '                                    <select class="filter" id="tags">'+
                '                                        <option id="-1">'+'Все теги'+'</option>'+
                '                                    </select>'+
                '                                </li>'+
                '                            </ul>'+
                '                        </td>'+
                '                    </tr>'+
                '                </table>'+
                '            </div>'+
                '            <table class="pagination">'+
                '                <tr>'+
                '                </tr>'+
                '            </table>';
            document.getElementsByClassName('ground')[0].insertBefore(divMain, document.getElementsByClassName('footer')[0]);
            currentFilter.author = null;
            currentFilter.tags = null;
            var selectUsers = document.getElementById('name');
            articlesBaseService.users.forEach(function (user, i) {
                var userOption = document.createElement('option');
                userOption.id = i;
                userOption.textContent = user;
                selectUsers.options[selectUsers.options.length] = userOption;
            });
            var selectTags = document.getElementById('tags');
            articlesBaseService.tags.forEach(function (tag, i) {
                var tagOption = document.createElement('option');
                tagOption.id = i;
                tagOption.appendChild(document.createTextNode(tag));
                selectTags.appendChild(tagOption);
            });
        } else if (currentState == 'details') {
            divMain.className = 'details-central';
            divMain.innerHTML =
                '<div class="details-title">' +
                '</div>' +
                '<div class="details-author">' +
                '</div>' +
                '<hr size="2" color="black">' +
                '<div class="details-content">' +
                '</div>' +
                '<div class="details-tags">';
            document.getElementsByClassName('ground')[0].insertBefore(divMain, document.getElementsByClassName('footer')[0]);
        } else if (currentState == 'edit' || currentState == 'add') {
            divMain.className = 'edit-central';
            divMain.innerHTML =
                '            <div class="edit-top">'+
                '                <table class="edit-central-table">'+
                '                    <tr class="edit-top">'+
                '                        <td class="edit-top-left-col">'+
                '                            Добавить / Редактировать новость'+
                '                        </td>'+
                '                        <td class="edit-top-right-col">'+
                '                        </td>'+
                '                    </tr>'+
                '                </table>'+
                '            </div>'+
                '            <div>'+
                '                <form>'+
                '                    <input class="edit-form" type="text" placeholder="Заголовок..." maxlength="100" id="title">'+
                '                </form>'+
                '            </div>'+
                '            <div>'+
                '                <form>'+
                '                    <textarea class="edit-form" placeholder="Краткое описание..." maxlength="200" id="summary"></textarea>'+
                '                </form>'+
                '            </div>'+
                '            <div>'+
                '                <form>'+
                '                    <input class="edit-form" type="text" placeholder="Теги..." id="tags">'+
                '                </form>'+
                '            </div>'+
                '            <div>'+
                '                <form>'+
                '                    <textarea class="edit-form-content" placeholder="Текст..." rows="10" id="content"></textarea>'+
                '                </form>'+
                '            </div>'+
                '            <div class="edit-bot">'+
                '                <table class="edit-central-table">'+
                '                    <tr>'+
                '                        <td class="edit-bot-left-col">'+
                '                        </td>'+
                '                        <td class="edit-bot-right-col">'+
                '                            Сохранить'+
                '                        </td>'+
                '                        <td class="edit-bot-right-col">'+
                '                            Отмена'+
                '                        </td>'+
                '                    </tr>'+
                '                </table>'+
                '            </div>';
            document.getElementsByClassName('ground')[0].insertBefore(divMain, document.getElementsByClassName('footer')[0]);
        }

    }

    function updateDynamic(action) {
        if (currentState == 'feed') {
            currentArticlesList = articlesBaseService.getArticles(0, articlesBaseService.articles.length, currentFilter);
            currentNumOfPages = (currentArticlesList.length + 8) / 9 | 0;
            currentShownArticlesList = currentArticlesList.slice((currentPage - 1) * 9, currentPage * 9);
            var newsTable = document.getElementsByClassName("news-table")[0];
            var row = newsTable.firstElementChild.firstElementChild;
            var td = row.firstElementChild;
            while (row != null) {
                while (td != null) {
                    if (td.firstElementChild != null)
                        td.removeChild(td.firstElementChild);
                    td = td.nextElementSibling;
                }
                row = row.nextElementSibling;
                if (row != null)
                    td = row.firstElementChild;
            }
            if (currentArticlesList.length > 0) {
                row = newsTable.firstElementChild.firstElementChild;
                td = row.firstElementChild;
                currentShownArticlesList.forEach(function (article) {
                    var cell = document.createElement("div");
                    cell.className = "news-cell";
                    cell.id = article.id;
                    var tempHTML =
                        '<span class="news-title">' + article.title + '</span>' + '\n' +
                        '<br>' + '\n' +
                        '<span class="author">' + article.author + '</span>' + '\n' +
                        '<hr size="2" color="white">' + '\n' +
                        '<span class="news-text">' + article.summary + '</span>' + '\n' +
                        '<br>' + '\n' +
                        '<br>' + '\n';
                    article.tags.forEach(function (tag) {
                        tempHTML += '<span class="tag">' + '#' + tag + '</span> ';
                    });
                    tempHTML +=
                        '' + '\n' +
                        '<hr size="1" color="lightgray">' + '\n' +
                        '' + dateToString(article.createdAt) + '\n'
                    ;
                    cell.innerHTML = tempHTML;
                    td.appendChild(cell);
                    td = td.nextElementSibling;
                    if (td == null) {
                        row = row.nextElementSibling;
                        if (row != null)
                            td = row.firstElementChild;
                    }
                });

                var paginationRow = document.getElementsByClassName('pagination')[0].firstElementChild.firstElementChild;
                while (paginationRow.firstElementChild != null)
                    paginationRow.removeChild(paginationRow.firstElementChild);

                    function addElemToPagination(row, id, content, ifChosen) {
                        var newElem = document.createElement('td');
                        newElem.id = id;
                        if (ifChosen)
                            newElem.className = 'pagination-elem-chosen';
                        else
                            newElem.className = 'pagination-elem';
                        newElem.innerHTML = content;
                        row.appendChild(newElem);
                    }

                    if (currentPage >= 3)
                        addElemToPagination(paginationRow, currentPage - 2, '...');
                    if (currentPage >= 2)
                        addElemToPagination(paginationRow, currentPage - 1, currentPage - 1);
                    addElemToPagination(paginationRow, currentPage, currentPage, true);
                    if (currentPage <= currentNumOfPages - 1)
                        addElemToPagination(paginationRow, currentPage + 1, currentPage + 1);
                    if (currentPage <= currentNumOfPages - 2)
                        addElemToPagination(paginationRow, currentPage + 2, '...');

            } else {
                var paginationRow = document.getElementsByClassName('pagination')[0].firstElementChild.firstElementChild;
                while (paginationRow.firstElementChild != null)
                    paginationRow.removeChild(paginationRow.firstElementChild);

            }
        } else if (currentState == 'details') {
            var detailsDiv = document.getElementsByClassName('details-central')[0];
            detailsDiv.getElementsByClassName('details-title')[0].textContent = currentArticle.title;
            detailsDiv.getElementsByClassName('details-author')[0].textContent = currentArticle.author;
            detailsDiv.getElementsByClassName('details-content')[0].textContent = currentArticle.content;
            var tagHTML = '';
            currentArticle.tags.forEach(function (tag) {
                tagHTML = tagHTML + '#' + tag + ' ';
            });
            detailsDiv.getElementsByClassName('details-tags')[0].textContent = tagHTML;
        } else if (currentState == 'edit') {
            document.getElementsByClassName('edit-top-right-col')[0].textContent = 'ID: ' + currentArticle.id;
            document.getElementsByClassName('edit-bot-left-col')[0].textContent = currentArticle.author + ', ' + dateToString(currentArticle.createdAt);
            document.getElementById('title').value = currentArticle.title;
            document.getElementById('summary').value = currentArticle.summary;
            var tagsInInput = '';
            currentArticle.tags.forEach(function (tag) {
               tagsInInput += '#' + tag;
            });
            document.getElementById('tags').value = tagsInInput;
            document.getElementById('content').value = currentArticle.content;
        } else if (currentState == 'add') {
            document.getElementsByClassName('edit-top-right-col')[0].textContent = 'ID: ' + articlesBaseService.articles.length;
            document.getElementsByClassName('edit-bot-left-col')[0].textContent = currentUser + ', ' + dateToString(new Date());
        }
        setListeners();
    }

    function updateUI(article, action) {
        if (currentState == 'feed') {

        } else if (currentState == 'details') {

        } else if (currentState == 'edit') {

        } else if (currentState == 'login') {

        } else if (currentState == 'submit') {

        } else if (currentState == 'error') {

        }
        updateStatic();
        updateDynamic(article, action);
    }

    return {
        currentFilter: currentFilter,
        updateUI: updateUI,
        dateToString: dateToString,
        init: init
    }

}());

viewService.init();
