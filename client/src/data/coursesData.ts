export interface Instructor {
  id?: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  company?: string;
}

export interface Lesson {
  id: string;
  lessonId: string;
  title: string;
  lessonTitle: string;
  duration: string;
  durationMinutes: number;
  type: 'video' | 'online' | 'offline' | 'pdf' | 'link';
  lessonType: 'video' | 'online' | 'offline' | 'pdf' | 'link';
  isFreePreview: boolean;
  videoUrl?: string;
  meetLink?: string;
  locationDetails?: string;
  timeSchedule?: string;
  pdfUrl?: string;
  webLink?: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  _id: string;
  slug: string;
  title: string;
  courseTitle: string;
  subtitle: string;
  courseDescription: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  coursePrice: number;
  originalPrice: number;
  discount: number;
  rating: number;
  ratings: { rating: number }[];
  reviewsCount: number;
  duration: string;
  durationMinutes: number;
  lessonsCount: number;
  thumbnailUrl: string;
  courseThumbnail: string;
  previewVideoUrl: string;
  instructor: Instructor;
  tutorNames: string;
  institutionName: string;
  educator?: string;
  curriculum: CurriculumModule[];
  lessons: Lesson[];
  enrolledStudents: string[];
  type: 'video' | 'online' | 'offline';
  badge?: string;
  createdAt: string;
}

