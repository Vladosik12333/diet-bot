export const RULES =
    'ПРАВИЛА\n\n1. Харчуватись згідно графіку харчування.\n2. Можна один десерт на день після прийому їжі.\n3. Між прийомами їжі не можна харчуватись.\n4. 2 рази на тиждень можна замінити прийом їжі (тобто їсти те що хочете замість графіку на один прийом їжі).\n5. Якщо ніхто з участників групи не бачить що ви їсте - ви повині скинути сюди фото-відео звіт та після написати "/прийом їжі".\n6. В випадку відхилення звіту бот додасть вам фізичної активність і закріпить повідомлення з нею (по її виконаню ви повині відкріпити повідомлення).\n7. При порушенні правил ви отримаєту + фізичну активність і повині про це написати в групу (наприклад: Влад +100) згідно тої, яку ви встановили в "/фізична активність [від 0 до 999]" (дефолтно 100).';

export const GREETING_MESSAGE =
    'Привіт! Я бот, який створений для допомоги з пострункішенням. !УВАГА! Але для того щоб я міг працювати мені потрібно мати права Адміністратора з правом закріпляти повідомлення. !УВАГА!\n\nЯ допомогаю контролювати харчування, для цього ви можете використовувати наступні команди: \n/фізична активність [від 1 до 999] - для встановлення ціни питання за порушення правил; \n/прийом їжі - для того аби відзвітувати про прийом їжі, але перед цим потрібно відправити сам звіт (фото, відео);\n\nПісля команди /прийом їжі стоврюється голосування і потрібно другому участнику чату проголосувати. В позитивному випадку голосування звіт буде зараховано, в негативному відхилено та я напишу і закріплю повідомлення про ціну питання, його потрібно буде самому відкріпити по виконанні ціни питання.\n\nТакож я написав Правила повідомленням вище, ви можете їх закріпити та користуватись ними або замінити на свої.\n\nБажаю успіхів з цілями!';

export const REPORT = {
    PENDING(username: string) {
        return `@${username} , ваш звіт про прийом їжі отриманий. Очікується його затвердження!`;
    },
    APPROVED(username: string) {
        return `@${username}, ваш звіт про прийом їжі прийнятий!`;
    },
    REJECTED(username: string) {
        return `@${username}, ваш звіт про прийом їжі відхилений!`;
    },
    MESSAGE_AFTER_APPROVED(name: string, activity: number) {
        return `${name} +${activity}`;
    },
};

export const POLL = {
    QUESTION: 'Прийом їжі прийнятий?',
    OPTION_1: 'Так',
    OPTION_2: 'Ні',
};

export const MESSAGE_AFTER_CHANGING_PUNISHMENT = (
    username: string,
    activity: number
) =>
    `@${username} , ваша фізична активність за порушення правил встановлена на ${activity}`;

export const NEEDED_STATUS = 'administrator';

export const MESSAGE_AFTER_GETTING_NEEDED_STATUS = 'Я почав працювати.';

export const CANNOT_FIND_ACTION =
    'Не вдалось знайти потрібну дію, будь-ласка видаліть та добавте бота в чат.';

export const MESSAGE_ON_WRAPPER_ERROR = (message: string, error: string) =>
    `Трапилась помилка - ${message}.\nОб'єкт помилки:\n${error}`;

export const NOT_ENOUGH_RIGHTS =
    'Я не маю потрібних прав для роботи. Мені потрібно видати права Адміністратор - право прикріпляти повідомлення.';

export const UNKNWON_ERROR = 'Невідома помилка';
