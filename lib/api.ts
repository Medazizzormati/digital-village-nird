// Configuration API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ============ TYPES ============

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'director' | 'public' | 'admin' | 'super_admin';
  permissions: string[];
  avatar?: string;
  bio?: string;
  roleData?: {
    student?: { grade?: string; school?: string; classId?: string };
    teacher?: { subject?: string; school?: string; classes?: string[] };
    director?: { establishment?: string; establishmentType?: string; region?: string };
    admin?: { department?: string; accessLevel?: number };
  };
  xp: number;
  level: number;
  badges: Badge[];
  completedSteps: number[];
  quizScores: QuizScore[];
  stats: UserStats;
  streak: Streak;
  preferences: UserPreferences;
  isVerified: boolean;
  createdAt: string;
}

export interface Badge {
  badgeId: string;
  name?: string;
  description?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}

export interface QuizScore {
  stage: number;
  score: number;
  totalQuestions: number;
  timeSpent?: number;
  completedAt: string;
}

export interface UserStats {
  totalQuizzesTaken: number;
  totalCorrectAnswers: number;
  totalTimeSpent: number;
  loginCount: number;
  lastLogin?: string;
}

export interface Streak {
  current: number;
  best: number;
  lastActivity: string;
}

export interface UserPreferences {
  language: string;
  theme: string;
  notifications: { email: boolean; push: boolean };
}

export interface Class {
  _id: string;
  name: string;
  description?: string;
  code: string;
  teacher: string;
  students: User[];
  establishment: string;
  grade: string;
  subject?: string;
  academicYear: string;
  stats: ClassStats;
  goals: ClassGoal[];
  isActive: boolean;
  createdAt: string;
}

export interface ClassStats {
  avgProgress: number;
  avgXP: number;
  totalQuizzesTaken: number;
  avgQuizScore: number;
}

export interface ClassGoal {
  stepId: number;
  deadline: string;
  completed: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  errors?: { msg: string; path: string }[];
}

export interface ProgressResponse {
  success: boolean;
  message?: string;
  data?: {
    completedSteps: number[];
    xp: number;
    level: number;
    badges: Badge[];
    quizScores: QuizScore[];
    streak: Streak;
    xpGained?: number;
    newBadges?: string[];
    newBadge?: string;
  };
}

// ============ HELPER FETCH ============

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }

  return data;
}

// ============ AUTH API ============

