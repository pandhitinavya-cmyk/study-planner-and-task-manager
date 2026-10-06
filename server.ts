import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent Database Directory & File
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data for the backend database
const initialSeedData = {
  profile: {
    name: 'Alex Rivera',
    course: 'Computer Science & Engineering',
    year: '3rd Year',
    semester: 'Semester 5',
    dailyAvailableHours: 3.5,
    preferredStudyTime: 'evening',
    currentEnergy: 'high',
    quickTimeBudget: null,
    studyPoints: 780,
    streakDays: 4,
    weeklyGoalHours: 24,
    onboardingCompleted: true,
  },
  subjects: [
    {
      id: 'sub-dbms',
      name: 'Database Management Systems',
      code: 'CS-302',
      color: '#6366f1',
      difficulty: 'hard',
      isWeakSubject: false,
      confidenceScore: 78,
      totalHoursStudied: 14.5,
      targetWeeklyHours: 6,
      performanceRating: 82,
      syllabusProgress: 65,
    },
    {
      id: 'sub-ai',
      name: 'Artificial Intelligence',
      code: 'CS-301',
      color: '#8b5cf6',
      difficulty: 'hard',
      isWeakSubject: true,
      confidenceScore: 54,
      totalHoursStudied: 8.0,
      targetWeeklyHours: 7,
      performanceRating: 61,
      syllabusProgress: 45,
    },
    {
      id: 'sub-java',
      name: 'Java Programming',
      code: 'CS-304',
      color: '#0ea5e9',
      difficulty: 'medium',
      isWeakSubject: false,
      confidenceScore: 84,
      totalHoursStudied: 12.0,
      targetWeeklyHours: 5,
      performanceRating: 88,
      syllabusProgress: 75,
    },
    {
      id: 'sub-maths',
      name: 'Discrete Mathematics',
      code: 'MA-301',
      color: '#f59e0b',
      difficulty: 'hard',
      isWeakSubject: true,
      confidenceScore: 48,
      totalHoursStudied: 7.5,
      targetWeeklyHours: 6,
      performanceRating: 52,
      syllabusProgress: 40,
    },
    {
      id: 'sub-datavis',
      name: 'Data Visualization',
      code: 'CS-308',
      color: '#10b981',
      difficulty: 'easy',
      isWeakSubject: false,
      confidenceScore: 90,
      totalHoursStudied: 9.0,
      targetWeeklyHours: 4,
      performanceRating: 94,
      syllabusProgress: 85,
    },
  ],
  exams: [
    {
      id: 'exam-dbms',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      title: 'DBMS Midterm Theory & SQL Exam',
      examDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      daysRemaining: 4,
      totalWeightage: 35,
      estimatedHoursNeeded: 12,
      preparedHours: 7.5,
      syllabusTopics: [
        'ER Modeling & Relational Schema',
        'Advanced SQL & Nested Joins',
        'Normalization (1NF, 2NF, 3NF, BCNF)',
        'Transaction Concurrency & ACID',
        'Indexing & B+ Trees',
      ],
      rescueModeActive: false,
    },
    {
      id: 'exam-ai',
      subjectId: 'sub-ai',
      subjectName: 'Artificial Intelligence',
      title: 'AI Midterm Examination',
      examDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      daysRemaining: 7,
      totalWeightage: 30,
      estimatedHoursNeeded: 15,
      preparedHours: 5,
      syllabusTopics: [
        'State Space Search & A* Search',
        'Alpha-Beta Minimax Pruning',
        'Propositional & First-Order Logic',
        'Bayesian Networks & Probability',
        'Intro to Neural Networks',
      ],
      rescueModeActive: false,
    },
    {
      id: 'exam-maths',
      subjectId: 'sub-maths',
      subjectName: 'Discrete Mathematics',
      title: 'Discrete Maths Quiz 2',
      examDate: new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0],
      daysRemaining: 11,
      totalWeightage: 20,
      estimatedHoursNeeded: 8,
      preparedHours: 3.5,
      syllabusTopics: [
        'Graph Theory & Euler Circuits',
        'Tree Traversals & Spanning Trees',
        'Recurrence Relations',
        'Combinatorics & Pigeonhole Principle',
      ],
      rescueModeActive: false,
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'DBMS Normalization & BCNF Assignment',
      type: 'assignment',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      deadline: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
      estimatedMinutes: 60,
      difficulty: 'hard',
      importance: 'critical',
      calculatedPriority: 'critical',
      priorityScore: 92,
      priorityReason: 'CRITICAL — Due tomorrow + difficult technical subject + DBMS exam in 4 days.',
      status: 'pending',
      progressPercent: 30,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: '05:00 PM - 06:00 PM',
      subtasks: [
        { id: 'st-1', title: 'Find Minimal Cover & Candidate Keys', completed: true, estimatedMinutes: 20 },
        { id: 'st-2', title: 'Solve 2NF & 3NF Decomposition Questions', completed: false, estimatedMinutes: 25 },
        { id: 'st-3', title: 'BCNF Lossless Dependency Check', completed: false, estimatedMinutes: 15 },
      ],
      notes: 'Focus on functional dependencies from slide set 4.',
      examId: 'exam-dbms',
    },
    {
      id: 'task-2',
      title: 'AI Search Algorithms (A* & Heuristics) Practice',
      type: 'exam_prep',
      subjectId: 'sub-ai',
      subjectName: 'Artificial Intelligence',
      deadline: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      estimatedMinutes: 45,
      difficulty: 'hard',
      importance: 'high',
      calculatedPriority: 'high',
      priorityScore: 78,
      priorityReason: 'HIGH PRIORITY — Weak subject alert + AI Exam in 7 days + hard topic.',
      status: 'pending',
      progressPercent: 20,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: '06:15 PM - 07:00 PM',
      subtasks: [
        { id: 'st-4', title: 'Trace Manhattan vs Euclidean Distance heuristics', completed: true, estimatedMinutes: 15 },
        { id: 'st-5', title: 'Solve 8-puzzle search tree on paper', completed: false, estimatedMinutes: 30 },
      ],
      examId: 'exam-ai',
    },
    {
      id: 'task-3',
      title: 'Java Multi-threading & Socket Client Project',
      type: 'project',
      subjectId: 'sub-java',
      subjectName: 'Java Programming',
      deadline: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
      estimatedMinutes: 90,
      difficulty: 'medium',
      importance: 'high',
      calculatedPriority: 'high',
      priorityScore: 68,
      priorityReason: 'HIGH PRIORITY — Semester project milestone + 90 mins deep work.',
      status: 'pending',
      progressPercent: 40,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: '07:30 PM - 09:00 PM',
      subtasks: [
        { id: 'st-6', title: 'Client-server handshake protocol', completed: true, estimatedMinutes: 30 },
        { id: 'st-7', title: 'Implement thread pool executor for incoming requests', completed: true, estimatedMinutes: 30 },
        { id: 'st-8', title: 'Handle packet timeout and graceful disconnection', completed: false, estimatedMinutes: 30 },
      ],
    },
  ],
  sessions: [
    {
      id: 'sess-1',
      taskId: 'task-1',
      taskTitle: 'DBMS Normalization & BCNF Assignment',
      subjectName: 'DBMS',
      subjectColor: '#6366f1',
      date: new Date().toISOString().split('T')[0],
      startTime: '17:00',
      endTime: '18:00',
      timeSlotString: '05:00 PM - 06:00 PM',
      durationMinutes: 60,
      isCompleted: false,
    },
    {
      id: 'sess-2',
      taskId: 'task-2',
      taskTitle: 'AI Search Algorithms (A* & Heuristics) Practice',
      subjectName: 'Artificial Intelligence',
      subjectColor: '#8b5cf6',
      date: new Date().toISOString().split('T')[0],
      startTime: '18:15',
      endTime: '19:00',
      timeSlotString: '06:15 PM - 07:00 PM',
      durationMinutes: 45,
      isCompleted: false,
    },
  ],
};

function readDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedData, null, 2), 'utf-8');
      return initialSeedData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return initialSeedData;
  }
}

function writeDb(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// RESTful CRUD & Database API Endpoints
// ==========================================

// Server Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'StudyPilot Backend Engine', timestamp: new Date().toISOString() });
});

// Full state snapshot
app.get('/api/data', (req, res) => {
  const db = readDb();
  res.json(db);
});

// Tasks CRUD
app.get('/api/tasks', (req, res) => {
  const db = readDb();
  res.json(db.tasks || []);
});

app.post('/api/tasks', (req, res) => {
  const db = readDb();
  const newTask = {
    ...req.body,
    id: req.body.id || `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.tasks = [newTask, ...(db.tasks || [])];
  writeDb(db);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const index = (db.tasks || []).findIndex((t: any) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  db.tasks[index] = { ...db.tasks[index], ...req.body };
  writeDb(db);
  res.json(db.tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.tasks = (db.tasks || []).filter((t: any) => t.id !== id);
  db.sessions = (db.sessions || []).filter((s: any) => s.taskId !== id);
  writeDb(db);
  res.json({ success: true, id });
});

// Subjects CRUD
app.get('/api/subjects', (req, res) => {
  const db = readDb();
  res.json(db.subjects || []);
});

app.post('/api/subjects', (req, res) => {
  const db = readDb();
  const newSubject = {
    ...req.body,
    id: req.body.id || `sub-${Date.now()}`,
  };
  db.subjects = [...(db.subjects || []), newSubject];
  writeDb(db);
  res.status(201).json(newSubject);
});

app.put('/api/subjects/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const index = (db.subjects || []).findIndex((s: any) => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Subject not found' });
  db.subjects[index] = { ...db.subjects[index], ...req.body };
  writeDb(db);
  res.json(db.subjects[index]);
});

app.delete('/api/subjects/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.subjects = (db.subjects || []).filter((s: any) => s.id !== id);
  writeDb(db);
  res.json({ success: true, id });
});

// Exams CRUD
app.get('/api/exams', (req, res) => {
  const db = readDb();
  res.json(db.exams || []);
});

app.post('/api/exams', (req, res) => {
  const db = readDb();
  const newExam = {
    ...req.body,
    id: req.body.id || `exam-${Date.now()}`,
  };
  db.exams = [...(db.exams || []), newExam];
  writeDb(db);
  res.status(201).json(newExam);
});

app.put('/api/exams/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const index = (db.exams || []).findIndex((e: any) => e.id === id);
  if (index === -1) return res.status(404).json({ error: 'Exam not found' });
  db.exams[index] = { ...db.exams[index], ...req.body };
  writeDb(db);
  res.json(db.exams[index]);
});

// Profile endpoints
app.get('/api/profile', (req, res) => {
  const db = readDb();
  res.json(db.profile || {});
});

app.put('/api/profile', (req, res) => {
  const db = readDb();
  db.profile = { ...(db.profile || {}), ...req.body };
  writeDb(db);
  res.json(db.profile);
});

// Reset database to seed
app.post('/api/reset-demo', (req, res) => {
  writeDb(initialSeedData);
  res.json({ success: true, message: 'Database reset to default hackathon seed data' });
});

// ==========================================
// AI Service Endpoints with Gemini 3.8 Flash
// ==========================================

// 1. AI Task Breakdown endpoint
app.post('/api/ai/breakdown', async (req, res) => {
  const { title, subject, estimatedHours, notes } = req.body;

  if (ai) {
    try {
      const prompt = `You are StudyPilot's academic task decomposition engine for college students.
Break down this student academic task or exam preparation goal into 4 to 6 actionable, realistic study subtasks.

Task Title: "${title}"
Subject: "${subject || 'General'}"
Estimated Total Hours: ${estimatedHours || 2}
Additional Context: "${notes || ''}"

Return ONLY valid JSON matching this schema:
{
  "subtasks": [
    {
      "title": "string (concrete action item)",
      "estimatedMinutes": number (between 15 and 90),
      "priority": "critical" | "high" | "medium" | "low",
      "difficulty": "easy" | "medium" | "hard",
      "notes": "string (brief key topic focus or practice tip)"
    }
  ],
  "studyTip": "string (one concise high-yield academic advice for this subject)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('Gemini breakdown fallback triggered:', err?.message || err);
    }
  }

  // Algorithmic Fallback for fast offline/demo reliability
  const cleanTitle = (title || 'Academic Task').toLowerCase();
  let defaultSubtasks = [
    { title: `Core Concepts & Lecture Review: ${title}`, estimatedMinutes: 45, priority: 'high', difficulty: 'medium', notes: 'Review lecture slides and main definitions' },
    { title: `In-depth Problem Solving & Practical Examples`, estimatedMinutes: 60, priority: 'critical', difficulty: 'hard', notes: 'Solve 3-5 typical assignment questions' },
    { title: `Synthesis & Formula/Summary Sheet Creation`, estimatedMinutes: 30, priority: 'medium', difficulty: 'easy', notes: 'Create 1-page quick revision sheet' },
    { title: `Self-Quiz & Past Paper Practice Check`, estimatedMinutes: 45, priority: 'high', difficulty: 'medium', notes: 'Test recall without notes for 30 mins' },
  ];

  if (cleanTitle.includes('dbms') || cleanTitle.includes('database')) {
    defaultSubtasks = [
      { title: 'ER Diagram & Relational Schema Mapping', estimatedMinutes: 35, priority: 'high', difficulty: 'medium', notes: 'Entity sets, relationships, key constraints' },
      { title: 'SQL Queries, Joins & Subqueries Practice', estimatedMinutes: 50, priority: 'critical', difficulty: 'hard', notes: 'Write queries for group by, having, nested joins' },
      { title: 'Normalization (1NF, 2NF, 3NF, BCNF)', estimatedMinutes: 45, priority: 'critical', difficulty: 'hard', notes: 'Functional dependencies & loss-less decompositions' },
      { title: 'Transactions, ACID Properties & Concurrency Control', estimatedMinutes: 40, priority: 'high', difficulty: 'medium', notes: '2PL, serializability, recovery protocols' },
      { title: 'Past Exam Question Solving & Edge Cases', estimatedMinutes: 30, priority: 'medium', difficulty: 'easy', notes: 'Review previous year university exam patterns' },
    ];
  } else if (cleanTitle.includes('java') || cleanTitle.includes('programming') || cleanTitle.includes('coding')) {
    defaultSubtasks = [
      { title: 'Architecture, Class Hierarchy & OOP Model', estimatedMinutes: 40, priority: 'high', difficulty: 'medium', notes: 'Define interfaces, abstract classes, encapsulation' },
      { title: 'Core Implementation & Algorithm Coding', estimatedMinutes: 75, priority: 'critical', difficulty: 'hard', notes: 'Implement primary business logic and data structures' },
      { title: 'Exception Handling & Unit Testing', estimatedMinutes: 35, priority: 'medium', difficulty: 'medium', notes: 'Add try-catch blocks and verify edge cases' },
      { title: 'Code Refactoring & Documentation / Javadoc', estimatedMinutes: 25, priority: 'low', difficulty: 'easy', notes: 'Clean comments, clean code, prepare submission README' },
    ];
  }

  return res.json({
    subtasks: defaultSubtasks,
    studyTip: 'Use active recall and Feynman technique: explain each concept simply without peeking at notes.',
  });
});

