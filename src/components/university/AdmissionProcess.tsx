
import { FileText, UserCheck, CreditCard, Plane, GraduationCap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: FileText,
    title: "Document Preparation",
    description: "Gather all required documents including transcripts, passport, and medical certificates",
    timeframe: "1-2 weeks"
  },
  {
    icon: UserCheck,
    title: "Application Submission",
    description: "Submit your application with all necessary documents and personal statement",
    timeframe: "2-3 days"
  },
  {
    icon: CheckCircle,
    title: "Admission Confirmation",
    description: "Receive admission letter and confirmation from the university",
    timeframe: "1-2 weeks"
  },
  {
    icon: CreditCard,
    title: "Fee Payment",
    description: "Pay the required fees and complete the financial procedures",
    timeframe: "1-3 days"
  },
  {
    icon: Plane,
    title: "Visa Processing",
    description: "Apply for student visa and make travel arrangements",
    timeframe: "2-4 weeks"
  },
  {
    icon: GraduationCap,
    title: "Begin Studies",
    description: "Arrive at the university and start your MBBS journey",
    timeframe: "Academic year"
  }
];

const AdmissionProcess = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple Admission Process
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow our streamlined admission process to secure your seat in top medical universities 
            in Kyrgyzstan. We guide you through every step.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-blue-200 via-red-400 to-red-600"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative flex items-start mb-12 md:mb-16">
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                    {step.timeframe}
                  </div>
                </div>
                
                <div className="ml-8 flex-grow">
                  <div className="bg-gray-50 rounded-xl p-6 hover:bg-blue-50 transition-colors">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Step {index + 1}: {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/student/application-form"
           className="bg-gradient-to-r from-red-600 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-700 transition-all duration-300 font-medium text-lg shadow-lg">
            Start Your Application Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdmissionProcess;