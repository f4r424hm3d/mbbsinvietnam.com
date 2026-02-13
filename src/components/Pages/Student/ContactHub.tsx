import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  MessageCircle, 
  Clock,
  Send,
  Navigation,
  CheckCircle,
  User,
 
  Video,

} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: string;
  urgency: string;
}

interface DirectionsFormData {
  fromAddress: string;
  transportMode: string;
  arrivalTime: string;
}

interface MeetingFormData {
  name: string;
  email: string;
  phone: string;
  meetingType: string;
  preferredDate: string;
  preferredTime: string;
  duration: string;
  topic: string;
  notes: string;
}

interface EmailScheduleData {
  recipientEmail: string;
  subject: string;
  message: string;
  scheduleDate: string;
  scheduleTime: string;
  priority: string;
}

const ContactHub: React.FC = () => {
  const [activeForm, setActiveForm] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedForm, setSubmittedForm] = useState<string>('');

  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: '',
    urgency: ''
  });

  const [directionsForm, setDirectionsForm] = useState<DirectionsFormData>({
    fromAddress: '',
    transportMode: 'driving',
    arrivalTime: ''
  });

  const [meetingForm, setMeetingForm] = useState<MeetingFormData>({
    name: '',
    email: '',
    phone: '',
    meetingType: '',
    preferredDate: '',
    preferredTime: '',
    duration: '',
    topic: '',
    notes: ''
  });

  const [emailSchedule, setEmailSchedule] = useState<EmailScheduleData>({
    recipientEmail: '',
    subject: '',
    message: '',
    scheduleDate: '',
    scheduleTime: '',
    priority: ''
  });

  const contactOptions = [
    {
      id: 'directions',
      title: 'Get Directions',
      description: 'Find the best route to our office',
      icon: Navigation,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setActiveForm('directions')
    },
    {
      id: 'contact',
      title: 'Contact Us',
      description: 'Send us a message or inquiry',
      icon: Mail,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      action: () => setActiveForm('contact')
    },
    {
      id: 'meeting',
      title: 'Schedule Meeting',
      description: 'Book a consultation or appointment',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => setActiveForm('meeting')
    },
    {
      id: 'call',
      title: 'Call Us',
      description: 'Speak with us directly',
      icon: Phone,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.open('tel:+1-555-123-4567')
    },
    {
      id: 'chat',
      title: 'Start Chat',
      description: 'Live chat support available',
      icon: MessageCircle,
      color: 'bg-teal-500 hover:bg-teal-600',
      action: () => alert('Chat feature would integrate with your live chat service')
    },
    {
      id: 'email',
      title: 'Send Email',
      description: 'Direct email communication',
      icon: Send,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => window.open('mailto:info@medicalscholarship.org')
    },
    {
      id: 'schedule-email',
      title: 'Schedule Email',
      description: 'Schedule an email for later',
      icon: Clock,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => setActiveForm('schedule-email')
    },
    {
      id: 'video-call',
      title: 'Video Call',
      description: 'Schedule a video consultation',
      icon: Video,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => alert('Video call scheduling would integrate with Zoom/Teams')
    }
  ];

  const handleSubmit = (formType: string) => {
    setSubmittedForm(formType);
    setIsSubmitted(true);
    setActiveForm('');
  };

  const resetForms = () => {
    setIsSubmitted(false);
    setSubmittedForm('');
    setActiveForm('');
    setContactForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: '',
      urgency: ''
    });
    setDirectionsForm({
      fromAddress: '',
      transportMode: 'driving',
      arrivalTime: ''
    });
    setMeetingForm({
      name: '',
      email: '',
      phone: '',
      meetingType: '',
      preferredDate: '',
      preferredTime: '',
      duration: '',
      topic: '',
      notes: ''
    });
    setEmailSchedule({
      recipientEmail: '',
      subject: '',
      message: '',
      scheduleDate: '',
      scheduleTime: '',
      priority: ''
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Success!</h2>
          <p className="text-gray-600 mb-6">
            {submittedForm === 'contact' && 'Your message has been sent successfully. We will get back to you within 24 hours.'}
            {submittedForm === 'directions' && 'Directions have been generated! Check your email for the detailed route.'}
            {submittedForm === 'meeting' && 'Your meeting has been scheduled! You will receive a confirmation email shortly.'}
            {submittedForm === 'schedule-email' && 'Your email has been scheduled successfully and will be sent at the specified time.'}
          </p>
          <button
            onClick={resetForms}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Contact Options
          </button>
        </div>
      </div>
    );
  }

  if (activeForm === 'directions') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Navigation className="w-7 h-7 text-blue-600" />
              Get Directions
            </h2>
            <button
              onClick={() => setActiveForm('')}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ← Back
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Our Location</p>
                <p className="text-blue-800">123 Medical Center Drive, Suite 456</p>
                <p className="text-blue-800">Healthcare City, HC 12345</p>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit('directions'); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={directionsForm.fromAddress}
                  onChange={(e) => setDirectionsForm(prev => ({ ...prev, fromAddress: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your starting address"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transportation Mode
                </label>
                <select
                  value={directionsForm.transportMode}
                  onChange={(e) => setDirectionsForm(prev => ({ ...prev, transportMode: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="driving">Driving</option>
                  <option value="walking">Walking</option>
                  <option value="transit">Public Transit</option>
                  <option value="bicycling">Bicycling</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Arrival Time
                </label>
                <input
                  type="datetime-local"
                  value={directionsForm.arrivalTime}
                  onChange={(e) => setDirectionsForm(prev => ({ ...prev, arrivalTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (activeForm === 'contact') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Mail className="w-7 h-7 text-emerald-600" />
              Contact Us
            </h2>
            <button
              onClick={() => setActiveForm('')}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit('contact'); }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  value={contactForm.preferredContact}
                  onChange={(e) => setContactForm(prev => ({ ...prev, preferredContact: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select preference</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text Message</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Brief subject line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  value={contactForm.urgency}
                  onChange={(e) => setContactForm(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select urgency</option>
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Response within 2-3 days</option>
                  <option value="high">High - Response within 24 hours</option>
                  <option value="urgent">Urgent - Same day response needed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                required
                rows={6}
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Please provide details about your inquiry..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (activeForm === 'meeting') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-purple-600" />
              Schedule Meeting
            </h2>
            <button
              onClick={() => setActiveForm('')}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit('meeting'); }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={meetingForm.name}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={meetingForm.email}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={meetingForm.phone}
                    onChange={(e) => setMeetingForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type *
                </label>
                <select
                  required
                  value={meetingForm.meetingType}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, meetingType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select meeting type</option>
                  <option value="consultation">Initial Consultation</option>
                  <option value="scholarship">Scholarship Discussion</option>
                  <option value="application">Application Review</option>
                  <option value="follow-up">Follow-up Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={meetingForm.preferredDate}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <input
                  type="time"
                  required
                  value={meetingForm.preferredTime}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  value={meetingForm.duration}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select duration</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Topic *
              </label>
              <input
                type="text"
                required
                value={meetingForm.topic}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Brief description of what you'd like to discuss"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                rows={4}
                value={meetingForm.notes}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Any additional information or special requirements..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Schedule Meeting
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (activeForm === 'schedule-email') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Clock className="w-7 h-7 text-orange-600" />
              Schedule Email
            </h2>
            <button
              onClick={() => setActiveForm('')}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit('schedule-email'); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={emailSchedule.recipientEmail}
                  onChange={(e) => setEmailSchedule(prev => ({ ...prev, recipientEmail: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="recipient@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                required
                value={emailSchedule.subject}
                onChange={(e) => setEmailSchedule(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Email subject line"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date *
                </label>
                <input
                  type="date"
                  required
                  value={emailSchedule.scheduleDate}
                  onChange={(e) => setEmailSchedule(prev => ({ ...prev, scheduleDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Time *
                </label>
                <input
                  type="time"
                  required
                  value={emailSchedule.scheduleTime}
                  onChange={(e) => setEmailSchedule(prev => ({ ...prev, scheduleTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={emailSchedule.priority}
                  onChange={(e) => setEmailSchedule(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Normal</option>
                  <option value="low">Low</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                required
                rows={8}
                value={emailSchedule.message}
                onChange={(e) => setEmailSchedule(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Compose your email message..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Schedule Email
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact & Communication Hub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose how you'd like to connect with us. We offer multiple ways to get in touch and schedule interactions that work best for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              onClick={option.action}
              className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center mb-4 transition-colors`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{option.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600 text-sm">
              123 Medical Center Drive<br />
              Suite 456<br />
              Healthcare City, HC 12345
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm">
              Main: (555) 123-4567<br />
              Emergency: (555) 987-6543<br />
              Mon-Fri: 8AM-6PM
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm">
              info@medicalscholarship.org<br />
              support@medicalscholarship.org<br />
              Response within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHub;