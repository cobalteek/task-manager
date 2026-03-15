export default {
  locale: {
    en: 'En',
    ru: 'Ru'
  },
  pages: {
    about: 'About',
    contact: 'Contact',
    docs: 'License',
    home: 'Home',
    dashboard: 'Dashboard',
  },
  table: {
    title: 'Title',
    description: 'Description',
    createdAt: 'Created At',
    deadline: 'Deadline',
    status: 'Status',
    createdBy: 'Created By',
    handler: 'Handler',
    doneAt: 'Done At',
    selectHandler: 'Select a handler',
  },
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: 'No account?',
    haveAccount: 'Have an account?',
    email: 'Email',
    password: 'Password',
  },
  form: {
    placeholder: {
      search: 'Search',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
    }
  },
  home: {
    title: 'Home page'
  },
  btn: {
    allProjects: 'All projects',
    myProjects: 'My projects',
    allTasks: 'All tasks',
    myTasks: 'My tasks',
    add: 'Create',
    changeRole: 'Change Role',
    projects: 'Projects',
    tasks: 'Tasks',
    back: 'Back',
    save: 'Save',
    delete: 'Delete',
    set: 'Set',
    close: 'Close',
    cross: '×'
  },
  select: {
    selectUser: 'Select user',
    selectRole: 'Select role',
  },
  user: {
    name: 'Name',
    email: 'Email',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    role: 'Role',
  },
  role: {
    user: 'User',
    admin: 'Admin',
    owner: 'Owner'
  },
  message: {
    hello: 'Hello',
  },
  status: {
    notStarted: 'Not Started',
    inProcess: 'In Process',
    completed: 'Completed',
    abandoned: 'Abandoned',
    frozen: 'Frozen',
  },
  error: {
    notFound: 'Not Found',
    project: {
      notFound: 'Project not found',
      idRequired: 'Project ID required',
      fetchAll: 'Failed to fetch all projects',
      fetchMy: 'Failed to fetch my projects',
      searchFailed: 'Failed to search projects',
      deadlineEarlier: 'The deadline cannot be earlier than the creation date of the project.',
      addEdit: 'Operation failed, please check your project details.',
      create: 'Failed to create project',
      update: 'Failed to update project.',
      delete: 'Failed to delete project.',
    },
    status: {
      statusId: 'Status ID required',
      notFound: 'Statuses not found',
      get: 'Failed to get statuses',
    },
    form: {
      fieldsEmpty: 'The fields are empty.',
    },
    auth: {
      credentials: 'Invalid credentials',
      signIn: 'Sign in error',
      passwordLength: 'Password must be at least 6 characters.',
      loginOrPasswordInvalid: 'The login or password is incorrect. Please try again.',
      onlyEnglish: 'Only English characters allowed.',
      selectGender: 'Please select a gender.',
      passwordsNotMatch: 'Passwords do not match.',
      nameLength: 'Name length must be at least 3 characters.',
      emailExist: 'Email already exists.',
      unAuth: 'Unauthorized',
      logoutFailed: 'Logout failed.',
      register: 'Register failed.',
    },
    user: {
      notFound: 'User not found',
      idRequired: 'User ID required',
      onlyCreator: 'Only the creator of the project can do it.',
      onlyOwner: 'Only owner can do it.',
      chooseUserAndRole: 'Please choose a user and a role.',
      loadUsers: 'Failed to load users.',
      get: 'Failed to get user'
    },
    role: {
      idNotFound: 'Role ID not found',
      assignRole: 'Couldn’t assign a role.',
      roleUserNotFound: 'Role USER not found',
      creatorForever: 'You can’t change your role!',
      change: 'Failed to change role',
      get: 'Failed to get role',
    },
    data: {
      notFound: 'Data not found',
    }
  }
}