// 12 Production Tech Courses
export const SEED_COURSES: Course[] = [
  {
    id: 'course-ai-agent-engineering',
    _id: 'course-ai-agent-engineering',
    slug: 'ai-agent-engineering-mastery',
    title: 'Full-Stack AI Agent Engineering with LangGraph & Multi-Agent Swarms',
    courseTitle: 'Full-Stack AI Agent Engineering with LangGraph & Multi-Agent Swarms',
    subtitle: 'Build, evaluate, and deploy autonomous agent swarms, tool-calling pipelines, persistent memory state machines, and MCP servers in production.',
    courseDescription: 'An end-to-end masterclass on building autonomous agent architectures. Covers LangGraph cyclic graphs, Human-in-the-Loop approval workflows, Model Context Protocol (MCP), vector memory, evaluation frameworks, and production deployment with streaming telemetry.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    price: 149,
    coursePrice: 149,
    originalPrice: 249,
    discount: 40,
    rating: 4.96,
    ratings: Array(28).fill({ rating: 5 }),
    reviewsCount: 1420,
    duration: '24h 30m',
    durationMinutes: 1470,
    lessonsCount: 16,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    instructor: {
      name: 'Dr. Sophia Vance',
      role: 'Principal AI Architect at Anthropic Labs',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Former DeepMind research scientist specializing in autonomous multi-agent reasoning, hierarchical reinforcement learning, and LLM safety architectures.',
      company: 'Anthropic Labs'
    },
    tutorNames: 'Dr. Sophia Vance',
    institutionName: 'Anthropic Labs',
    type: 'video',
    badge: 'Bestseller',
    createdAt: '2025-01-15T09:00:00.000Z',
    enrolledStudents: Array(1420).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations of Autonomous Agents',
        description: 'Understand agent reasoning loops, ReAct prompting, and structured function calling.',
        lessons: [
          {
            id: 'l-1',
            lessonId: 'l-1',
            title: 'Welcome & Agent Architecture Blueprint',
            lessonTitle: 'Welcome & Agent Architecture Blueprint',
            duration: '14:20',
            durationMinutes: 14,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'l-2',
            lessonId: 'l-2',
            title: 'ReAct Prompting & Tool Invocation Mechanics',
            lessonTitle: 'ReAct Prompting & Tool Invocation Mechanics',
            duration: '18:45',
            durationMinutes: 19,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'l-3',
            lessonId: 'l-3',
            title: 'Deterministic State Management with LangGraph',
            lessonTitle: 'Deterministic State Management with LangGraph',
            duration: '22:10',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'l-4',
            lessonId: 'l-4',
            title: 'Lab: Building Your First Tool-Calling Agent',
            lessonTitle: 'Lab: Building Your First Tool-Calling Agent',
            duration: '35:00',
            durationMinutes: 35,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Multi-Agent Collaboration & Swarms',
        description: 'Implement supervisor-worker hierarchies, distributed consensus, and debate protocols.',
        lessons: [
          {
            id: 'l-5',
            lessonId: 'l-5',
            title: 'Hierarchical Supervisors vs Peer-to-Peer Swarms',
            lessonTitle: 'Hierarchical Supervisors vs Peer-to-Peer Swarms',
            duration: '20:15',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'l-6',
            lessonId: 'l-6',
            title: 'Cross-Agent State Synchronization & Message Passing',
            lessonTitle: 'Cross-Agent State Synchronization & Message Passing',
            duration: '24:30',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'l-7',
            lessonId: 'l-7',
            title: 'Dynamic Routing & Conditional Edge Branches',
            lessonTitle: 'Dynamic Routing & Conditional Edge Branches',
            duration: '19:40',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'l-8',
            lessonId: 'l-8',
            title: 'Interactive Code Generation & Self-Healing Loops',
            lessonTitle: 'Interactive Code Generation & Self-Healing Loops',
            duration: '28:10',
            durationMinutes: 28,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Memory Architectures & MCP Protocol',
        description: 'Episodic memory, vector search, semantic cache, and Model Context Protocol integrations.',
        lessons: [
          {
            id: 'l-9',
            lessonId: 'l-9',
            title: 'Short-Term Buffers vs Semantic Long-Term Memory',
            lessonTitle: 'Short-Term Buffers vs Semantic Long-Term Memory',
            duration: '21:00',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'l-10',
            lessonId: 'l-10',
            title: 'Model Context Protocol (MCP) Client & Server Architecture',
            lessonTitle: 'Model Context Protocol (MCP) Client & Server Architecture',
            duration: '27:50',
            durationMinutes: 28,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'l-11',
            lessonId: 'l-11',
            title: 'GraphRAG: Knowledge Graphs for Agent Context Retrieval',
            lessonTitle: 'GraphRAG: Knowledge Graphs for Agent Context Retrieval',
            duration: '31:20',
            durationMinutes: 31,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'l-12',
            lessonId: 'l-12',
            title: 'PDF Reference: MCP Specification & Schemas',
            lessonTitle: 'PDF Reference: MCP Specification & Schemas',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Production Deployment & Observability',
        description: 'Deploying agent swarms, rate limit handling, telemetry, and security sandboxing.',
        lessons: [
          {
            id: 'l-13',
            lessonId: 'l-13',
            title: 'Human-in-the-Loop Approval Checkpoints',
            lessonTitle: 'Human-in-the-Loop Approval Checkpoints',
            duration: '18:30',
            durationMinutes: 19,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'l-14',
            lessonId: 'l-14',
            title: 'Telemetry, Tracing & Cost Observability (LangSmith)',
            lessonTitle: 'Telemetry, Tracing & Cost Observability (LangSmith)',
            duration: '22:15',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'l-15',
            lessonId: 'l-15',
            title: 'Sandboxed Python & Bash Execution Environments',
            lessonTitle: 'Sandboxed Python & Bash Execution Environments',
            duration: '26:40',
            durationMinutes: 27,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'l-16',
            lessonId: 'l-16',
            title: 'Capstone: Autonomous Research Agent Deployment',
            lessonTitle: 'Capstone: Autonomous Research Agent Deployment',
            duration: '45:00',
            durationMinutes: 45,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: [] // will be populated automatically below
  },
  {
    id: 'course-nextjs-15-architecture',
    _id: 'course-nextjs-15-architecture',
    slug: 'nextjs-production-architecture',
    title: 'Next.js 15 & React 19: Enterprise Production Architecture',
    courseTitle: 'Next.js 15 & React 19: Enterprise Production Architecture',
    subtitle: 'Master Server Actions, React Server Components (RSC), App Router deep-dives, Turbopack, Streaming SSR, and distributed Edge caching.',
    courseDescription: 'A comprehensive, battle-tested guide to scaling Next.js applications to millions of users. Learn advanced caching strategies, optimistic UI updates, partial prerendering (PPR), middleware auth boundaries, and micro-frontend patterns.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 129,
    coursePrice: 129,
    originalPrice: 199,
    discount: 35,
    rating: 4.93,
    ratings: Array(25).fill({ rating: 5 }),
    reviewsCount: 2310,
    duration: '28h 15m',
    durationMinutes: 1695,
    lessonsCount: 16,
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    instructor: {
      name: 'Alex Chen',
      role: 'Staff Frontend Engineer & React Core Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Author of high-performance React design patterns. Led frontend infrastructure migrations at scale, reducing bundle sizes and hydration overhead by 70%.',
      company: 'Vercel Ecosystem'
    },
    tutorNames: 'Alex Chen',
    institutionName: 'Frontend Masters Guild',
    type: 'video',
    badge: 'Popular',
    createdAt: '2025-01-20T10:00:00.000Z',
    enrolledStudents: Array(2310).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Mental Model of React 19 & RSC',
        description: 'Demystifying the client-server boundary, serialization, and compilation.',
        lessons: [
          {
            id: 'n-1',
            lessonId: 'n-1',
            title: 'RSC vs SSR: The Mental Model Shift',
            lessonTitle: 'RSC vs SSR: The Mental Model Shift',
            duration: '16:40',
            durationMinutes: 17,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'n-2',
            lessonId: 'n-2',
            title: 'Server Actions, Form State & Optimistic UI Updates',
            lessonTitle: 'Server Actions, Form State & Optimistic UI Updates',
            duration: '21:15',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'n-3',
            lessonId: 'n-3',
            title: 'Streaming Architecture & Suspense Boundaries',
            lessonTitle: 'Streaming Architecture & Suspense Boundaries',
            duration: '19:30',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-4',
            lessonId: 'n-4',
            title: 'Partial Prerendering (PPR) in Next.js 15',
            lessonTitle: 'Partial Prerendering (PPR) in Next.js 15',
            duration: '24:00',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Advanced Caching & Invalidation',
        description: 'Master the 4-tier caching model in Next.js App Router.',
        lessons: [
          {
            id: 'n-5',
            lessonId: 'n-5',
            title: 'Request Memoization, Data Cache, Full Route Cache',
            lessonTitle: 'Request Memoization, Data Cache, Full Route Cache',
            duration: '23:10',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-6',
            lessonId: 'n-6',
            title: 'On-Demand Revalidation with Tags & Paths',
            lessonTitle: 'On-Demand Revalidation with Tags & Paths',
            duration: '18:50',
            durationMinutes: 19,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-7',
            lessonId: 'n-7',
            title: 'Edge Middleware Auth Routing & Cookie Validation',
            lessonTitle: 'Edge Middleware Auth Routing & Cookie Validation',
            duration: '27:15',
            durationMinutes: 27,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-8',
            lessonId: 'n-8',
            title: 'Hands-on Lab: Distributed Redis Cache Layer',
            lessonTitle: 'Hands-on Lab: Distributed Redis Cache Layer',
            duration: '32:00',
            durationMinutes: 32,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: State Management & Modern Data Flow',
        description: 'Zustand, React Query integration, and URL-first state synchronization.',
        lessons: [
          {
            id: 'n-9',
            lessonId: 'n-9',
            title: 'Nuances of Client State vs Server State in 2025',
            lessonTitle: 'Nuances of Client State vs Server State in 2025',
            duration: '15:20',
            durationMinutes: 15,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-10',
            lessonId: 'n-10',
            title: 'URL-Driven Filters & Server Synchronization',
            lessonTitle: 'URL-Driven Filters & Server Synchronization',
            duration: '21:00',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-11',
            lessonId: 'n-11',
            title: 'Real-Time WebSockets & Server-Sent Events with RSC',
            lessonTitle: 'Real-Time WebSockets & Server-Sent Events with RSC',
            duration: '26:45',
            durationMinutes: 27,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-12',
            lessonId: 'n-12',
            title: 'Architecture Blueprint: Next.js 15 Monorepo Specs',
            lessonTitle: 'Architecture Blueprint: Next.js 15 Monorepo Specs',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Performance, Monitoring & CI/CD',
        description: 'Zero-runtime CSS, Core Web Vitals profiling, and Docker deployment.',
        lessons: [
          {
            id: 'n-13',
            lessonId: 'n-13',
            title: 'Core Web Vitals Profiling (INP, LCP, CLS)',
            lessonTitle: 'Core Web Vitals Profiling (INP, LCP, CLS)',
            duration: '22:30',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-14',
            lessonId: 'n-14',
            title: 'Next Image & Font Optimization Internals',
            lessonTitle: 'Next Image & Font Optimization Internals',
            duration: '17:15',
            durationMinutes: 17,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-15',
            lessonId: 'n-15',
            title: 'Self-Hosting Next.js in Multi-Stage Docker Containers',
            lessonTitle: 'Self-Hosting Next.js in Multi-Stage Docker Containers',
            duration: '29:00',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'n-16',
            lessonId: 'n-16',
            title: 'Final Project: Enterprise SaaS Dashboard Architecture',
            lessonTitle: 'Final Project: Enterprise SaaS Dashboard Architecture',
            duration: '42:00',
            durationMinutes: 42,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-distributed-systems',
    _id: 'course-distributed-systems',
    slug: 'distributed-systems-design',
    title: 'Large-Scale Distributed Systems & System Design Blueprint',
    courseTitle: 'Large-Scale Distributed Systems & System Design Blueprint',
    subtitle: 'Architect resilient high-throughput infrastructure: Consensus protocols (Raft), Event-driven Kafka pipelines, distributed transactions, and microservices.',
    courseDescription: 'Prepare for Staff/Principal engineer interviews and real-world distributed architectures. Dissect consensus algorithms, sharding schemes, consistency models (CAP/PACELC), distributed locks, and failure recovery under catastrophic partitions.',
    category: 'Database Design',
    level: 'Advanced',
    price: 179,
    coursePrice: 179,
    originalPrice: 299,
    discount: 40,
    rating: 4.98,
    ratings: Array(30).fill({ rating: 5 }),
    reviewsCount: 3840,
    duration: '32h 45m',
    durationMinutes: 1965,
    lessonsCount: 16,
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    instructor: {
      name: 'Elena Rostova',
      role: 'VP of Infrastructure & Distributed Systems',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Over 15 years leading distributed data systems at scale. Designed global storage backbones processing 4M+ queries per second with 99.999% availability.',
      company: 'ScaleMesh Labs'
    },
    tutorNames: 'Elena Rostova',
    institutionName: 'ScaleMesh Labs',
    type: 'video',
    badge: 'Staff Engineer Pick',
    createdAt: '2025-01-10T08:00:00.000Z',
    enrolledStudents: Array(3840).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Consistency, Availability & Consensus',
        description: 'Understand linearizability, vector clocks, and Raft leader election.',
        lessons: [
          {
            id: 'ds-1',
            lessonId: 'ds-1',
            title: 'Deconstructing CAP, PACELC and Real Latency Costs',
            lessonTitle: 'Deconstructing CAP, PACELC and Real Latency Costs',
            duration: '18:10',
            durationMinutes: 18,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'ds-2',
            lessonId: 'ds-2',
            title: 'Raft Consensus Protocol Step-by-Step Visualization',
            lessonTitle: 'Raft Consensus Protocol Step-by-Step Visualization',
            duration: '25:40',
            durationMinutes: 26,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'ds-3',
            lessonId: 'ds-3',
            title: 'Vector Clocks, Lamport Timestamps & Causality Tracking',
            lessonTitle: 'Vector Clocks, Lamport Timestamps & Causality Tracking',
            duration: '22:15',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-4',
            lessonId: 'ds-4',
            title: 'Distributed Transactions: 2PC vs Saga Orchestration',
            lessonTitle: 'Distributed Transactions: 2PC vs Saga Orchestration',
            duration: '31:00',
            durationMinutes: 31,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: High-Throughput Streaming & Messaging',
        description: 'Kafka partition mechanics, consumer groups, and exact-once delivery.',
        lessons: [
          {
            id: 'ds-5',
            lessonId: 'ds-5',
            title: 'Apache Kafka Internals: Partition Log Architecture',
            lessonTitle: 'Apache Kafka Internals: Partition Log Architecture',
            duration: '28:30',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-6',
            lessonId: 'ds-6',
            title: 'Handling Poison Pills, Dead Letter Queues & Rebalances',
            lessonTitle: 'Handling Poison Pills, Dead Letter Queues & Rebalances',
            duration: '20:45',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-7',
            lessonId: 'ds-7',
            title: 'Idempotency and Exactly-Once Semantics in Practice',
            lessonTitle: 'Idempotency and Exactly-Once Semantics in Practice',
            duration: '24:10',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-8',
            lessonId: 'ds-8',
            title: 'Event Sourcing & CQRS Pattern Implementation',
            lessonTitle: 'Event Sourcing & CQRS Pattern Implementation',
            duration: '34:00',
            durationMinutes: 34,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Sharding, Partitioning & Caching',
        description: 'Consistent hashing, replication rings, and multi-tier invalidation.',
        lessons: [
          {
            id: 'ds-9',
            lessonId: 'ds-9',
            title: 'Consistent Hashing and Virtual Nodes (Dynamo Architecture)',
            lessonTitle: 'Consistent Hashing and Virtual Nodes (Dynamo Architecture)',
            duration: '23:45',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-10',
            lessonId: 'ds-10',
            title: 'Distributed Locking with Redis (Redlock) and etcd',
            lessonTitle: 'Distributed Locking with Redis (Redlock) and etcd',
            duration: '21:30',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-11',
            lessonId: 'ds-11',
            title: 'Mitigating Cache Stampedes and Thundering Herds',
            lessonTitle: 'Mitigating Cache Stampedes and Thundering Herds',
            duration: '19:15',
            durationMinutes: 19,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-12',
            lessonId: 'ds-12',
            title: 'System Design Interview Cheatsheet (Staff Level)',
            lessonTitle: 'System Design Interview Cheatsheet (Staff Level)',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Real-World Case Studies',
        description: 'Dissecting architectures: Uber Dispatch, Netflix CDN, Stripe Payments.',
        lessons: [
          {
            id: 'ds-13',
            lessonId: 'ds-13',
            title: 'Case Study: Designing Global Ride Dispatch at Uber Scale',
            lessonTitle: 'Case Study: Designing Global Ride Dispatch at Uber Scale',
            duration: '38:00',
            durationMinutes: 38,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-14',
            lessonId: 'ds-14',
            title: 'Case Study: Real-Time Financial Ledger at Stripe',
            lessonTitle: 'Case Study: Real-Time Financial Ledger at Stripe',
            duration: '35:20',
            durationMinutes: 35,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-15',
            lessonId: 'ds-15',
            title: 'Chaos Engineering: Simulating Network Partitions with Toxiproxy',
            lessonTitle: 'Chaos Engineering: Simulating Network Partitions with Toxiproxy',
            duration: '29:10',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-16',
            lessonId: 'ds-16',
            title: 'Mock Interview: Designing Global Collaborative Docs (Figma/Google Docs)',
            lessonTitle: 'Mock Interview: Designing Global Collaborative Docs (Figma/Google Docs)',
            duration: '48:00',
            durationMinutes: 48,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-production-kubernetes-platform',
    _id: 'course-production-kubernetes-platform',
    slug: 'modern-devops-kubernetes-platform',
    title: 'Production Kubernetes & Platform Engineering with GitOps',
    courseTitle: 'Production Kubernetes & Platform Engineering with GitOps',
    subtitle: 'From Docker containers to multi-region EKS/GKE clusters, ArgoCD GitOps, Helm, Prometheus/Grafana observability, and zero-trust mesh.',
    courseDescription: 'Build self-service internal developer platforms (IDP). Dive into custom Kubernetes operators, service meshes (Istio/Linkerd), network policies, cost optimization via Karpenter, and automated canary deployments with Argo Rollouts.',
    category: 'Cloud Computing',
    level: 'Intermediate',
    price: 139,
    coursePrice: 139,
    originalPrice: 219,
    discount: 36,
    rating: 4.88,
    ratings: Array(22).fill({ rating: 5 }),
    reviewsCount: 1850,
    duration: '22h 10m',
    durationMinutes: 1330,
    lessonsCount: 16,
    thumbnailUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    instructor: {
      name: 'Marcus Sterling',
      role: 'Head of Cloud Platform Infrastructure',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'Kubernetes certified trainer (CKA/CKS). Architected enterprise cloud migrations across AWS and GCP managing over 8,000 production microservice pods.',
      company: 'CloudNative Architects'
    },
    tutorNames: 'Marcus Sterling',
    institutionName: 'CloudNative Architects',
    type: 'video',
    badge: 'High Demand',
    createdAt: '2025-01-18T11:00:00.000Z',
    enrolledStudents: Array(1850).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Production Containerization & K8s Core',
        description: 'Multi-stage builds, rootless containers, Pod lifecycles, and probes.',
        lessons: [
          {
            id: 'k-1',
            lessonId: 'k-1',
            title: 'Hardening Docker Images & Minimal Distroless Runtimes',
            lessonTitle: 'Hardening Docker Images & Minimal Distroless Runtimes',
            duration: '15:30',
            durationMinutes: 16,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'k-2',
            lessonId: 'k-2',
            title: 'Pod Lifecycle, Graceful Termination & Liveness/Readiness Probes',
            lessonTitle: 'Pod Lifecycle, Graceful Termination & Liveness/Readiness Probes',
            duration: '21:00',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          },
          {
            id: 'k-3',
            lessonId: 'k-3',
            title: 'Kubernetes Ingress Controllers & Cert-Manager Automation',
            lessonTitle: 'Kubernetes Ingress Controllers & Cert-Manager Automation',
            duration: '24:15',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-4',
            lessonId: 'k-4',
            title: 'StatefulSets vs Deployments for Database Workloads',
            lessonTitle: 'StatefulSets vs Deployments for Database Workloads',
            duration: '27:40',
            durationMinutes: 28,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: GitOps Automation with ArgoCD',
        description: 'Declarative cluster management, sync policies, and drift detection.',
        lessons: [
          {
            id: 'k-5',
            lessonId: 'k-5',
            title: 'GitOps Philosophy & ArgoCD Core Components',
            lessonTitle: 'GitOps Philosophy & ArgoCD Core Components',
            duration: '18:20',
            durationMinutes: 18,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-6',
            lessonId: 'k-6',
            title: 'App-of-Apps Pattern for Multi-Environment Clusters',
            lessonTitle: 'App-of-Apps Pattern for Multi-Environment Clusters',
            duration: '26:10',
            durationMinutes: 26,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-7',
            lessonId: 'k-7',
            title: 'Argo Rollouts: Blue/Green & Automated Canary Releases',
            lessonTitle: 'Argo Rollouts: Blue/Green & Automated Canary Releases',
            duration: '31:45',
            durationMinutes: 32,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-8',
            lessonId: 'k-8',
            title: 'Sealed Secrets & External Secret Operator with HashiCorp Vault',
            lessonTitle: 'Sealed Secrets & External Secret Operator with HashiCorp Vault',
            duration: '25:00',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Observability, Metrics & Mesh',
        description: 'Prometheus, Grafana, OpenTelemetry, and service mesh traffic control.',
        lessons: [
          {
            id: 'k-9',
            lessonId: 'k-9',
            title: 'Setting up Prometheus Operator & ServiceMonitors',
            lessonTitle: 'Setting up Prometheus Operator & ServiceMonitors',
            duration: '22:15',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-10',
            lessonId: 'k-10',
            title: 'Istio Service Mesh: Mutual TLS (mTLS) & Traffic Shifting',
            lessonTitle: 'Istio Service Mesh: Mutual TLS (mTLS) & Traffic Shifting',
            duration: '28:50',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-11',
            lessonId: 'k-11',
            title: 'Karpenter Autoscaling: Just-in-Time Spot Fleet Provisioning',
            lessonTitle: 'Karpenter Autoscaling: Just-in-Time Spot Fleet Provisioning',
            duration: '24:30',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-12',
            lessonId: 'k-12',
            title: 'DevOps Checklist: Production Cluster Hardening Guide',
            lessonTitle: 'DevOps Checklist: Production Cluster Hardening Guide',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Security, Cost & Incident Response',
        description: 'Kyverno policies, runtime protection with Falco, and war-room triage.',
        lessons: [
          {
            id: 'k-13',
            lessonId: 'k-13',
            title: 'Policy Enforcement with Kyverno & OPA Gatekeeper',
            lessonTitle: 'Policy Enforcement with Kyverno & OPA Gatekeeper',
            duration: '20:10',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-14',
            lessonId: 'k-14',
            title: 'Runtime Anomaly Detection with Falco and eBPF',
            lessonTitle: 'Runtime Anomaly Detection with Falco and eBPF',
            duration: '26:00',
            durationMinutes: 26,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-15',
            lessonId: 'k-15',
            title: 'Cloud Cost Optimization: Slashing EKS AWS Bills by 60%',
            lessonTitle: 'Cloud Cost Optimization: Slashing EKS AWS Bills by 60%',
            duration: '23:40',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'k-16',
            lessonId: 'k-16',
            title: 'War Room Drill: Recovering from a Corrupted Control Plane',
            lessonTitle: 'War Room Drill: Recovering from a Corrupted Control Plane',
            duration: '40:00',
            durationMinutes: 40,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-postgresql-database-internals',
    _id: 'course-postgresql-database-internals',
    slug: 'postgresql-database-internals',
    title: 'PostgreSQL Deep Dive: Query Optimization, Internals & Indexing',
    courseTitle: 'PostgreSQL Deep Dive: Query Optimization, Internals & Indexing',
    subtitle: 'Under the hood of Postgres: WAL write-ahead logging, MVCC concurrency, vacuum tuning, EXPLAIN ANALYZE execution trees, and partition architectures.',
    courseDescription: 'Go beyond basic SQL queries. Understand PostgreSQL storage pages, B-Tree vs BRIN vs GIN indexing, join execution algorithms, lock contention debugging, and connection pooling with PgBouncer.',
    category: 'Database Design',
    level: 'Advanced',
    price: 119,
    coursePrice: 119,
    originalPrice: 189,
    discount: 37,
    rating: 4.96,
    ratings: Array(26).fill({ rating: 5 }),
    reviewsCount: 1620,
    duration: '19h 40m',
    durationMinutes: 1180,
    lessonsCount: 15,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    instructor: {
      name: 'Dmitri Volkov',
      role: 'PostgreSQL Database Performance Architect',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      bio: 'PostgreSQL community contributor and database tuning consultant. Optimized massive 50TB+ transaction databases for FinTech and high-load gaming platforms.',
      company: 'Database Performance Guild'
    },
    tutorNames: 'Dmitri Volkov',
    institutionName: 'Database Performance Guild',
    type: 'video',
    badge: 'Database Deep Dive',
    createdAt: '2025-01-22T14:00:00.000Z',
    enrolledStudents: Array(1620).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Postgres Storage & MVCC Internals',
        description: 'Page layout, tuples, transaction isolation levels, and vacuuming.',
        lessons: [
          {
            id: 'pg-1',
            lessonId: 'pg-1',
            title: 'How Postgres Writes to Disk: Pages, Tuples & WAL',
            lessonTitle: 'How Postgres Writes to Disk: Pages, Tuples & WAL',
            duration: '17:20',
            durationMinutes: 17,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          },
          {
            id: 'pg-2',
            lessonId: 'pg-2',
            title: 'MVCC Concurrency: Transaction IDs, XMIN & XMAX',
            lessonTitle: 'MVCC Concurrency: Transaction IDs, XMIN & XMAX',
            duration: '22:15',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
          },
          {
            id: 'pg-3',
            lessonId: 'pg-3',
            title: 'Autovacuum Tuning & Preventing Transaction ID Wraparound',
            lessonTitle: 'Autovacuum Tuning & Preventing Transaction ID Wraparound',
            duration: '24:50',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'pg-4',
            lessonId: 'pg-4',
            title: 'Deep Dive into B-Tree, GIN, GiST, and BRIN Index Structures',
            lessonTitle: 'Deep Dive into B-Tree, GIN, GiST, and BRIN Index Structures',
            duration: '29:00',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Query Execution & EXPLAIN ANALYZE',
        description: 'Planner cost model, sequential vs index scans, and join algorithms.',
        lessons: [
          {
            id: 'pg-5',
            lessonId: 'pg-5',
            title: 'Reading Query Plans: Cost Estimation & Operator Trees',
            lessonTitle: 'Reading Query Plans: Cost Estimation & Operator Trees',
            duration: '23:30',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'pg-6',
            lessonId: 'pg-6',
            title: 'Join Mechanics: Nested Loop vs Hash Join vs Merge Join',
            lessonTitle: 'Join Mechanics: Nested Loop vs Hash Join vs Merge Join',
            duration: '26:40',
            durationMinutes: 27,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'pg-7',
            lessonId: 'pg-7',
            title: 'Window Functions & Recursive Common Table Expressions (CTEs)',
            lessonTitle: 'Window Functions & Recursive Common Table Expressions (CTEs)',
            duration: '21:10',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'pg-8',
            lessonId: 'pg-8',
            title: 'Debugging Lock Contention with pg_stat_activity',
            lessonTitle: 'Debugging Lock Contention with pg_stat_activity',
            duration: '25:00',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Scaling, Partitioning & PgBouncer',
        description: 'Declarative table partitioning, connection pooling, and replication.',
        lessons: [
          {
            id: 'pg-9',
            lessonId: 'pg-9',
            title: 'Declarative Range & List Partitioning Strategies',
            lessonTitle: 'Declarative Range & List Partitioning Strategies',
            duration: '22:00',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'pg-10',
            lessonId: 'pg-10',
            title: 'Connection Pooling with PgBouncer: Session vs Transaction Mode',
            lessonTitle: 'Connection Pooling with PgBouncer: Session vs Transaction Mode',
            duration: '20:15',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'pg-11',
            lessonId: 'pg-11',
            title: 'Streaming Replication & Read Replicas Configuration',
            lessonTitle: 'Streaming Replication & Read Replicas Configuration',
            duration: '28:40',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'pg-12',
            lessonId: 'pg-12',
            title: 'PostgreSQL Performance Tuning Config Reference',
            lessonTitle: 'PostgreSQL Performance Tuning Config Reference',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Real-Time Vector Search & pgvector',
        description: 'Vector similarity search, HNSW indexing, and hybrid semantic retrieval.',
        lessons: [
          {
            id: 'pg-13',
            lessonId: 'pg-13',
            title: 'Embedding Storage with pgvector: IVFFlat vs HNSW',
            lessonTitle: 'Embedding Storage with pgvector: IVFFlat vs HNSW',
            duration: '25:30',
            durationMinutes: 26,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'pg-14',
            lessonId: 'pg-14',
            title: 'Hybrid Full-Text & Semantic Vector Search in One Query',
            lessonTitle: 'Hybrid Full-Text & Semantic Vector Search in One Query',
            duration: '29:10',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'pg-15',
            lessonId: 'pg-15',
            title: 'Hands-on Benchmark: 10 Million Row Query Tuning Challenge',
            lessonTitle: 'Hands-on Benchmark: 10 Million Row Query Tuning Challenge',
            duration: '38:00',
            durationMinutes: 38,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-rust-systems-performance',
    _id: 'course-rust-systems-performance',
    slug: 'rust-systems-performance',
    title: 'High-Performance Systems Programming in Rust 2024',
    courseTitle: 'High-Performance Systems Programming in Rust 2024',
    subtitle: 'Memory safety without garbage collection: Borrow checker mastery, async concurrency with Tokio, SIMD optimizations, and WebAssembly compilation.',
    courseDescription: 'Learn why the world’s top infrastructure teams are rewriting their cores in Rust. Build zero-cost abstractions, multi-threaded networking servers, and blazingly fast WebAssembly plugins with fearless concurrency.',
    category: 'Web Development',
    level: 'Advanced',
    price: 159,
    coursePrice: 159,
    originalPrice: 239,
    discount: 33,
    rating: 4.94,
    ratings: Array(24).fill({ rating: 5 }),
    reviewsCount: 1980,
    duration: '26h 00m',
    durationMinutes: 1560,
    lessonsCount: 16,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    instructor: {
      name: 'Nathan Drake',
      role: 'Staff Systems Engineer at Cloudflare',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      bio: 'Core contributor to high-performance network proxies and edge workers. Author of several popular crates in the Rust ecosystem.',
      company: 'Cloudflare'
    },
    tutorNames: 'Nathan Drake',
    institutionName: 'Rust Systems Lab',
    type: 'video',
    badge: 'Pro Tier',
    createdAt: '2025-01-25T12:00:00.000Z',
    enrolledStudents: Array(1980).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Ownership, Borrowing & Lifetimes',
        description: 'Conquering the borrow checker, smart pointers, and unsafe boundaries.',
        lessons: [
          {
            id: 'r-1',
            lessonId: 'r-1',
            title: 'Memory Layout: Stack, Heap & Zero-Cost Abstractions',
            lessonTitle: 'Memory Layout: Stack, Heap & Zero-Cost Abstractions',
            duration: '16:50',
            durationMinutes: 17,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
          },
          {
            id: 'r-2',
            lessonId: 'r-2',
            title: 'Demystifying Complex Lifetime Annotations (\'a, \'static)',
            lessonTitle: 'Demystifying Complex Lifetime Annotations (\'a, \'static)',
            duration: '23:10',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
          },
          {
            id: 'r-3',
            lessonId: 'r-3',
            title: 'Smart Pointers: Box, Rc, Arc, RefCell, and Mutex',
            lessonTitle: 'Smart Pointers: Box, Rc, Arc, RefCell, and Mutex',
            duration: '21:40',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-4',
            lessonId: 'r-4',
            title: 'When and How to Safely Use Unsafe Rust',
            lessonTitle: 'When and How to Safely Use Unsafe Rust',
            duration: '28:15',
            durationMinutes: 28,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Concurrency & Async with Tokio',
        description: 'Multi-threading, channels, actor models, and async event loops.',
        lessons: [
          {
            id: 'r-5',
            lessonId: 'r-5',
            title: 'Thread Spawning, Rayon Parallelism & Data Races',
            lessonTitle: 'Thread Spawning, Rayon Parallelism & Data Races',
            duration: '22:00',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-6',
            lessonId: 'r-6',
            title: 'Tokio Async Runtime Internals & Task Cooperative Scheduling',
            lessonTitle: 'Tokio Async Runtime Internals & Task Cooperative Scheduling',
            duration: '27:40',
            durationMinutes: 28,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-7',
            lessonId: 'r-7',
            title: 'Building a High-Concurrency TCP Echo Server',
            lessonTitle: 'Building a High-Concurrency TCP Echo Server',
            duration: '34:20',
            durationMinutes: 34,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-8',
            lessonId: 'r-8',
            title: 'Crossbeam Channels & Lock-Free Data Structures',
            lessonTitle: 'Crossbeam Channels & Lock-Free Data Structures',
            duration: '25:10',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: SIMD, WebAssembly & Low-Level Hardware',
        description: 'Vector instructions, wasm-bindgen, and compiling for edge servers.',
        lessons: [
          {
            id: 'r-9',
            lessonId: 'r-9',
            title: 'Auto-Vectorization & Explicit SIMD Operations in Rust',
            lessonTitle: 'Auto-Vectorization & Explicit SIMD Operations in Rust',
            duration: '20:45',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-10',
            lessonId: 'r-10',
            title: 'Compiling Rust to WebAssembly (Wasm) with wasm-pack',
            lessonTitle: 'Compiling Rust to WebAssembly (Wasm) with wasm-pack',
            duration: '24:30',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-11',
            lessonId: 'r-11',
            title: 'Zero-Copy Serialization with FlatBuffers & Bincode',
            lessonTitle: 'Zero-Copy Serialization with FlatBuffers & Bincode',
            duration: '23:00',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-12',
            lessonId: 'r-12',
            title: 'Rust Architecture Patterns & Idiomatic Style Guide',
            lessonTitle: 'Rust Architecture Patterns & Idiomatic Style Guide',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Capstone Project: High-Speed HTTP/3 Proxy',
        description: 'Develop an ultra-fast reverse proxy using Hyper, Rustls, and Tokio.',
        lessons: [
          {
            id: 'r-13',
            lessonId: 'r-13',
            title: 'Proxy Architecture: Streaming Request Bodies without Buffering',
            lessonTitle: 'Proxy Architecture: Streaming Request Bodies without Buffering',
            duration: '26:15',
            durationMinutes: 26,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-14',
            lessonId: 'r-14',
            title: 'TLS Termination with Rustls and Ring Cryptography',
            lessonTitle: 'TLS Termination with Rustls and Ring Cryptography',
            duration: '30:40',
            durationMinutes: 31,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-15',
            lessonId: 'r-15',
            title: 'Load Balancing Algorithms: Consistent Hashing & Round Robin',
            lessonTitle: 'Load Balancing Algorithms: Consistent Hashing & Round Robin',
            duration: '28:00',
            durationMinutes: 28,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'r-16',
            lessonId: 'r-16',
            title: 'Benchmarking vs NGINX: Achieving 250,000 Req/Sec',
            lessonTitle: 'Benchmarking vs NGINX: Achieving 250,000 Req/Sec',
            duration: '38:00',
            durationMinutes: 38,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-applied-data-science-machine-learning',
    _id: 'course-applied-data-science-machine-learning',
    slug: 'applied-data-science-machine-learning',
    title: 'Applied Machine Learning & Neural Networks in PyTorch',
    courseTitle: 'Applied Machine Learning & Neural Networks in PyTorch',
    subtitle: 'Hands-on deep learning: Transformers, attention mechanisms, fine-tuning LLMs (LoRA/QLoRA), embeddings, vector DBs, and MLOps deployment.',
    courseDescription: 'Bridge theoretical machine learning with production software systems. Train modern neural networks, optimize training loops with PyTorch Lightning, apply PEFT (LoRA) to open-weights models, and deploy via Triton Inference Server.',
    category: 'Data Science',
    level: 'Intermediate',
    price: 139,
    coursePrice: 139,
    originalPrice: 220,
    discount: 37,
    rating: 4.91,
    ratings: Array(28).fill({ rating: 5 }),
    reviewsCount: 2740,
    duration: '25h 20m',
    durationMinutes: 1520,
    lessonsCount: 16,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    instructor: {
      name: 'Maya Lin',
      role: 'Lead Data Scientist & Deep Learning Researcher',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      bio: 'Published author in transformer architectures and efficient attention mechanics. Led algorithmic trading models and computer vision pipelines.',
      company: 'DeepMind Scholar'
    },
    tutorNames: 'Maya Lin',
    institutionName: 'Deep Learning Institute',
    type: 'video',
    badge: 'Popular',
    createdAt: '2025-01-28T09:30:00.000Z',
    enrolledStudents: Array(2740).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Tensors, Autograd & Neural Network Core',
        description: 'Tensor operations, backpropagation from scratch, and loss functions.',
        lessons: [
          {
            id: 'ds-ml-1',
            lessonId: 'ds-ml-1',
            title: 'Tensors and Gradient Computation with Autograd',
            lessonTitle: 'Tensors and Gradient Computation with Autograd',
            duration: '18:00',
            durationMinutes: 18,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
          },
          {
            id: 'ds-ml-2',
            lessonId: 'ds-ml-2',
            title: 'Building a Multi-Layer Perceptron (MLP) from Scratch',
            lessonTitle: 'Building a Multi-Layer Perceptron (MLP) from Scratch',
            duration: '24:10',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
          },
          {
            id: 'ds-ml-3',
            lessonId: 'ds-ml-3',
            title: 'Activation Functions: ReLU, GELU, SwiGLU & Vanishing Gradients',
            lessonTitle: 'Activation Functions: ReLU, GELU, SwiGLU & Vanishing Gradients',
            duration: '21:30',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-4',
            lessonId: 'ds-ml-4',
            title: 'Optimizers: AdamW, Learning Rate Schedules, and Weight Decay',
            lessonTitle: 'Optimizers: AdamW, Learning Rate Schedules, and Weight Decay',
            duration: '26:00',
            durationMinutes: 26,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Transformer Architectures & Attention',
        description: 'Self-attention, multi-head attention, rotary positional embeddings (RoPE).',
        lessons: [
          {
            id: 'ds-ml-5',
            lessonId: 'ds-ml-5',
            title: 'Attention is All You Need: Vector Math & Matrix Multiplication',
            lessonTitle: 'Attention is All You Need: Vector Math & Matrix Multiplication',
            duration: '28:30',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-6',
            lessonId: 'ds-ml-6',
            title: 'Rotary Position Embeddings (RoPE) & FlashAttention-2',
            lessonTitle: 'Rotary Position Embeddings (RoPE) & FlashAttention-2',
            duration: '31:15',
            durationMinutes: 31,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-7',
            lessonId: 'ds-ml-7',
            title: 'Causal Masking and Autoregressive Decoding Loops',
            lessonTitle: 'Causal Masking and Autoregressive Decoding Loops',
            duration: '22:40',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-8',
            lessonId: 'ds-ml-8',
            title: 'Coding a Mini-GPT Architecture in 300 Lines of PyTorch',
            lessonTitle: 'Coding a Mini-GPT Architecture in 300 Lines of PyTorch',
            duration: '36:00',
            durationMinutes: 36,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Fine-Tuning LLMs with LoRA & QLoRA',
        description: 'Parameter-efficient fine-tuning (PEFT), quantization, and dataset prep.',
        lessons: [
          {
            id: 'ds-ml-9',
            lessonId: 'ds-ml-9',
            title: 'How Low-Rank Adaptation (LoRA) Works Mechanically',
            lessonTitle: 'How Low-Rank Adaptation (LoRA) Works Mechanically',
            duration: '21:00',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-10',
            lessonId: 'ds-ml-10',
            title: '4-Bit Quantization (NF4) with BitsAndBytes & QLoRA',
            lessonTitle: '4-Bit Quantization (NF4) with BitsAndBytes & QLoRA',
            duration: '27:20',
            durationMinutes: 27,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-11',
            lessonId: 'ds-ml-11',
            title: 'Instruct Dataset Curating, Tokenization & Alignment (DPO)',
            lessonTitle: 'Instruct Dataset Curating, Tokenization & Alignment (DPO)',
            duration: '29:45',
            durationMinutes: 30,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-12',
            lessonId: 'ds-ml-12',
            title: 'PyTorch Deep Learning Mathematical Reference Card',
            lessonTitle: 'PyTorch Deep Learning Mathematical Reference Card',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: MLOps, Triton & Production Serving',
        description: 'Model deployment, vLLM inference engine, PagedAttention, and evaluation.',
        lessons: [
          {
            id: 'ds-ml-13',
            lessonId: 'ds-ml-13',
            title: 'Serving High-Throughput LLMs with vLLM & PagedAttention',
            lessonTitle: 'Serving High-Throughput LLMs with vLLM & PagedAttention',
            duration: '24:10',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-14',
            lessonId: 'ds-ml-14',
            title: 'Triton Inference Server: Multi-GPU Dynamic Batching',
            lessonTitle: 'Triton Inference Server: Multi-GPU Dynamic Batching',
            duration: '28:50',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-15',
            lessonId: 'ds-ml-15',
            title: 'Automated Model Evaluation with Ragas & Human Benchmarks',
            lessonTitle: 'Automated Model Evaluation with Ragas & Human Benchmarks',
            duration: '23:30',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ds-ml-16',
            lessonId: 'ds-ml-16',
            title: 'Capstone: End-to-End Domain-Specific LLM Deployment',
            lessonTitle: 'Capstone: End-to-End Domain-Specific LLM Deployment',
            duration: '45:00',
            durationMinutes: 45,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-offensive-security-hacking',
    _id: 'course-offensive-security-hacking',
    slug: 'offensive-security-ethical-hacking',
    title: 'Offensive Cybersecurity & Web Application Penetration Testing',
    courseTitle: 'Offensive Cybersecurity & Web Application Penetration Testing',
    subtitle: 'Hands-on red teaming, OWASP Top 10 vulnerabilities exploitation, zero-day threat modeling, reverse engineering, and defensive hardening.',
    courseDescription: 'Learn penetration testing methodology through live vulnerable lab environments. Master SQL injection, Cross-Site Scripting (XSS), Server-Side Request Forgery (SSRF), JWT tampering, privilege escalation, and Active Directory exploitation.',
    category: 'Cybersecurity',
    level: 'Intermediate',
    price: 149,
    coursePrice: 149,
    originalPrice: 240,
    discount: 38,
    rating: 4.89,
    ratings: Array(21).fill({ rating: 5 }),
    reviewsCount: 1510,
    duration: '21h 50m',
    durationMinutes: 1310,
    lessonsCount: 15,
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    instructor: {
      name: 'Jordan Hayes',
      role: 'Principal Security Researcher & Red Team Lead',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      bio: 'Certified Ethical Hacker (CEH) and OSCP holder. Discovered critical vulnerabilities in Fortune 500 infrastructure and cloud identity providers.',
      company: 'RedShield Cyber'
    },
    tutorNames: 'Jordan Hayes',
    institutionName: 'RedShield Cyber Labs',
    type: 'video',
    badge: 'Hands-on Labs',
    createdAt: '2025-01-14T15:00:00.000Z',
    enrolledStudents: Array(1510).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Web Application Attacks & OWASP Top 10',
        description: 'Burp Suite Pro workflows, injection vectors, and broken access control.',
        lessons: [
          {
            id: 'sec-1',
            lessonId: 'sec-1',
            title: 'Modern Threat Modeling & Reconnaissance Toolkit',
            lessonTitle: 'Modern Threat Modeling & Reconnaissance Toolkit',
            duration: '16:10',
            durationMinutes: 16,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
          },
          {
            id: 'sec-2',
            lessonId: 'sec-2',
            title: 'Advanced SQLi: Blind Time-Based & Second-Order Exploits',
            lessonTitle: 'Advanced SQLi: Blind Time-Based & Second-Order Exploits',
            duration: '22:40',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'sec-3',
            lessonId: 'sec-3',
            title: 'Cross-Site Scripting (XSS): DOM-based & CSP Bypasses',
            lessonTitle: 'Cross-Site Scripting (XSS): DOM-based & CSP Bypasses',
            duration: '25:15',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'sec-4',
            lessonId: 'sec-4',
            title: 'Server-Side Request Forgery (SSRF) to Cloud Metadata Theft',
            lessonTitle: 'Server-Side Request Forgery (SSRF) to Cloud Metadata Theft',
            duration: '29:00',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Authentication & Token Manipulation',
        description: 'JWT algorithmic confusion, OAuth 2.0 redirect vulnerabilities, and SAML flaws.',
        lessons: [
          {
            id: 'sec-5',
            lessonId: 'sec-5',
            title: 'Breaking JWTs: Key Confusion (RS256 vs HS256) & None Algorithm',
            lessonTitle: 'Breaking JWTs: Key Confusion (RS256 vs HS256) & None Algorithm',
            duration: '20:30',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'sec-6',
            lessonId: 'sec-6',
            title: 'OAuth 2.0 & OpenID Connect Flow Hijacking Exploitation',
            lessonTitle: 'OAuth 2.0 & OpenID Connect Flow Hijacking Exploitation',
            duration: '26:50',
            durationMinutes: 27,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'sec-7',
            lessonId: 'sec-7',
            title: 'IDOR & Broken Object Level Authorization (BOLA)',
            lessonTitle: 'IDOR & Broken Object Level Authorization (BOLA)',
            duration: '21:10',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'sec-8',
            lessonId: 'sec-8',
            title: 'Lab: Attacking a Modern Single Page Application API',
            lessonTitle: 'Lab: Attacking a Modern Single Page Application API',
            duration: '35:00',
            durationMinutes: 35,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Infrastructure & Cloud Escalation',
        description: 'Container breakouts, IAM privilege escalation, and lateral movement.',
        lessons: [
          {
            id: 'sec-9',
            lessonId: 'sec-9',
            title: 'Docker & Kubernetes Container Breakouts (Host PIDs & Privileged Pods)',
            lessonTitle: 'Docker & Kubernetes Container Breakouts (Host PIDs & Privileged Pods)',
            duration: '24:20',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'sec-10',
            lessonId: 'sec-10',
            title: 'AWS Cloud Penetration: Exploiting Overly Permissive IAM Roles',
            lessonTitle: 'AWS Cloud Penetration: Exploiting Overly Permissive IAM Roles',
            duration: '28:15',
            durationMinutes: 28,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'sec-11',
            lessonId: 'sec-11',
            title: 'Linux Privilege Escalation: SUID, Capabilities & Kernel Exploits',
            lessonTitle: 'Linux Privilege Escalation: SUID, Capabilities & Kernel Exploits',
            duration: '27:00',
            durationMinutes: 27,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'sec-12',
            lessonId: 'sec-12',
            title: 'Offensive Penetration Testing Checklist & Methodology',
            lessonTitle: 'Offensive Penetration Testing Checklist & Methodology',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Defensive Remediation & Hardening',
        description: 'Writing secure code, implementing WAF rules, and remediation verification.',
        lessons: [
          {
            id: 'sec-13',
            lessonId: 'sec-13',
            title: 'Remediating Vulnerabilities in Next.js & Node.js Codebases',
            lessonTitle: 'Remediating Vulnerabilities in Next.js & Node.js Codebases',
            duration: '22:00',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'sec-14',
            lessonId: 'sec-14',
            title: 'Content Security Policy (CSP) Level 3 Implementation',
            lessonTitle: 'Content Security Policy (CSP) Level 3 Implementation',
            duration: '19:40',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'sec-15',
            lessonId: 'sec-15',
            title: 'Live CTF Capture The Flag: Infiltrate the Target Network',
            lessonTitle: 'Live CTF Capture The Flag: Infiltrate the Target Network',
            duration: '45:00',
            durationMinutes: 45,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-react-native-cross-platform',
    _id: 'course-react-native-cross-platform',
    slug: 'react-native-cross-platform-mastery',
    title: 'React Native & Expo: Native Cross-Platform Mastery',
    courseTitle: 'React Native & Expo: Native Cross-Platform Mastery',
    subtitle: 'Build 60fps native iOS & Android applications with TurboModules, Reanimated 3, offline-first SQLite sync, and App Store publishing.',
    courseDescription: 'Learn to build truly native, fluid mobile applications. Master the New Architecture (Fabric & TurboModules), gesture interactions with react-native-reanimated, background sync, push notifications, and EAS build automation.',
    category: 'Mobile Development',
    level: 'Beginner',
    price: 99,
    coursePrice: 99,
    originalPrice: 159,
    discount: 38,
    rating: 4.87,
    ratings: Array(20).fill({ rating: 5 }),
    reviewsCount: 1890,
    duration: '18h 30m',
    durationMinutes: 1110,
    lessonsCount: 14,
    thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    instructor: {
      name: 'Carlos Rivera',
      role: 'Senior Mobile Architect at MobileForge',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      bio: 'Shipped top-rated apps with over 20M+ active mobile users. Specializes in 60fps animations, cross-platform audio/video streaming, and native bridges.',
      company: 'MobileForge'
    },
    tutorNames: 'Carlos Rivera',
    institutionName: 'MobileForge Academy',
    type: 'video',
    badge: 'Mobile Core',
    createdAt: '2025-01-16T13:00:00.000Z',
    enrolledStudents: Array(1890).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Expo Router & Native Foundations',
        description: 'File-based routing, native navigation stacks, and TypeScript setup.',
        lessons: [
          {
            id: 'rn-1',
            lessonId: 'rn-1',
            title: 'Modern React Native Setup with Expo Router v3',
            lessonTitle: 'Modern React Native Setup with Expo Router v3',
            duration: '14:30',
            durationMinutes: 15,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'rn-2',
            lessonId: 'rn-2',
            title: 'Native Navigation Patterns: Stacks, Tabs & Modals',
            lessonTitle: 'Native Navigation Patterns: Stacks, Tabs & Modals',
            duration: '19:40',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'rn-3',
            lessonId: 'rn-3',
            title: 'The New Architecture: Fabric Renderer & TurboModules Explained',
            lessonTitle: 'The New Architecture: Fabric Renderer & TurboModules Explained',
            duration: '22:15',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rn-4',
            lessonId: 'rn-4',
            title: 'Responsive Design on iOS & Android: Safe Areas & Dynamic Islands',
            lessonTitle: 'Responsive Design on iOS & Android: Safe Areas & Dynamic Islands',
            duration: '18:50',
            durationMinutes: 19,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: 60fps Gestures & Reanimated 3',
        description: 'Interpolation, shared element transitions, and pan gesture math.',
        lessons: [
          {
            id: 'rn-5',
            lessonId: 'rn-5',
            title: 'Worklets & Running Animations on the UI Thread',
            lessonTitle: 'Worklets & Running Animations on the UI Thread',
            duration: '21:30',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rn-6',
            lessonId: 'rn-6',
            title: 'Building an Interactive Swipable Card Stack',
            lessonTitle: 'Building an Interactive Swipable Card Stack',
            duration: '27:10',
            durationMinutes: 27,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rn-7',
            lessonId: 'rn-7',
            title: 'Shared Element Transitions between Screens',
            lessonTitle: 'Shared Element Transitions between Screens',
            duration: '24:00',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Offline-First SQLite Sync & State',
        description: 'Local persistence, conflict resolution, and background sync.',
        lessons: [
          {
            id: 'rn-8',
            lessonId: 'rn-8',
            title: 'Expo SQLite: Local Relational Database Schema Design',
            lessonTitle: 'Expo SQLite: Local Relational Database Schema Design',
            duration: '23:15',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rn-9',
            lessonId: 'rn-9',
            title: 'Bi-Directional Cloud Synchronization Engine',
            lessonTitle: 'Bi-Directional Cloud Synchronization Engine',
            duration: '28:40',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rn-10',
            lessonId: 'rn-10',
            title: 'Handling Offline Queues & Reconnecting WebSockets',
            lessonTitle: 'Handling Offline Queues & Reconnecting WebSockets',
            duration: '20:10',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rn-11',
            lessonId: 'rn-11',
            title: 'Mobile App Architecture & State Management Diagram',
            lessonTitle: 'Mobile App Architecture & State Management Diagram',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Camera, Hardware & App Store Release',
        description: 'CameraX/AVFoundation access, biometrics, and EAS Build automated pipelines.',
        lessons: [
          {
            id: 'rn-12',
            lessonId: 'rn-12',
            title: 'Custom Camera Viewfinder & Barcode Scanner Integration',
            lessonTitle: 'Custom Camera Viewfinder & Barcode Scanner Integration',
            duration: '22:30',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rn-13',
            lessonId: 'rn-13',
            title: 'Biometric Authentication (Face ID & Fingerprint) with Expo LocalAuthentication',
            lessonTitle: 'Biometric Authentication (Face ID & Fingerprint) with Expo LocalAuthentication',
            duration: '18:20',
            durationMinutes: 18,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rn-14',
            lessonId: 'rn-14',
            title: 'Automated CI/CD with EAS Submit: App Store & Google Play Store',
            lessonTitle: 'Automated CI/CD with EAS Submit: App Store & Google Play Store',
            duration: '35:00',
            durationMinutes: 35,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-design-systems-modern-ui-ux',
    _id: 'course-design-systems-modern-ui-ux',
    slug: 'design-systems-modern-ui-ux',
    title: 'Design Systems with Figma & Tailwind CSS for Developers',
    courseTitle: 'Design Systems with Figma & Tailwind CSS for Developers',
    subtitle: 'Bridge design and code: Atomic component tokens, accessibility (a11y), responsive fluid typography, and interactive micro-animations.',
    courseDescription: 'Learn how elite design teams build maintainable, accessible design systems. Translate Figma variables directly into Tailwind tokens, build accessible Radix UI primitives, write Storybook documentation, and maintain brand consistency.',
    category: 'UI/UX Design',
    level: 'Beginner',
    price: 89,
    coursePrice: 89,
    originalPrice: 149,
    discount: 40,
    rating: 4.93,
    ratings: Array(27).fill({ rating: 5 }),
    reviewsCount: 2150,
    duration: '16h 15m',
    durationMinutes: 975,
    lessonsCount: 14,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    instructor: {
      name: 'Sophie Laurent',
      role: 'Staff Product Designer & Design Systems Lead',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      bio: 'Pioneer of token-driven design systems at scale. Led design engineering bridging multidisciplinary teams of 150+ engineers and designers.',
      company: 'Studio Pixel'
    },
    tutorNames: 'Sophie Laurent',
    institutionName: 'Studio Pixel Design Guild',
    type: 'video',
    badge: 'Design Engineering',
    createdAt: '2025-01-19T10:30:00.000Z',
    enrolledStudents: Array(2150).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Design Tokens & System Thinking',
        description: 'Semantic color scales, typography ramps, and Figma variables.',
        lessons: [
          {
            id: 'ui-1',
            lessonId: 'ui-1',
            title: 'Design Tokens: Bridging the Figma-to-Code Chasm',
            lessonTitle: 'Design Tokens: Bridging the Figma-to-Code Chasm',
            duration: '15:20',
            durationMinutes: 15,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'ui-2',
            lessonId: 'ui-2',
            title: 'Building Fluid Typography & Spacing Scales with Tailwind CSS',
            lessonTitle: 'Building Fluid Typography & Spacing Scales with Tailwind CSS',
            duration: '18:40',
            durationMinutes: 19,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'ui-3',
            lessonId: 'ui-3',
            title: 'Dark Mode & Theming: Automated CSS Variable Switches',
            lessonTitle: 'Dark Mode & Theming: Automated CSS Variable Switches',
            duration: '21:10',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ui-4',
            lessonId: 'ui-4',
            title: 'Exporting Figma Variables to JSON Tokens via GitHub Actions',
            lessonTitle: 'Exporting Figma Variables to JSON Tokens via GitHub Actions',
            duration: '24:00',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Accessible Primitives & Radix UI',
        description: 'ARIA attributes, keyboard navigation, and focus management.',
        lessons: [
          {
            id: 'ui-5',
            lessonId: 'ui-5',
            title: 'Web Content Accessibility Guidelines (WCAG 2.2 AA) in Code',
            lessonTitle: 'Web Content Accessibility Guidelines (WCAG 2.2 AA) in Code',
            duration: '20:30',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ui-6',
            lessonId: 'ui-6',
            title: 'Building Headless Accessible Dropdowns & Modals with Radix UI',
            lessonTitle: 'Building Headless Accessible Dropdowns & Modals with Radix UI',
            duration: '27:15',
            durationMinutes: 27,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ui-7',
            lessonId: 'ui-7',
            title: 'Managing Focus Traps and Screen Reader Announcements',
            lessonTitle: 'Managing Focus Traps and Screen Reader Announcements',
            duration: '22:00',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Motion & Tactile Micro-Interactions',
        description: 'Framer Motion springs, magnetic hover physics, and layout animations.',
        lessons: [
          {
            id: 'ui-8',
            lessonId: 'ui-8',
            title: 'Micro-Interactions: Why Physics-Based Springs Feel Premium',
            lessonTitle: 'Micro-Interactions: Why Physics-Based Springs Feel Premium',
            duration: '17:40',
            durationMinutes: 18,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ui-9',
            lessonId: 'ui-9',
            title: 'Crafting Glassmorphism & Subtle Radial Hover Spotlights',
            lessonTitle: 'Crafting Glassmorphism & Subtle Radial Hover Spotlights',
            duration: '22:50',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ui-10',
            lessonId: 'ui-10',
            title: 'Layout Morphing Animations with Framer Motion layoutId',
            lessonTitle: 'Layout Morphing Animations with Framer Motion layoutId',
            duration: '25:10',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ui-11',
            lessonId: 'ui-11',
            title: 'Design System Checklist & Token Architecture Cheat Sheet',
            lessonTitle: 'Design System Checklist & Token Architecture Cheat Sheet',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Documentation & Storybook Publishing',
        description: 'Storybook 8 setup, visual regression tests with Chromatic, and NPM publishing.',
        lessons: [
          {
            id: 'ui-12',
            lessonId: 'ui-12',
            title: 'Interactive Component Playgrounds with Storybook 8',
            lessonTitle: 'Interactive Component Playgrounds with Storybook 8',
            duration: '21:00',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ui-13',
            lessonId: 'ui-13',
            title: 'Automated Visual Regression Testing with Chromatic',
            lessonTitle: 'Automated Visual Regression Testing with Chromatic',
            duration: '19:30',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ui-14',
            lessonId: 'ui-14',
            title: 'Packaging & Publishing Your Component Library to NPM',
            lessonTitle: 'Packaging & Publishing Your Component Library to NPM',
            duration: '32:00',
            durationMinutes: 32,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-enterprise-typescript-patterns',
    _id: 'course-enterprise-typescript-patterns',
    slug: 'enterprise-typescript-patterns',
    title: 'Enterprise TypeScript 5.5: Types, Patterns & Scalable Codebases',
    courseTitle: 'Enterprise TypeScript 5.5: Types, Patterns & Scalable Codebases',
    subtitle: 'Advanced conditional typing, template literal types, AST transform plugins, monorepo architecture with Turborepo, and domain-driven design (DDD).',
    courseDescription: 'Transform TypeScript from a simple linter into a formidable mathematical correctness engine. Master recursive mapped types, branded nominal types, type-safe API contracts (tRPC/Zod), and monorepo build pipelines.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 99,
    coursePrice: 99,
    originalPrice: 169,
    discount: 41,
    rating: 4.96,
    ratings: Array(29).fill({ rating: 5 }),
    reviewsCount: 3120,
    duration: '17h 45m',
    durationMinutes: 1065,
    lessonsCount: 15,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    instructor: {
      name: 'David Miller',
      role: 'Principal Software Architect & Technical Author',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'Author of bestselling guides on advanced type gymnastics. Consulted on TypeScript adoption for major financial institutions and open-source SDKs.',
      company: 'TypeMaster Guild'
    },
    tutorNames: 'David Miller',
    institutionName: 'TypeMaster Guild',
    type: 'video',
    badge: 'Must Watch',
    createdAt: '2025-01-21T08:30:00.000Z',
    enrolledStudents: Array(3120).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Advanced Type Level Gymnastics',
        description: 'Conditional types, infer keyword, and recursive mapped types.',
        lessons: [
          {
            id: 'ts-1',
            lessonId: 'ts-1',
            title: 'Type Level Programming: The infer Keyword Demystified',
            lessonTitle: 'Type Level Programming: The infer Keyword Demystified',
            duration: '16:40',
            durationMinutes: 17,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'ts-2',
            lessonId: 'ts-2',
            title: 'Template Literal Types & String Pattern Parsing',
            lessonTitle: 'Template Literal Types & String Pattern Parsing',
            duration: '20:15',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'ts-3',
            lessonId: 'ts-3',
            title: 'Nominal Typing & Branded Types for Secure Domain Primitives',
            lessonTitle: 'Nominal Typing & Branded Types for Secure Domain Primitives',
            duration: '18:50',
            durationMinutes: 19,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ts-4',
            lessonId: 'ts-4',
            title: 'Deep Mapped Types: Creating DeepPartial and DeepReadonly',
            lessonTitle: 'Deep Mapped Types: Creating DeepPartial and DeepReadonly',
            duration: '22:30',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Runtime Validation & End-to-End Type Safety',
        description: 'Zod schemas, tRPC contract sharing, and API generation.',
        lessons: [
          {
            id: 'ts-5',
            lessonId: 'ts-5',
            title: 'Bridging Runtime Data and Static Types with Zod v3',
            lessonTitle: 'Bridging Runtime Data and Static Types with Zod v3',
            duration: '21:00',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ts-6',
            lessonId: 'ts-6',
            title: 'End-to-End Type Safety without Code Generation (tRPC)',
            lessonTitle: 'End-to-End Type Safety without Code Generation (tRPC)',
            duration: '27:40',
            durationMinutes: 28,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ts-7',
            lessonId: 'ts-7',
            title: 'Discriminated Unions & Exhaustiveness Checking with Never',
            lessonTitle: 'Discriminated Unions & Exhaustiveness Checking with Never',
            duration: '17:20',
            durationMinutes: 17,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ts-8',
            lessonId: 'ts-8',
            title: 'Custom ESLint Rules with TypeScript AST Query Selectors',
            lessonTitle: 'Custom ESLint Rules with TypeScript AST Query Selectors',
            duration: '29:00',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Monorepo Architecture with Turborepo',
        description: 'Workspace configuration, internal packages, and remote build caching.',
        lessons: [
          {
            id: 'ts-9',
            lessonId: 'ts-9',
            title: 'Structuring Scalable Monorepos with Turborepo & pnpm',
            lessonTitle: 'Structuring Scalable Monorepos with Turborepo & pnpm',
            duration: '24:15',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ts-10',
            lessonId: 'ts-10',
            title: 'Internal Shared Packages without Build Steps (TypeScript 5.x)',
            lessonTitle: 'Internal Shared Packages without Build Steps (TypeScript 5.x)',
            duration: '20:45',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ts-11',
            lessonId: 'ts-11',
            title: 'Remote Caching & Blazing Fast CI/CD Verification Pipelines',
            lessonTitle: 'Remote Caching & Blazing Fast CI/CD Verification Pipelines',
            duration: '23:30',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ts-12',
            lessonId: 'ts-12',
            title: 'TypeScript 5.5 Compiler Flags & Best Practices Guide',
            lessonTitle: 'TypeScript 5.5 Compiler Flags & Best Practices Guide',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Domain-Driven Design (DDD) Patterns',
        description: 'Entities, value objects, aggregates, and repository interfaces.',
        lessons: [
          {
            id: 'ts-13',
            lessonId: 'ts-13',
            title: 'Modeling Aggregates & Invariants with Immutable Records',
            lessonTitle: 'Modeling Aggregates & Invariants with Immutable Records',
            duration: '25:00',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ts-14',
            lessonId: 'ts-14',
            title: 'Dependency Inversion: Decoupling Domain from Database Adapters',
            lessonTitle: 'Dependency Inversion: Decoupling Domain from Database Adapters',
            duration: '28:30',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'ts-15',
            lessonId: 'ts-15',
            title: 'Capstone: Refactoring a Spaghetti Codebase into Clean DDD',
            lessonTitle: 'Capstone: Refactoring a Spaghetti Codebase into Clean DDD',
            duration: '38:00',
            durationMinutes: 38,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'course-generative-ai-rag-mastery',
    _id: 'course-generative-ai-rag-mastery',
    slug: 'generative-ai-rag-application-mastery',
    title: 'Enterprise RAG: Retrieval-Augmented Generation & Vector Search',
    courseTitle: 'Enterprise RAG: Retrieval-Augmented Generation & Vector Search',
    subtitle: 'Build production RAG systems with hybrid search, graph RAG, re-ranking models, multimodal document parsing, and agentic workflows.',
    courseDescription: 'Stop building toy vector search apps. Learn how enterprises index messy PDFs, balance semantic vs lexical search with BM25, apply cross-encoder re-rankers, track hallucinations, and evaluate RAG pipelines using Ragas metrics.',
    category: 'Artificial Intelligence',
    level: 'Beginner',
    price: 49,
    coursePrice: 49,
    originalPrice: 99,
    discount: 50,
    rating: 4.94,
    ratings: Array(23).fill({ rating: 5 }),
    reviewsCount: 1780,
    duration: '14h 20m',
    durationMinutes: 860,
    lessonsCount: 14,
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    instructor: {
      name: 'Dr. Sophia Vance',
      role: 'Principal AI Architect at Anthropic Labs',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Pioneered chunking strategies and multi-hop query decomposition models. Advisor to leading search engines and LLM developer tooling startups.',
      company: 'Anthropic Labs'
    },
    tutorNames: 'Dr. Sophia Vance',
    institutionName: 'Anthropic Labs',
    type: 'video',
    badge: 'Fast Track',
    createdAt: '2025-01-26T16:00:00.000Z',
    enrolledStudents: Array(1780).fill('std_id'),
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Document Chunking & Ingestion Pipelines',
        description: 'Semantic chunking, table extraction from PDFs, and embedding benchmarks.',
        lessons: [
          {
            id: 'rag-1',
            lessonId: 'rag-1',
            title: 'Why Naive RAG Fails: Context Fragmentation & Retrieval Noise',
            lessonTitle: 'Why Naive RAG Fails: Context Fragmentation & Retrieval Noise',
            duration: '14:15',
            durationMinutes: 14,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'rag-2',
            lessonId: 'rag-2',
            title: 'Semantic Chunking & Parent-Child Document Indexing',
            lessonTitle: 'Semantic Chunking & Parent-Child Document Indexing',
            duration: '18:40',
            durationMinutes: 19,
            type: 'video',
            lessonType: 'video',
            isFreePreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          },
          {
            id: 'rag-3',
            lessonId: 'rag-3',
            title: 'Multimodal Document Parsing: Extracting Complex Tables with Vision LLMs',
            lessonTitle: 'Multimodal Document Parsing: Extracting Complex Tables with Vision LLMs',
            duration: '22:50',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rag-4',
            lessonId: 'rag-4',
            title: 'Embedding Models Compared: OpenAI, Cohere, and Open-Weights BGE',
            lessonTitle: 'Embedding Models Compared: OpenAI, Cohere, and Open-Weights BGE',
            duration: '20:10',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Hybrid Search & Re-Ranking Pipelines',
        description: 'Reciprocal Rank Fusion (RRF), BM25 lexical matching, and cross-encoders.',
        lessons: [
          {
            id: 'rag-5',
            lessonId: 'rag-5',
            title: 'Hybrid Search: Combining Dense Vectors and BM25 Sparse Keywords',
            lessonTitle: 'Hybrid Search: Combining Dense Vectors and BM25 Sparse Keywords',
            duration: '23:00',
            durationMinutes: 23,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rag-6',
            lessonId: 'rag-6',
            title: 'Cross-Encoder Re-Ranking with Cohere Rerank and FlashRank',
            lessonTitle: 'Cross-Encoder Re-Ranking with Cohere Rerank and FlashRank',
            duration: '19:30',
            durationMinutes: 20,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rag-7',
            lessonId: 'rag-7',
            title: 'Contextual Compression: Pruning Irrelevant Tokens before Generation',
            lessonTitle: 'Contextual Compression: Pruning Irrelevant Tokens before Generation',
            duration: '21:15',
            durationMinutes: 21,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Graph RAG & Knowledge Graphs',
        description: 'Entity extraction, Neo4j graph stores, and multi-hop reasoning.',
        lessons: [
          {
            id: 'rag-8',
            lessonId: 'rag-8',
            title: 'Introduction to Graph RAG: When Vector Proximity is Not Enough',
            lessonTitle: 'Introduction to Graph RAG: When Vector Proximity is Not Enough',
            duration: '24:00',
            durationMinutes: 24,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rag-9',
            lessonId: 'rag-9',
            title: 'Automated Knowledge Graph Construction with LLMs and Neo4j',
            lessonTitle: 'Automated Knowledge Graph Construction with LLMs and Neo4j',
            duration: '28:40',
            durationMinutes: 29,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rag-10',
            lessonId: 'rag-10',
            title: 'Multi-Hop Query Resolution across Interconnected Documents',
            lessonTitle: 'Multi-Hop Query Resolution across Interconnected Documents',
            duration: '26:10',
            durationMinutes: 26,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rag-11',
            lessonId: 'rag-11',
            title: 'RAG Architecture Blueprint & Evaluation Metric Reference',
            lessonTitle: 'RAG Architecture Blueprint & Evaluation Metric Reference',
            duration: '15:00',
            durationMinutes: 15,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Evaluation, Hallucination Guards & Production',
        description: 'Ragas evaluation framework, Guardrails AI, and continuous regression tests.',
        lessons: [
          {
            id: 'rag-12',
            lessonId: 'rag-12',
            title: 'Evaluating RAG with Ragas: Faithfulness, Answer Relevance & Context Recall',
            lessonTitle: 'Evaluating RAG with Ragas: Faithfulness, Answer Relevance & Context Recall',
            duration: '25:20',
            durationMinutes: 25,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rag-13',
            lessonId: 'rag-13',
            title: 'Preventing Hallucinations with Citation Grounding & Guardrails AI',
            lessonTitle: 'Preventing Hallucinations with Citation Grounding & Guardrails AI',
            duration: '22:15',
            durationMinutes: 22,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          },
          {
            id: 'rag-14',
            lessonId: 'rag-14',
            title: 'Capstone: Production Enterprise Support Bot with Live Citations',
            lessonTitle: 'Capstone: Production Enterprise Support Bot with Live Citations',
            duration: '38:00',
            durationMinutes: 38,
            type: 'video',
            lessonType: 'video',
            isFreePreview: false
          }
        ]
      }
    ],
    lessons: []
  }
];

// 4 Upcoming Live Online Classes
export const SEED_LIVE_CLASSES: Course[] = [
  {
    id: 'live-agentic-rag-workshop',
    _id: 'live-agentic-rag-workshop',
    slug: 'live-agentic-rag-masterclass',
    title: 'Live Masterclass: Multi-Agent Swarms with Claude 3.5 & LangGraph',
    courseTitle: 'Live Masterclass: Multi-Agent Swarms with Claude 3.5 & LangGraph',
    subtitle: 'Interactive 3-hour cohort live session with Dr. Sophia Vance. Build a live autonomous research team with real-time code reviews.',
    courseDescription: 'Join this live interactive cohort streamed over Google Meet. We will build, debug, and benchmark an autonomous agent team collaboratively with live Q&A, hands-on breakout rooms, and downloadable session recordings.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    price: 99,
    coursePrice: 99,
    originalPrice: 199,
    discount: 50,
    rating: 4.98,
    ratings: Array(32).fill({ rating: 5 }),
    reviewsCount: 310,
    duration: '3h 30m',
    durationMinutes: 210,
    lessonsCount: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    instructor: {
      name: 'Dr. Sophia Vance',
      role: 'Principal AI Architect at Anthropic Labs',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Former DeepMind research scientist specializing in multi-agent reasoning and human alignment.',
      company: 'Anthropic Labs'
    },
    tutorNames: 'Dr. Sophia Vance',
    institutionName: 'Anthropic Labs',
    type: 'online',
    badge: 'Next Tuesday Live',
    createdAt: '2025-01-29T10:00:00.000Z',
    enrolledStudents: Array(310).fill('std_id'),
    curriculum: [
      {
        id: 'live-mod-1',
        title: 'Live Stream Schedule & Cohort Rooms',
        lessons: [
          {
            id: 'live-l-1',
            lessonId: 'live-l-1',
            title: 'Live Session: Multi-Agent Swarm Construction & Breakouts',
            lessonTitle: 'Live Session: Multi-Agent Swarm Construction & Breakouts',
            duration: '120:00',
            durationMinutes: 120,
            type: 'online',
            lessonType: 'online',
            isFreePreview: true,
            meetLink: 'https://meet.google.com/ndm-tech-live',
            timeSchedule: '2025-02-05T18:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'live-l-2',
            lessonId: 'live-l-2',
            title: 'Live Q&A, Agent Architecture Review & Office Hours',
            lessonTitle: 'Live Q&A, Agent Architecture Review & Office Hours',
            duration: '60:00',
            durationMinutes: 60,
            type: 'online',
            lessonType: 'online',
            isFreePreview: true,
            meetLink: 'https://meet.google.com/ndm-tech-live',
            timeSchedule: '2025-02-05T20:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'live-l-3',
            lessonId: 'live-l-3',
            title: 'Session Slides & Multi-Agent Swarm Repository Assets',
            lessonTitle: 'Session Slides & Multi-Agent Swarm Repository Assets',
            duration: '30:00',
            durationMinutes: 30,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'live-nextjs-app-router-clinic',
    _id: 'live-nextjs-app-router-clinic',
    slug: 'live-nextjs-server-actions-clinic',
    title: 'Live Cohort: Next.js 15 Server Actions & Edge Middleware Clinic',
    courseTitle: 'Live Cohort: Next.js 15 Server Actions & Edge Middleware Clinic',
    subtitle: 'Live architectural clinic with Alex Chen. Bring your Next.js bottlenecks for real-time profiling and refactoring.',
    courseDescription: 'Real-time debugging clinic. Watch real enterprise production codebases get refactored live to eliminate hydration mismatches, optimize caching waterfalls, and streamline edge middleware.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 89,
    coursePrice: 89,
    originalPrice: 179,
    discount: 50,
    rating: 4.95,
    ratings: Array(25).fill({ rating: 5 }),
    reviewsCount: 420,
    duration: '3h 00m',
    durationMinutes: 180,
    lessonsCount: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    instructor: {
      name: 'Alex Chen',
      role: 'Staff Frontend Engineer & React Core Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Next.js core specialist and maintainer of high-scale React architectures.',
      company: 'Vercel Ecosystem'
    },
    tutorNames: 'Alex Chen',
    institutionName: 'Frontend Masters Guild',
    type: 'online',
    badge: 'Live Stream',
    createdAt: '2025-01-27T14:00:00.000Z',
    enrolledStudents: Array(420).fill('std_id'),
    curriculum: [
      {
        id: 'live-mod-2',
        title: 'Live Clinic Sessions',
        lessons: [
          {
            id: 'live-n-1',
            lessonId: 'live-n-1',
            title: 'Live Clinic: Refactoring Production Next.js 15 Waterfalls',
            lessonTitle: 'Live Clinic: Refactoring Production Next.js 15 Waterfalls',
            duration: '90:00',
            durationMinutes: 90,
            type: 'online',
            lessonType: 'online',
            isFreePreview: true,
            meetLink: 'https://meet.google.com/ndm-next-live',
            timeSchedule: '2025-02-07T17:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'live-n-2',
            lessonId: 'live-n-2',
            title: 'Interactive Code Reviews & Edge Routing Clinic',
            lessonTitle: 'Interactive Code Reviews & Edge Routing Clinic',
            duration: '60:00',
            durationMinutes: 60,
            type: 'online',
            lessonType: 'online',
            isFreePreview: true,
            meetLink: 'https://meet.google.com/ndm-next-live',
            timeSchedule: '2025-02-07T18:45:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'live-n-3',
            lessonId: 'live-n-3',
            title: 'Clinic Production Refactor Code Samples (ZIP / PDF)',
            lessonTitle: 'Clinic Production Refactor Code Samples (ZIP / PDF)',
            duration: '30:00',
            durationMinutes: 30,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'live-system-design-interview-mock',
    _id: 'live-system-design-interview-mock',
    slug: 'live-system-design-mock-interview',
    title: 'Live Workshop: System Design Mock Interview for Staff Engineers',
    courseTitle: 'Live Workshop: System Design Mock Interview for Staff Engineers',
    subtitle: 'Live simulation with Elena Rostova. Watch candidate mock interviews, rubric evaluations, and architectural trade-off negotiations.',
    courseDescription: 'Experience a live, unscripted Staff+ system design interview. Elena Rostova grills candidates through real requirements, calculating throughput limits, sharding strategies, and failover design.',
    category: 'Database Design',
    level: 'Advanced',
    price: 109,
    coursePrice: 109,
    originalPrice: 199,
    discount: 45,
    rating: 4.97,
    ratings: Array(28).fill({ rating: 5 }),
    reviewsCount: 560,
    duration: '3h 30m',
    durationMinutes: 210,
    lessonsCount: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    instructor: {
      name: 'Elena Rostova',
      role: 'VP of Infrastructure & Distributed Systems',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Former BigTech interview bar raiser. Conducted over 600 Staff and Principal engineering interviews.',
      company: 'ScaleMesh Labs'
    },
    tutorNames: 'Elena Rostova',
    institutionName: 'ScaleMesh Labs',
    type: 'online',
    badge: 'Live Mock Interview',
    createdAt: '2025-01-25T11:00:00.000Z',
    enrolledStudents: Array(560).fill('std_id'),
    curriculum: [
      {
        id: 'live-mod-3',
        title: 'Mock Interview Agenda',
        lessons: [
          {
            id: 'live-sd-1',
            lessonId: 'live-sd-1',
            title: 'Live Staff Interview: Design Global Real-Time Payment Settlement',
            lessonTitle: 'Live Staff Interview: Design Global Real-Time Payment Settlement',
            duration: '90:00',
            durationMinutes: 90,
            type: 'online',
            lessonType: 'online',
            isFreePreview: true,
            meetLink: 'https://meet.google.com/ndm-sys-live',
            timeSchedule: '2025-02-09T16:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'live-sd-2',
            lessonId: 'live-sd-2',
            title: 'Bar Raiser Evaluation, Rubric Breakdown & Audience Feedback',
            lessonTitle: 'Bar Raiser Evaluation, Rubric Breakdown & Audience Feedback',
            duration: '60:00',
            durationMinutes: 60,
            type: 'online',
            lessonType: 'online',
            isFreePreview: true,
            meetLink: 'https://meet.google.com/ndm-sys-live',
            timeSchedule: '2025-02-09T18:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'live-sd-3',
            lessonId: 'live-sd-3',
            title: 'Staff Engineering Scoring Rubric & Feedback Matrix',
            lessonTitle: 'Staff Engineering Scoring Rubric & Feedback Matrix',
            duration: '30:00',
            durationMinutes: 30,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'live-kubernetes-production-outage',
    _id: 'live-kubernetes-production-outage',
    slug: 'live-kubernetes-production-outage',
    title: 'Live War Room: Debugging a Production Kubernetes Outage Live',
    courseTitle: 'Live War Room: Debugging a Production Kubernetes Outage Live',
    subtitle: 'Live chaos engineering war room with Marcus Sterling. Diagnose real OOM kills, DNS storm failures, and ingress drops.',
    courseDescription: 'Step directly into the hot seat of an incident responder. Watch real-time Grafana alert triage, kubectl debug workflows, and post-mortem creation during an intentional simulated cluster crash.',
    category: 'Cloud Computing',
    level: 'Intermediate',
    price: 99,
    coursePrice: 99,
    originalPrice: 189,
    discount: 47,
    rating: 4.92,
    ratings: Array(24).fill({ rating: 5 }),
    reviewsCount: 380,
    duration: '3h 00m',
    durationMinutes: 180,
    lessonsCount: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    instructor: {
      name: 'Marcus Sterling',
      role: 'Head of Cloud Platform Infrastructure',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'SRE veteran managing 99.999% uptime clusters. Specializes in chaos engineering and high-stress incident recovery.',
      company: 'CloudNative Architects'
    },
    tutorNames: 'Marcus Sterling',
    institutionName: 'CloudNative Architects',
    type: 'online',
    badge: 'Live War Room',
    createdAt: '2025-01-28T15:00:00.000Z',
    enrolledStudents: Array(380).fill('std_id'),
    curriculum: [
      {
        id: 'live-mod-4',
        title: 'War Room Schedule',
        lessons: [
          {
            id: 'live-k8s-1',
            lessonId: 'live-k8s-1',
            title: 'Live Outage Simulation: CoreDNS Saturation & Cascading Pod Evictions',
            lessonTitle: 'Live Outage Simulation: CoreDNS Saturation & Cascading Pod Evictions',
            duration: '90:00',
            durationMinutes: 90,
            type: 'online',
            lessonType: 'online',
            isFreePreview: true,
            meetLink: 'https://meet.google.com/ndm-k8s-live',
            timeSchedule: '2025-02-12T17:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'live-k8s-2',
            lessonId: 'live-k8s-2',
            title: 'Triage, Remediation & Live Post-Mortem Incident Documentation',
            lessonTitle: 'Triage, Remediation & Live Post-Mortem Incident Documentation',
            duration: '60:00',
            durationMinutes: 60,
            type: 'online',
            lessonType: 'online',
            isFreePreview: true,
            meetLink: 'https://meet.google.com/ndm-k8s-live',
            timeSchedule: '2025-02-12T18:45:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          },
          {
            id: 'live-k8s-3',
            lessonId: 'live-k8s-3',
            title: 'SRE Post-Mortem Template & Incident Runbook Guide',
            lessonTitle: 'SRE Post-Mortem Template & Incident Runbook Guide',
            duration: '30:00',
            durationMinutes: 30,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      }
    ],
    lessons: []
  }
];

// 4 Hands-On In-Person Physical Workshops
export const SEED_WORKSHOPS: Course[] = [
  {
    id: 'workshop-san-francisco-ai-hardware',
    _id: 'workshop-san-francisco-ai-hardware',
    slug: 'workshop-san-francisco-ai-hardware',
    title: 'Hands-on Workshop: Edge AI & Local LLM Fine-Tuning Lab',
    courseTitle: 'Hands-on Workshop: Edge AI & Local LLM Fine-Tuning Lab',
    subtitle: 'Physical 2-day in-person workshop at Ndemy San Francisco Innovation Hub. Hands-on workstation labs with NVIDIA GPUs.',
    courseDescription: 'Join our hands-on in-person workshop in downtown San Francisco. Bring your laptop and run hands-on fine-tuning labs on dedicated cloud workstations and edge AI clusters with personal mentor guidance.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    price: 399,
    coursePrice: 399,
    originalPrice: 599,
    discount: 33,
    rating: 4.98,
    ratings: Array(34).fill({ rating: 5 }),
    reviewsCount: 195,
    duration: '16h 00m',
    durationMinutes: 960,
    lessonsCount: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    instructor: {
      name: 'Dr. Sophia Vance',
      role: 'Principal AI Architect at Anthropic Labs',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Leading in-person AI engineering clinics and hardware acceleration workshops.',
      company: 'Anthropic Labs'
    },
    tutorNames: 'Dr. Sophia Vance',
    institutionName: 'Ndemy SF Innovation Hub',
    type: 'offline',
    badge: 'In-Person (San Francisco)',
    createdAt: '2025-01-20T09:00:00.000Z',
    enrolledStudents: Array(195).fill('std_id'),
    curriculum: [
      {
        id: 'ws-mod-1',
        title: 'San Francisco On-Site Schedule',
        lessons: [
          {
            id: 'ws-sf-1',
            lessonId: 'ws-sf-1',
            title: 'Day 1 Morning: Hardware Acceleration & GPU Kernel Profiling',
            lessonTitle: 'Day 1 Morning: Hardware Acceleration & GPU Kernel Profiling',
            duration: '240:00',
            durationMinutes: 240,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: true,
            locationDetails: 'Ndemy SF Innovation Hub, 548 Market St, San Francisco, CA 94104',
            timeSchedule: '2025-02-15T09:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'ws-sf-2',
            lessonId: 'ws-sf-2',
            title: 'Day 1 Afternoon: Local LLM Quantization & FlashAttention Hands-On',
            lessonTitle: 'Day 1 Afternoon: Local LLM Quantization & FlashAttention Hands-On',
            duration: '240:00',
            durationMinutes: 240,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: true,
            locationDetails: 'Ndemy SF Innovation Hub, 548 Market St, San Francisco, CA 94104',
            timeSchedule: '2025-02-15T14:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'ws-sf-3',
            lessonId: 'ws-sf-3',
            title: 'Day 2: Multi-GPU Distributed LoRA Training Lab',
            lessonTitle: 'Day 2: Multi-GPU Distributed LoRA Training Lab',
            duration: '480:00',
            durationMinutes: 480,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: false,
            locationDetails: 'Ndemy SF Innovation Hub, 548 Market St, San Francisco, CA 94104',
            timeSchedule: '2025-02-16T09:00:00.000Z'
          },
          {
            id: 'ws-sf-4',
            lessonId: 'ws-sf-4',
            title: 'Physical Lab Manual & GPU Cluster Access Credentials',
            lessonTitle: 'Physical Lab Manual & GPU Cluster Access Credentials',
            duration: '30:00',
            durationMinutes: 30,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'workshop-new-york-distributed-systems',
    _id: 'workshop-new-york-distributed-systems',
    slug: 'workshop-new-york-distributed-systems',
    title: 'Hands-on Workshop: High-Frequency Distributed Systems Lab',
    courseTitle: 'Hands-on Workshop: High-Frequency Distributed Systems Lab',
    subtitle: 'Physical 2-day intensive at Ndemy Manhattan Tech Campus. Build ultra-low latency matching engines and consensus rings.',
    courseDescription: 'Spend 2 intensive days at our Wall Street classroom. Work in pairs to design, code, and benchmark an in-memory lock-free order book and distributed consensus cluster.',
    category: 'Database Design',
    level: 'Advanced',
    price: 449,
    coursePrice: 449,
    originalPrice: 650,
    discount: 31,
    rating: 4.99,
    ratings: Array(36).fill({ rating: 5 }),
    reviewsCount: 240,
    duration: '16h 00m',
    durationMinutes: 960,
    lessonsCount: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    instructor: {
      name: 'Elena Rostova',
      role: 'VP of Infrastructure & Distributed Systems',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Architect of sub-millisecond market data distribution systems in New York.',
      company: 'ScaleMesh Labs'
    },
    tutorNames: 'Elena Rostova',
    institutionName: 'Ndemy Manhattan Tech Campus',
    type: 'offline',
    badge: 'In-Person (New York)',
    createdAt: '2025-01-22T08:00:00.000Z',
    enrolledStudents: Array(240).fill('std_id'),
    curriculum: [
      {
        id: 'ws-mod-2',
        title: 'Manhattan Classroom Agenda',
        lessons: [
          {
            id: 'ws-ny-1',
            lessonId: 'ws-ny-1',
            title: 'Day 1 Morning: Lock-Free Queues & Cache-Line Alignment in C++/Rust',
            lessonTitle: 'Day 1 Morning: Lock-Free Queues & Cache-Line Alignment in C++/Rust',
            duration: '240:00',
            durationMinutes: 240,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: true,
            locationDetails: 'Ndemy Manhattan Tech Campus, 110 Wall Street, New York, NY 10005',
            timeSchedule: '2025-02-22T09:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'ws-ny-2',
            lessonId: 'ws-ny-2',
            title: 'Day 1 Afternoon: Building the Matching Engine Core',
            lessonTitle: 'Day 1 Afternoon: Building the Matching Engine Core',
            duration: '240:00',
            durationMinutes: 240,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: true,
            locationDetails: 'Ndemy Manhattan Tech Campus, 110 Wall Street, New York, NY 10005',
            timeSchedule: '2025-02-22T14:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'ws-ny-3',
            lessonId: 'ws-ny-3',
            title: 'Day 2: Raft Consensus Under Simulated Network Partitions',
            lessonTitle: 'Day 2: Raft Consensus Under Simulated Network Partitions',
            duration: '480:00',
            durationMinutes: 480,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: false,
            locationDetails: 'Ndemy Manhattan Tech Campus, 110 Wall Street, New York, NY 10005',
            timeSchedule: '2025-02-23T09:00:00.000Z'
          },
          {
            id: 'ws-ny-4',
            lessonId: 'ws-ny-4',
            title: 'Wall Street Systems Engineering Reference Workbook',
            lessonTitle: 'Wall Street Systems Engineering Reference Workbook',
            duration: '30:00',
            durationMinutes: 30,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'workshop-london-cloud-platform',
    _id: 'workshop-london-cloud-platform',
    slug: 'workshop-london-cloud-platform',
    title: 'Hands-on Workshop: Multi-Cloud Terraform & GitOps Bootcamp',
    courseTitle: 'Hands-on Workshop: Multi-Cloud Terraform & GitOps Bootcamp',
    subtitle: 'Physical 2-day in-person workshop at Ndemy London Shoreditch Studio. Deploy multi-region clusters with live instructors.',
    courseDescription: 'Immerse yourself in platform engineering at our Shoreditch studio. Set up automated multi-cloud infrastructure with Terraform, ArgoCD, and Istio with individual code reviews.',
    category: 'Cloud Computing',
    level: 'Intermediate',
    price: 349,
    coursePrice: 349,
    originalPrice: 499,
    discount: 30,
    rating: 4.91,
    ratings: Array(27).fill({ rating: 5 }),
    reviewsCount: 180,
    duration: '16h 00m',
    durationMinutes: 960,
    lessonsCount: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    instructor: {
      name: 'Marcus Sterling',
      role: 'Head of Cloud Platform Infrastructure',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'Cloud architecture mentor training enterprise platform teams across Europe.',
      company: 'CloudNative Architects'
    },
    tutorNames: 'Marcus Sterling',
    institutionName: 'Ndemy London Shoreditch Studio',
    type: 'offline',
    badge: 'In-Person (London)',
    createdAt: '2025-01-24T12:00:00.000Z',
    enrolledStudents: Array(180).fill('std_id'),
    curriculum: [
      {
        id: 'ws-mod-3',
        title: 'London Shoreditch Agenda',
        lessons: [
          {
            id: 'ws-lon-1',
            lessonId: 'ws-lon-1',
            title: 'Day 1 Morning: Infrastructure as Code with Terraform & OpenTofu',
            lessonTitle: 'Day 1 Morning: Infrastructure as Code with Terraform & OpenTofu',
            duration: '240:00',
            durationMinutes: 240,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: true,
            locationDetails: 'Ndemy London Shoreditch Studio, 25 City Road, London EC1Y 1AA, UK',
            timeSchedule: '2025-03-01T09:30:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          },
          {
            id: 'ws-lon-2',
            lessonId: 'ws-lon-2',
            title: 'Day 1 Afternoon: ArgoCD Multi-Cluster GitOps Setup',
            lessonTitle: 'Day 1 Afternoon: ArgoCD Multi-Cluster GitOps Setup',
            duration: '240:00',
            durationMinutes: 240,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: true,
            locationDetails: 'Ndemy London Shoreditch Studio, 25 City Road, London EC1Y 1AA, UK',
            timeSchedule: '2025-03-01T14:30:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
          },
          {
            id: 'ws-lon-3',
            lessonId: 'ws-lon-3',
            title: 'Day 2: Zero-Trust Istio Service Mesh & Secret Management',
            lessonTitle: 'Day 2: Zero-Trust Istio Service Mesh & Secret Management',
            duration: '480:00',
            durationMinutes: 480,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: false,
            locationDetails: 'Ndemy London Shoreditch Studio, 25 City Road, London EC1Y 1AA, UK',
            timeSchedule: '2025-03-02T09:30:00.000Z'
          },
          {
            id: 'ws-lon-4',
            lessonId: 'ws-lon-4',
            title: 'GitOps Multi-Cloud Production Architecture Blueprint',
            lessonTitle: 'GitOps Multi-Cloud Production Architecture Blueprint',
            duration: '30:00',
            durationMinutes: 30,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      }
    ],
    lessons: []
  },
  {
    id: 'workshop-seattle-rust-systems',
    _id: 'workshop-seattle-rust-systems',
    slug: 'workshop-seattle-rust-systems',
    title: 'Hands-on Workshop: High-Performance Rust & Embedded Systems',
    courseTitle: 'Hands-on Workshop: High-Performance Rust & Embedded Systems',
    subtitle: 'Physical 2-day workshop at Ndemy Seattle Labs. Write low-level device drivers and async networking servers.',
    courseDescription: 'Connect directly with systems engineers in downtown Seattle. Bring your laptop and work on real hardware microcontrollers and high-throughput networking pipelines with Nathan Drake.',
    category: 'Web Development',
    level: 'Advanced',
    price: 389,
    coursePrice: 389,
    originalPrice: 550,
    discount: 29,
    rating: 4.96,
    ratings: Array(31).fill({ rating: 5 }),
    reviewsCount: 165,
    duration: '16h 00m',
    durationMinutes: 960,
    lessonsCount: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    courseThumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    instructor: {
      name: 'Nathan Drake',
      role: 'Staff Systems Engineer at Cloudflare',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      bio: 'Author of low-level systems drivers and embedded Rust networking stacks.',
      company: 'Cloudflare'
    },
    tutorNames: 'Nathan Drake',
    institutionName: 'Ndemy Seattle Labs',
    type: 'offline',
    badge: 'In-Person (Seattle)',
    createdAt: '2025-01-26T10:00:00.000Z',
    enrolledStudents: Array(165).fill('std_id'),
    curriculum: [
      {
        id: 'ws-mod-4',
        title: 'Seattle Labs Agenda',
        lessons: [
          {
            id: 'ws-sea-1',
            lessonId: 'ws-sea-1',
            title: 'Day 1 Morning: Bare-Metal Rust on ARM Cortex Microcontrollers',
            lessonTitle: 'Day 1 Morning: Bare-Metal Rust on ARM Cortex Microcontrollers',
            duration: '240:00',
            durationMinutes: 240,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: true,
            locationDetails: 'Ndemy Seattle Labs, 400 Pine St, Seattle, WA 98101',
            timeSchedule: '2025-03-08T09:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
          },
          {
            id: 'ws-sea-2',
            lessonId: 'ws-sea-2',
            title: 'Day 1 Afternoon: Direct Memory Access (DMA) & Interrupt Handlers',
            lessonTitle: 'Day 1 Afternoon: Direct Memory Access (DMA) & Interrupt Handlers',
            duration: '240:00',
            durationMinutes: 240,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: true,
            locationDetails: 'Ndemy Seattle Labs, 400 Pine St, Seattle, WA 98101',
            timeSchedule: '2025-03-08T14:00:00.000Z',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
          },
          {
            id: 'ws-sea-3',
            lessonId: 'ws-sea-3',
            title: 'Day 2: Async Embedded Networking with Embassy Framework',
            lessonTitle: 'Day 2: Async Embedded Networking with Embassy Framework',
            duration: '480:00',
            durationMinutes: 480,
            type: 'offline',
            lessonType: 'offline',
            isFreePreview: false,
            locationDetails: 'Ndemy Seattle Labs, 400 Pine St, Seattle, WA 98101',
            timeSchedule: '2025-03-09T09:00:00.000Z'
          },
          {
            id: 'ws-sea-4',
            lessonId: 'ws-sea-4',
            title: 'Embedded Rust Microcontroller Lab Schematics & Guide',
            lessonTitle: 'Embedded Rust Microcontroller Lab Schematics & Guide',
            duration: '30:00',
            durationMinutes: 30,
            type: 'pdf',
            lessonType: 'pdf',
            isFreePreview: false,
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        ]
      }
    ],
    lessons: []
  }
];

// Helper to flatten lessons for all courses and ensure 100% legacy compatibility
function populateLessons(list: Course[]): Course[] {
  return list.map(c => {
    const flatLessons: Lesson[] = [];
    c.curriculum.forEach(mod => {
      mod.lessons.forEach(l => {
        flatLessons.push({
          ...l,
          videoUrl: l.videoUrl || c.previewVideoUrl
        });
      });
    });
    return {
      ...c,
      lessons: flatLessons,
      lessonsCount: flatLessons.length || c.lessonsCount
    };
  });
}

export const ALL_COURSES: Course[] = populateLessons([
  ...SEED_COURSES,
  ...SEED_LIVE_CLASSES,
  ...SEED_WORKSHOPS
]);

// Quick lookup functions
export function getCourseByIdOrSlug(idOrSlug: string): Course | undefined {
  if (!idOrSlug) return undefined;
  const lower = idOrSlug.toLowerCase();
  return ALL_COURSES.find(
    c => c.id.toLowerCase() === lower ||
         c._id.toLowerCase() === lower ||
         c.slug.toLowerCase() === lower ||
         c.title.toLowerCase().includes(lower)
  );
}

export function getCoursesByType(type?: 'video' | 'online' | 'offline' | 'all'): Course[] {
  if (!type || type === 'all') return ALL_COURSES;
  if (type === 'online') {
    return ALL_COURSES.filter(c => c.type === 'online' || c.lessons.some(l => l.lessonType === 'online'));
  }
  if (type === 'offline') {
    return ALL_COURSES.filter(c => c.type === 'offline' || c.lessons.some(l => l.lessonType === 'offline'));
  }
  return ALL_COURSES.filter(c => c.type === 'video');
}