export const authAPI = {
  register: async (name: string, email: string, password: string, role: string = 'public', roleData?: object): Promise<AuthResponse> => {
    const data = await fetchAPI<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, roleData }),
    });

    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    return fetchAPI('/auth/me');
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  updateProfile: async (data: { name?: string; bio?: string; preferences?: Partial<UserPreferences>; roleData?: object }): Promise<AuthResponse> => {
    return fetchAPI('/auth/updateprofile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
    return fetchAPI('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  getRoleInfo: async (): Promise<{ success: boolean; data: object }> => {
    return fetchAPI('/auth/role-info');
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  hasRole: (...roles: string[]): boolean => {
    const user = authAPI.getUser();
    return user ? roles.includes(user.role) : false;
  },

  hasPermission: (permission: string): boolean => {
    const user = authAPI.getUser();
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  },
};

// ============ PROGRESS API ============

export const progressAPI = {
  getProgress: async (): Promise<ProgressResponse> => {
    return fetchAPI('/progress');
  },

  completeStep: async (stepId: number): Promise<ProgressResponse> => {
    const data = await fetchAPI<ProgressResponse>(`/progress/step/${stepId}`, { method: 'POST' });
    if (data.success && data.data) {
      const user = authAPI.getUser();
      if (user) {
        user.completedSteps = data.data.completedSteps;
        user.xp = data.data.xp;
        user.level = data.data.level;
        user.badges = data.data.badges;
        user.streak = data.data.streak;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    return data;
  },

  uncompleteStep: async (stepId: number): Promise<ProgressResponse> => {
    const data = await fetchAPI<ProgressResponse>(`/progress/step/${stepId}`, { method: 'DELETE' });
    if (data.success && data.data) {
      const user = authAPI.getUser();
      if (user) {
        user.completedSteps = data.data.completedSteps;
        user.xp = data.data.xp;
        user.level = data.data.level;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    return data;
  },

  saveQuizScore: async (stage: number, score: number, totalQuestions: number): Promise<ProgressResponse> => {
    return fetchAPI('/progress/quiz', {
      method: 'POST',
      body: JSON.stringify({ stage, score, totalQuestions }),
    });
  },

  getLeaderboard: async (limit: number = 10): Promise<{
    success: boolean;
    data: { rank: number; name: string; role: string; xp: number; level: number; badgeCount: number; completedSteps: number }[];
  }> => {
    return fetchAPI(`/progress/leaderboard?limit=${limit}`);
  },

  getGlobalStats: async (): Promise<{
    success: boolean;
    data: { totalUsers: number; totalXP: number; avgCompletion: number; totalSteps: number };
  }> => {
    return fetchAPI('/progress/stats');
  },
};

// ============ TEACHER API ============

export const teacherAPI = {
  // Classes
  createClass: async (data: { name: string; description?: string; grade: string; subject?: string; establishment?: string }): Promise<{ success: boolean; data: Class }> => {
    return fetchAPI('/teacher/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyClasses: async (): Promise<{ success: boolean; count: number; data: Class[] }> => {
    return fetchAPI('/teacher/classes');
  },

  getClassById: async (classId: string): Promise<{ success: boolean; data: Class }> => {
    return fetchAPI(`/teacher/classes/${classId}`);
  },

  updateClass: async (classId: string, data: Partial<Class>): Promise<{ success: boolean; data: Class }> => {
    return fetchAPI(`/teacher/classes/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteClass: async (classId: string): Promise<{ success: boolean; message: string }> => {
    return fetchAPI(`/teacher/classes/${classId}`, { method: 'DELETE' });
  },

  // Students
  addStudentToClass: async (classId: string, studentEmail: string): Promise<{ success: boolean; message: string; data: object }> => {
    return fetchAPI(`/teacher/classes/${classId}/students`, {
      method: 'POST',
      body: JSON.stringify({ studentEmail }),
    });
  },

  removeStudentFromClass: async (classId: string, studentId: string): Promise<{ success: boolean; message: string }> => {
    return fetchAPI(`/teacher/classes/${classId}/students/${studentId}`, { method: 'DELETE' });
  },

  getStudentProgress: async (studentId: string): Promise<{ success: boolean; data: object }> => {
    return fetchAPI(`/teacher/students/${studentId}/progress`);
  },

  // Join class (for students)
  joinClassByCode: async (code: string): Promise<{ success: boolean; message: string; data: { classId: string; className: string; xpGained: number } }> => {
    return fetchAPI('/teacher/classes/join', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  // Export
  exportClassData: async (classId: string): Promise<{ success: boolean; data: object }> => {
    return fetchAPI(`/teacher/classes/${classId}/export`);
  },
};

// ============ ADMIN API ============

export const adminAPI = {
  // Users
  getAllUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }): Promise<{
    success: boolean;
    data: User[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return fetchAPI(`/admin/users${query ? `?${query}` : ''}`);
  },

  getUserById: async (userId: string): Promise<{ success: boolean; data: User }> => {
    return fetchAPI(`/admin/users/${userId}`);
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<{ success: boolean; data: User }> => {
    return fetchAPI(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changeUserRole: async (userId: string, role: string): Promise<{ success: boolean; message: string; data: { id: string; role: string; permissions: string[] } }> => {
    return fetchAPI(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    return fetchAPI(`/admin/users/${userId}`, { method: 'DELETE' });
  },

  // Stats
  getGlobalStats: async (): Promise<{ success: boolean; data: object }> => {
    return fetchAPI('/admin/stats');
  },

  getRecentActivity: async (limit?: number): Promise<{ success: boolean; data: { recentUsers: User[]; recentQuizzes: object[] } }> => {
    return fetchAPI(`/admin/activity${limit ? `?limit=${limit}` : ''}`);
  },

  // Roles
  getRoles: async (): Promise<{ success: boolean; data: { id: string; name: string; permissions: string[] }[] }> => {
    return fetchAPI('/admin/roles');
  },
};

// ============ SYNC HELPER ============

export const syncUserFromAPI = async (): Promise<User | null> => {
  try {
    const response = await authAPI.getMe();
    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    console.error('Erreur sync user:', error);
    authAPI.logout();
  }
  return null;
};

// ============ ROLE HELPERS ============

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  DIRECTOR: 'director',
  PUBLIC: 'public',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const ROLE_LABELS: Record<string, { label: string; emoji: string; description: string }> = {
  student: { label: 'Étudiant / Lycéen', emoji: '🎓', description: 'Apprenez NIRD et gagnez des badges' },
  teacher: { label: 'Enseignant / Formateur', emoji: '👨‍🏫', description: 'Créez des classes et suivez vos élèves' },
  director: { label: 'Direction', emoji: '🏫', description: 'Gérez votre établissement' },
  public: { label: 'Grand Public', emoji: '👥', description: 'Découvrez NIRD librement' },
  admin: { label: 'Administrateur', emoji: '⚙️', description: 'Gérez la plateforme' },
  super_admin: { label: 'Super Admin', emoji: '🛡️', description: 'Accès complet' },
};
