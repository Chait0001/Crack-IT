import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Resume from '../models/Resume.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crack-it-resume', {
      dbName: 'crack'
    });
    console.log('✅ Connected to MongoDB');

    // Remove existing demo data
    await User.deleteOne({ email: 'demo@crackit.dev' });

    const hashedPassword = await bcrypt.hash('demo1234', 12);
    const user = await User.create({
      name: 'Alex Johnson',
      email: 'demo@crackit.dev',
      password: hashedPassword,
    });

    await Resume.create({
      userId: user._id,
      title: 'Senior Software Engineer Resume',
      template: 'modern',
      colorTheme: '#6366f1',
      fontFamily: 'Inter',
      spacing: 'standard',
      resumeScore: 82,
      sections: {
        personalInfo: {
          name: 'Alex Johnson',
          email: 'alex.johnson@email.com',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/alexjohnson',
          portfolio: 'alexjohnson.dev',
          photo: null,
        },
        summary: {
          text: 'Results-driven Senior Software Engineer with 7+ years of experience building scalable web applications and distributed systems. Proven track record of leading cross-functional teams to deliver high-impact products that serve millions of users. Passionate about clean architecture, developer experience, and continuous improvement.',
        },
        experience: [
          {
            company: 'TechCorp Inc.',
            role: 'Senior Software Engineer',
            startDate: '2021-03',
            endDate: '',
            current: true,
            bullets: [
              'Led a team of 6 engineers to architect and launch a real-time analytics platform processing 5M+ events/day, reducing customer churn by 18%',
              'Refactored legacy monolith into 12 microservices using Node.js and Kubernetes, improving deployment frequency by 300%',
              'Implemented CI/CD pipelines with GitHub Actions reducing release cycles from 2 weeks to daily deployments',
              'Mentored 4 junior engineers and conducted 200+ code reviews, raising overall code quality scores by 40%',
              'Optimized database queries and caching strategies resulting in 60% reduction in API response times',
            ],
            order: 0,
          },
          {
            company: 'StartupXYZ',
            role: 'Software Engineer',
            startDate: '2018-06',
            endDate: '2021-02',
            current: false,
            bullets: [
              'Built the core payment processing module using Stripe API handling $2M+ monthly transactions with 99.99% reliability',
              'Developed responsive React frontend serving 150K+ monthly active users, achieving 95+ Lighthouse performance score',
              'Designed and implemented RESTful APIs consumed by iOS and Android mobile apps with 4.8-star app store ratings',
              'Collaborated with product and design teams to ship 3 major feature releases on schedule and under budget',
            ],
            order: 1,
          },
          {
            company: 'Digital Agency Co.',
            role: 'Junior Developer',
            startDate: '2017-01',
            endDate: '2018-05',
            current: false,
            bullets: [
              'Developed 15+ client websites using React, Vue.js, and WordPress, consistently delivering projects 10% ahead of schedule',
              'Integrated third-party APIs (Salesforce, HubSpot, Mailchimp) for 8 enterprise clients, increasing data accuracy by 35%',
              'Participated in agile ceremonies and contributed to sprint planning reducing sprint overflow by 25%',
            ],
            order: 2,
          },
        ],
        education: [
          {
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2013-09',
            endDate: '2017-05',
            gpa: '3.8',
            order: 0,
          },
        ],
        skills: [
          { name: 'JavaScript', level: 'Expert', order: 0 },
          { name: 'TypeScript', level: 'Expert', order: 1 },
          { name: 'React', level: 'Expert', order: 2 },
          { name: 'Node.js', level: 'Expert', order: 3 },
          { name: 'Python', level: 'Intermediate', order: 4 },
          { name: 'PostgreSQL', level: 'Expert', order: 5 },
          { name: 'MongoDB', level: 'Intermediate', order: 6 },
          { name: 'Docker', level: 'Intermediate', order: 7 },
          { name: 'Kubernetes', level: 'Intermediate', order: 8 },
          { name: 'AWS', level: 'Intermediate', order: 9 },
          { name: 'GraphQL', level: 'Intermediate', order: 10 },
          { name: 'Redis', level: 'Beginner', order: 11 },
        ],
        projects: [
          {
            name: 'OpenSource Dashboard',
            description: 'A real-time monitoring dashboard for distributed systems with customizable widgets and alerting. Used by 2000+ developers worldwide.',
            techStack: ['React', 'Node.js', 'WebSockets', 'InfluxDB', 'Grafana'],
            link: 'github.com/alex/os-dashboard',
            order: 0,
          },
          {
            name: 'AI Code Reviewer',
            description: 'CLI tool that integrates with GitHub PRs to provide automated code review suggestions using GPT-4, saving teams 3+ hours per sprint.',
            techStack: ['Python', 'OpenAI API', 'GitHub Actions', 'FastAPI'],
            link: 'github.com/alex/ai-reviewer',
            order: 1,
          },
        ],
        certifications: [
          { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023-04', link: '', order: 0 },
          { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2022-09', link: '', order: 1 },
        ],
        customSection: [],
        sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'customSection'],
      },
    });

    console.log('🌱 Demo user seeded:');
    console.log('   Email:    demo@crackit.dev');
    console.log('   Password: demo1234');
    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
