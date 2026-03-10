export default {
  locale: {
    en: 'En',
    ru: 'Ru'
  },
  pages: {
    about: 'About',
    contact: 'Contact',
    docs: 'Docs',
    home: 'Home',
    dashboard: 'Dashboard',
  },
  project: {
    title: 'Title',
    description: 'Description',
    createdAt: 'Created At',
    deadline: 'Deadline',
    status: 'Status',
    createdBy: 'Created By',
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
  btn: {
    allProjects: 'All projects',
    myProjects: 'My projects',
    add: 'Create',
    changeRole: 'Change Role',
    projects: 'Projects',
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
    inProcess: 'InProcess',
    completed: 'Completed',
    abandoned: 'Abandoned',
    frozen: 'Frozen',
  },
  error: {
    project: {
      notFound: "Project not found",
      idRequired: 'Project ID required',
      fetchAll: 'Failed to fetch all projects',
      fetchMy: 'Failed to fetch my projects',
      searchFailed: 'Failed to search projects',
      deadlineEarlier: 'The deadline cannot be earlier than the creation of the project.',
      addEdit: 'Operation failed, please check your project details.',
      create: 'Failed to create project',
      update: 'Failed to update project.',
      delete: 'Failed to delete project.',
    },
    status: {
      statusId: 'Status ID required',
      notFound: 'Statuses not found',
      get: "Get statuses is failed",
    },
    form: {
      fieldsEmpty: 'The fields are empty.',
    },
    auth: {
      credentials: 'Invalid credentials',
      signIn: 'Sign In error',
      passwordLength: 'Password must be at least 6 character.',
      loginOrPasswordInvalid: 'The login or password is incorrect. Please try again.',
      onlyEnglish: 'Only English characters allowed.',
      selectGender: 'Please select a gender.',
      passwordsNotMatch: 'Password does not match.',
      nameLength: 'Name length must be at least 3 characters.',
      emailExist: 'Email already exist.',
      unAuth: 'Unauthorized',
      logoutFailed: 'Logout failed.',
      register: 'Register failed.',
    },
    user: {
      notFound: "User not found",
      idRequired: 'User ID required',
      onlyCreator: 'Only the creator of the project can do it.',
      chooseUserAndRole: 'Please choose a user and a role.',
      loadUsers: 'Failed to load users.',
      get: 'Get user is failed'
    },
    role: {
      idNotFound: 'Role ID not found',
      assignRole: 'Couldn\'t assign a role.',
      roleUserNotFound: 'Role USER not found',
      creatorForever: 'You can\'t change your role!',
      change: "Change role if failed",
      get: "Get role is failed",
    },
    data: {
      notFound: 'Data not found',
    }
  }
}
