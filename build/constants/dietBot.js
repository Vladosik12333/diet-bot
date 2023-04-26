"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATED_CHAT_BY_ERROR = exports.UNKNWON_ERROR = exports.NOT_ENOUGH_RIGHTS = exports.MESSAGE_ON_WRAPPER_ERROR = exports.CANNOT_FIND_POLL = exports.MESSAGE_AFTER_GETTING_BAD_STATUS = exports.MESSAGE_AFTER_GETTING_NEEDED_STATUS = exports.NEEDED_STATUS = exports.MESSAGE_AFTER_CHANGING_PUNISHMENT = exports.POLL = exports.REPORT = exports.GREETING_MESSAGE = exports.RULES = void 0;
exports.RULES = 'ПРАВИЛА\n\n1. Харчуватись згідно графіку харчування.\n2. Можна один десерт на день після прийому їжі.\n3. Між прийомами їжі не можна харчуватись.\n4. 2 рази на тиждень можна замінити прийом їжі (тобто їсти те що хочете замість графіку на один прийом їжі).\n5. Якщо ніхто з участників групи не бачить що ви їсте - ви повині скинути сюди фото-відео звіт та після написати "/прийом їжі".\n6. В випадку відхилення звіту бот додасть вам фізичної активність і закріпить повідомлення з нею (по її виконаню ви повині відкріпити повідомлення).\n7. При порушенні правил ви отримаєту + фізичну активність і повині про це написати в групу (наприклад: Влад +100) згідно тої, яку ви встановили в "/фізична активність [від 0 до 999]" (дефолтно 100).';
exports.GREETING_MESSAGE = 'Привіт! Я бот, який створений для допомоги з пострункішенням. !УВАГА! Але для того щоб я міг працювати мені потрібно мати права Адміністратора з правом закріпляти повідомлення. !УВАГА!\n\nЯ допомогаю контролювати харчування, для цього ви можете використовувати наступні команди: \n/фізична активність [від 1 до 999] - для встановлення ціни питання за порушення правил; \n/прийом їжі - для того аби відзвітувати про прийом їжі, але перед цим потрібно відправити сам звіт (фото, відео);\n\nПісля команди /прийом їжі стоврюється голосування і потрібно другому участнику чату проголосувати. В позитивному випадку голосування звіт буде зараховано, в негативному відхилено та я напишу і закріплю повідомлення про ціну питання, його потрібно буде самому відкріпити по виконанні ціни питання.\n\nТакож я написав Правила повідомленням вище, ви можете їх закріпити та користуватись ними або замінити на свої.\n\nБажаю успіхів з цілями!';
exports.REPORT = {
    PENDING: function (username) {
        return "@".concat(username, " , \u0432\u0430\u0448 \u0437\u0432\u0456\u0442 \u043F\u0440\u043E \u043F\u0440\u0438\u0439\u043E\u043C \u0457\u0436\u0456 \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u0438\u0439. \u041E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F \u0439\u043E\u0433\u043E \u0437\u0430\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u043D\u044F!");
    },
    APPROVED: function (username) {
        return "@".concat(username, ", \u0432\u0430\u0448 \u0437\u0432\u0456\u0442 \u043F\u0440\u043E \u043F\u0440\u0438\u0439\u043E\u043C \u0457\u0436\u0456 \u043F\u0440\u0438\u0439\u043D\u044F\u0442\u0438\u0439!");
    },
    REJECTED: function (username) {
        return "@".concat(username, ", \u0432\u0430\u0448 \u0437\u0432\u0456\u0442 \u043F\u0440\u043E \u043F\u0440\u0438\u0439\u043E\u043C \u0457\u0436\u0456 \u0432\u0456\u0434\u0445\u0438\u043B\u0435\u043D\u0438\u0439!");
    },
    MESSAGE_AFTER_APPROVED: function (name, activity) {
        return "".concat(name, " +").concat(activity);
    },
};
exports.POLL = {
    QUESTION: 'Прийом їжі прийнятий?',
    OPTION_1: 'Так',
    OPTION_2: 'Ні',
};
var MESSAGE_AFTER_CHANGING_PUNISHMENT = function (username, activity) {
    return "@".concat(username, " , \u0432\u0430\u0448\u0430 \u0444\u0456\u0437\u0438\u0447\u043D\u0430 \u0430\u043A\u0442\u0438\u0432\u043D\u0456\u0441\u0442\u044C \u0437\u0430 \u043F\u043E\u0440\u0443\u0448\u0435\u043D\u043D\u044F \u043F\u0440\u0430\u0432\u0438\u043B \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u043D\u0430 ").concat(activity);
};
exports.MESSAGE_AFTER_CHANGING_PUNISHMENT = MESSAGE_AFTER_CHANGING_PUNISHMENT;
exports.NEEDED_STATUS = 'administrator';
exports.MESSAGE_AFTER_GETTING_NEEDED_STATUS = 'Я почав працювати.';
exports.MESSAGE_AFTER_GETTING_BAD_STATUS = 'Ви забрали в мене потрібні права, тому я перестав працювати.\nP.S. Мені потрібно видати права Адміністратор - право прикріпляти повідомлення.';
exports.CANNOT_FIND_POLL = 'Не вдалось знайти потрібного опиту.';
var MESSAGE_ON_WRAPPER_ERROR = function (message, error) {
    return "\u0422\u0440\u0430\u043F\u0438\u043B\u0430\u0441\u044C \u043F\u043E\u043C\u0438\u043B\u043A\u0430 - ".concat(message, "\n\u041E\u0431'\u0454\u043A\u0442 \u043F\u043E\u043C\u0438\u043B\u043A\u0438:\n").concat(error);
};
exports.MESSAGE_ON_WRAPPER_ERROR = MESSAGE_ON_WRAPPER_ERROR;
exports.NOT_ENOUGH_RIGHTS = 'Я не маю потрібних прав для роботи. Мені потрібно видати права Адміністратор - право прикріпляти повідомлення.';
exports.UNKNWON_ERROR = 'Невідома помилка';
exports.CREATED_CHAT_BY_ERROR = 'Трапилась помилка і були перестворені деякі дані. Потрібно видати права Адміністратор - право прикріпляти повідомлення та ввести команду повторно.';
