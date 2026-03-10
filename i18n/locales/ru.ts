export default {
  locale: {
    en: 'En',
    ru: 'Ru'
  },
  pages: {
    about: 'О нас',
    contact: 'Контакты',
    docs: 'Документация',
    home: 'Главная',
    dashboard: 'Панель управления',
  },
  project: {
    title: 'Название',
    description: 'Описание',
    createdAt: 'Дата создания',
    deadline: 'Срок сдачи',
    status: 'Статус',
    createdBy: 'Создан',
  },
  auth: {
    signIn: 'Войти',
    signUp: 'Регистрация',
    noAccount: 'Нет аккаунта?',
    haveAccount: 'Есть аккаунт?',
    email: 'Почта',
    password: 'Пароль',
  },
  form: {
    placeholder: {
      search: 'Поиск',
      name: 'Имя',
      email: 'Почта',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
    },
  },
  home: {
    title: 'Главная страница'
  },
  btn: {
    allProjects: 'Все проекты',
    myProjects: 'Мои проекты',
    add: 'Создать',
    changeRole: 'Изменить роль',
    projects: 'Проекты',
    save: 'Сохранить',
    delete: 'Удалить',
    set: 'Установить',
    close: 'Закрыть',
    cross: '×'
  },
  select: {
    selectUser: 'Пользователь',
    selectRole: 'Выберите роль',
  },
  user: {
    name: 'Имя',
    email: 'Почта',
    gender: 'Пол',
    male: 'Мужской',
    female: 'Женский',
    role: 'Роль',
  },
  role: {
    user: 'Пользователь',
    admin: 'Администратор',
    owner: 'Владелец'
  },
  message: {
    hello: 'Привет',
  },
  status: {
    notStarted: 'Не начат',
    inProcess: 'В процессе',
    completed: 'Завершён',
    abandoned: 'Брошен',
    frozen: 'Заморожен',
  },
  error: {
    project: {
      notFound: 'Проект не найден',
      idRequired: 'Требуется ID проекта',
      fetchAll: 'Не удалось загрузить все проекты.',
      fetchMy: 'Не удалось загрузить мои проекты.',
      searchFailed: 'Не удалось выполнить поиск проектов.',
      deadlineEarlier: 'Срок сдачи не может быть раньше даты создания проекта.',
      addEdit: 'Операция не удалась, пожалуйста, проверьте данные проекта.',
      create: 'Не удалось создать проект.',
      update: 'Не удалось обновить проект.',
      delete: 'Не удалось удалить проект.',
    },
    status: {
      statusId: 'Требуется ID статуса',
      notFound: 'Статусы не найдены',
      get: 'Не удалось получить статусы',
    },
    form: {
      fieldsEmpty: 'Поля для заполнения пусты.',
    },
    auth: {
      credentials: 'Неверные учётные данные',
      signIn: 'Ошибка входа',
      passwordLength: 'Пароль должен содержать не менее 6 символов.',
      loginOrPasswordInvalid: 'Введён неверный логин или пароль. Пожалуйста, попробуйте снова.',
      onlyEnglish: 'Разрешены только латинские символы.',
      selectGender: 'Пожалуйста, выберите пол.',
      passwordsNotMatch: 'Пароли не совпадают.',
      nameLength: 'Длина имени должна быть не менее 3 символов.',
      emailExist: 'Данная почта уже зарегистрирована.',
      unAuth: 'Не авторизован',
      logoutFailed: 'Не удалось выйти из аккаунта.',
    },
    user: {
      notFound: 'Пользователь не найден',
      idRequired: 'Требуется ID пользователя',
      onlyCreator: 'Только создатель проекта может выполнить это действие.',
      chooseUserAndRole: 'Пожалуйста, выберите пользователя и роль.',
      loadUsers: 'Не удалось загрузить пользователей.',
      get: 'Не удалось получить пользователя',
    },
    role: {
      idNotFound: 'ID роли не найден',
      assignRole: 'Не удалось назначить роль.',
      roleUserNotFound: 'Роль USER не найдена',
      creatorForever: 'Вы не можете изменить свою роль!',
      change: 'Не удалось изменить роль',
      get: 'Не удалось получить роль',
    },
    data: {
      notFound: 'Данные не найдены',
    }
  }
}