// 2. "What Should I Study Now?" Recommendation Engine
app.post('/api/ai/recommend-now', async (req, res) => {
  const { currentEnergy, availableHoursToday, tasks, exams, weakSubjects } = req.body;

  if (ai) {
    try {
      const prompt = `You are StudyPilot's intelligent decision engine.
A college student is asking: "What should I study right now?"
Current student state:
- Energy Mode: ${currentEnergy || 'normal'} (high = deep hard tasks, normal = balanced, low = light revision / flashcards)
- Available study time today: ${availableHoursToday || 3} hours
- Weak/Needs Attention Subjects: ${JSON.stringify(weakSubjects || [])}
- Upcoming Exams: ${JSON.stringify(exams || [])}
- Pending Tasks: ${JSON.stringify((tasks || []).slice(0, 8))}

Select the SINGLE BEST task for the student right now.
Provide:
1. Recommended task title and subject
2. Optimal session duration (25, 45, or 60 minutes)
3. Concise, compelling "Why this now" reason mentioning deadline urgency, exam proximity, weak subject priority, and energy alignment.
4. A concrete, immediate first action (under 15 words) to defeat procrastination.

Return ONLY valid JSON:
{
  "taskId": "string or matched title",
  "recommendedTask": "string",
  "subject": "string",
  "suggestedMinutes": number,
  "priorityLevel": "critical" | "high" | "medium",
  "reason": "string (e.g. High Priority — Exam in 3 days + difficult topic + matches high energy)",
  "firstStep": "string (concrete 5-minute kickoff instruction)",
  "energyFit": "string"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('Gemini recommend fallback triggered:', err?.message || err);
    }
  }

  // Algorithmic Recommendation Fallback
  return res.json({
    recommendedTask: 'DBMS Normalization & BCNF Practice',
    subject: 'DBMS',
    suggestedMinutes: 45,
    priorityLevel: 'critical',
    reason: 'Critical Priority — DBMS Midterm in 4 days + marked as weak topic + high exam weight.',
    firstStep: 'Open slide 4 of Chapter 3 and solve the first 3NF functional dependency exercise.',
    energyFit: currentEnergy === 'low' ? 'Switched to guided practice mode to accommodate lower energy' : 'Optimal high-focus slot',
  });
});

// 3. Exam Rescue Mode Engine
app.post('/api/ai/exam-rescue', async (req, res) => {
  const { examSubject, daysRemaining, syllabusOrTopics, dailyHours } = req.body;

  if (ai) {
    try {
      const prompt = `You are StudyPilot's "Exam Rescue Mode" strategist for students facing an upcoming exam in ${daysRemaining || 3} days.
Subject: "${examSubject}"
Available daily study time: ${dailyHours || 4} hours.
Topics/Focus: "${syllabusOrTopics || 'Full syllabus high-yield units'}"

Create an intensive, non-burnout revision plan that prioritizes the 80/20 highest-yield topics, builds in spaced review, active recall, and mandatory rest buffers.

Return ONLY valid JSON:
{
  "rescuePlan": [
    {
      "day": "Day 1" | "Day 2" | "Day 3" | "Day 4" | "Day 5",
      "focusTheme": "string",
      "sessions": [
        {
          "timeSlot": "string (e.g. 09:00 AM - 10:30 AM)",
          "topic": "string",
          "technique": "string (e.g. Active Recall / Past Papers / Summary Sheet)",
          "durationMinutes": number
        }
      ]
    }
  ],
  "emergencyAdvice": "string (3 bullet points of high-impact exam-day rules)",
  "highYieldChecklist": ["string", "string", "string", "string"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (err: any) {
      console.warn('Gemini rescue fallback:', err?.message || err);
    }
  }

  // Rescue Fallback
  return res.json({
    rescuePlan: [
      {
        day: 'Day 1',
        focusTheme: 'Foundational Theory & High-Weight Concepts',
        sessions: [
          { timeSlot: '09:00 AM - 10:15 AM', topic: `${examSubject} Unit 1 & 2 Core Theorems`, technique: 'Active Recall', durationMinutes: 75 },
          { timeSlot: '11:00 AM - 12:15 PM', topic: `${examSubject} Key Problem Sets`, technique: 'Past Papers', durationMinutes: 75 },
          { timeSlot: '04:30 PM - 05:45 PM', topic: `${examSubject} Weak Areas Deep Dive`, technique: 'Feynman Technique', durationMinutes: 75 },
        ],
      },
      {
        day: 'Day 2',
        focusTheme: 'Advanced Topics & Previous Year Questions',
        sessions: [
          { timeSlot: '09:00 AM - 10:30 AM', topic: `${examSubject} Advanced Modules & Edge Cases`, technique: 'Timed Drills', durationMinutes: 90 },
          { timeSlot: '02:00 PM - 03:15 PM', topic: `${examSubject} Mock Test (45 mins) + Review`, technique: 'Exam Simulation', durationMinutes: 75 },
          { timeSlot: '06:00 PM - 07:00 PM', topic: 'Formula & Diagram Memorization Sheet', technique: 'Spaced Repetition', durationMinutes: 60 },
        ],
      },
    ],
    emergencyAdvice: '1. Prioritize scoring questions first. 2. Sleep at least 7 hours before the exam. 3. Stop studying new topics 4 hours before the exam.',
    highYieldChecklist: [
      'Top 5 most frequent 10-mark long questions',
      'All standard architectural diagrams & schemas',
      'Key definitions and edge cases',
      'Formula / shortcut cheat sheet memorized',
    ],
  });
});

// Vite Middleware for development & static assets for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyPilot backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
