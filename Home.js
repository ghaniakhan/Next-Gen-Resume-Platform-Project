import { motion } from "framer-motion";
import StudentNavbar from "./StudentNavbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <StudentNavbar />

      {/* Jumbotron-style Hero Section */}
      <section className="bg-white h-screen shadow-md" style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/05/00/34/58/360_F_500345899_4OqmtspFst6SRnNQvLj7h7TfKOrBwTer.jpg')", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}  >
        <div className="max-w-10xl mx-auto text-center h-full flex flex-col justify-center">
            
        <br></br>
            <br></br>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🎓 Smart Resume Toolkit
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            
            <br></br>
            <br></br>

            <br></br>
            <br></br>
            <b>The all-in-one platform for creating job-winning resumes, optimizing ATS scores,
            and tracking your application progress — built for students, by students. 
            <br></br>Our toolkit
            helps you stand out from the competition and navigate the job application process
            with ease, ensuring you never miss an opportunity.</b>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Add any buttons or additional elements here */}
          </motion.div>
        </div>
      </section>

      {/* Additional Content Section (optional) */}
      <section className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Why Choose Smart Resume Toolkit?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
        {[ 
            {
              title: "📊 ATS Compatibility",
              desc: "Ensure your resume passes through Applicant Tracking Systems (ATS) with optimized keyword usage and proper formatting. Our ATS compatibility tool scans your resume for keyword relevance and alignment with job descriptions. We make sure your resume is perfectly tailored for the automated screenings that recruiters use today, increasing your chances of getting noticed.",
            },
            {
              title: "🎯 Targeted Templates",
              desc: "Choose from a range of modern, recruiter-approved templates that are specifically designed to highlight your skills and experiences in the best light. With customizable sections, professional layouts, and options tailored to different industries, you’ll have the perfect template for your needs. These templates are optimized for both readability and ATS performance, ensuring your resume makes an impact.",
            },
            {
              title: "📈 Progress Tracking",
              desc: "Track your resume history and improvements over time. Monitor changes to your ATS scores, review past versions of your resume, and see how your content evolves. Whether you’re revising an old resume or tracking the progress of new submissions, our tracking tool gives you valuable insights into your job application journey. Stay organized and always know how your efforts are paying off.",
            },
            {
              title: "🔍 Real-Time Feedback",
              desc: "Get real-time feedback on your resume and cover letter. Receive tips on formatting, content improvement, and keyword suggestions to help optimize your chances of passing ATS scans. Our instant feedback system helps you refine your application materials, ensuring you're always putting your best foot forward when applying for jobs.",
            },
            {
              title: "🧑‍💼 Career Resources",
              desc: "Gain access to a variety of career resources designed to guide you through the job application process. From cover letter writing tips to interview preparation strategies, we’ve got you covered. Our resources are built to give you a competitive edge, providing you with the knowledge and tools to succeed in your job search and ultimately land your dream job.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
