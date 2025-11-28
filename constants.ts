import { Project, Skill, Service, ExperienceItem, Testimonial, BlogPost } from './types';

export const HERO_TITLE = "Bahroze";
export const HERO_SUBTITLE = "Senior Full Stack Engineer & AI Specialist";
export const HERO_DESCRIPTION = "Crafting high-performance digital experiences with cutting-edge web technologies and generative AI.";
export const PROFILE_IMAGE_URL = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80";

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "AI Analytics Dashboard",
    description: "A comprehensive dashboard for visualizing complex datasets using machine learning algorithms to predict trends.",
    tags: ["React", "Python", "TensorFlow", "D3.js"],
    imageUrl: "https://picsum.photos/800/600?random=1",
    link: "#"
  },
  {
    id: 2,
    title: "E-Commerce Microservices",
    description: "Scalable backend architecture capable of handling millions of transactions per second, built with Go and Kubernetes.",
    tags: ["Go", "Kubernetes", "gRPC", "PostgreSQL"],
    imageUrl: "https://picsum.photos/800/600?random=2",
    link: "#"
  },
  {
    id: 3,
    title: "Generative Art Platform",
    description: "A community platform for creating and sharing AI-generated artwork using Stable Diffusion and Gemini.",
    tags: ["Next.js", "WebGL", "Gemini API", "Tailwind"],
    imageUrl: "https://picsum.photos/800/600?random=3",
    link: "#"
  },
  {
    id: 4,
    title: "Real-time Collab Tool",
    description: "Figma-like collaboration tool allowing multiple users to edit documents simultaneously with low latency.",
    tags: ["WebSocket", "React", "Rust", "Redis"],
    imageUrl: "https://picsum.photos/800/600?random=4",
    link: "#"
  }
];

export const SKILLS: Skill[] = [
  {
    category: "Frontend",
    items: ["React 18+", "TypeScript", "Tailwind CSS", "Next.js", "Three.js", "Framer Motion"]
  },
  {
    category: "Backend",
    items: ["Node.js", "Python", "Go", "PostgreSQL", "Redis", "GraphQL"]
  },
  {
    category: "AI & ML",
    items: ["Gemini API", "LangChain", "PyTorch", "OpenAI API", "Vector Databases"]
  },
  {
    category: "DevOps",
    items: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"]
  }
];

export const SERVICES: Service[] = [
  {
    title: "AI Integration",
    description: "Embedding state-of-the-art LLMs and vision models into web applications for smarter, adaptive user experiences.",
    icon: "BrainCircuit"
  },
  {
    title: "Full Stack Development",
    description: "Building end-to-end scalable web solutions using modern stacks like Next.js, React, Node.js, and Go.",
    icon: "Layers"
  },
  {
    title: "System Architecture",
    description: "Designing robust, microservice-based architectures that scale effortlessly with business growth.",
    icon: "Cpu"
  },
  {
    title: "UI/UX Engineering",
    description: "Bridging the gap between design and code to deliver pixel-perfect, highly performant interfaces.",
    icon: "Palette"
  }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 1,
    role: "Senior Full Stack Engineer",
    company: "TechNova Solutions",
    period: "2021 - Present",
    description: "Leading a team of 8 engineers to rebuild the core legacy platform into a modern microservices architecture, improving system throughput by 300%."
  },
  {
    id: 2,
    role: "AI Research Engineer",
    company: "Future AI Labs",
    period: "2019 - 2021",
    description: "Developed experimental RAG pipelines and fine-tuned open-source models for specific enterprise use cases."
  },
  {
    id: 3,
    role: "Frontend Developer",
    company: "Creative Digital Agency",
    period: "2017 - 2019",
    description: "Delivered award-winning interactive websites for Fortune 500 clients using WebGL and React."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "CTO",
    company: "FinTech Global",
    content: "Bahroze transformed our technical roadmap. His ability to blend AI innovation with solid engineering principles is unmatched.",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Director",
    company: "Orbit SaaS",
    content: "The level of polish and performance Bahroze delivered for our MVP was incredible. We secured funding largely due to the prototype quality.",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Founder",
    company: "Artisan AI",
    content: "A true craftsman. He doesn't just write code; he thinks about the product, the user, and the business impact.",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "The Future of AI Agents in Web Apps",
    excerpt: "How autonomous agents are changing the way we interact with SaaS platforms.",
    date: "Mar 15, 2024",
    readTime: "5 min read",
    imageUrl: "https://picsum.photos/800/600?random=10",
    link: "#"
  },
  {
    id: 2,
    title: "Optimizing React Server Components",
    excerpt: "Deep dive into performance patterns for Next.js 14 and beyond.",
    date: "Feb 28, 2024",
    readTime: "8 min read",
    imageUrl: "https://picsum.photos/800/600?random=11",
    link: "#"
  },
  {
    id: 3,
    title: "Building Scalable Vector Search",
    excerpt: "Implementing semantic search using Pinecone and Gemini embeddings.",
    date: "Jan 10, 2024",
    readTime: "6 min read",
    imageUrl: "https://picsum.photos/800/600?random=12",
    link: "#"
  }
];

export const CHAT_SYSTEM_INSTRUCTION = `You are "BahrozeAI", an intelligent virtual assistant for Bahroze's portfolio website. 
Your goal is to help visitors learn about Bahroze, his skills, projects, and experience.
Bahroze is a Senior Full Stack Engineer specializing in React, Node.js, and AI integration.
Be professional, concise, and enthusiastic.
If asked about contact info, suggest checking the contact section or emailing bahroze1@hotmail.com.
If asked about specific projects, reference the ones visible on the site (AI Analytics, E-Commerce, etc).
Do not hallucinate personal details that are not provided.
`;