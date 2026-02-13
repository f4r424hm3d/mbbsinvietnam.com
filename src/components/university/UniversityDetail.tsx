import UniversityHero from "../university/UniversityHero";
import About from "../university/About";
import Facilities from "../university/Facilities";
import CampusPhotos from "../university/CampusPhotos";
import Rankings from "../university/Rankings";
import InternationalStudents from "../university/InternationalStudents";
import ParentTestimonials from "../university/ParentTestimonials";
import RatingsReviews from "../university/RatingsReviews";
import ApplicationForm from "../university/ApplicationForm";
import ApplicationProcedure from "../university/ApplicationProcedure";
import FAQ from "../university/FAQ";
import TrustSeals from "../university/TrustSeals";
import UniversitySch from "./UniversityScholarships/UniversitySch";
import CoursesMain from "./UniversityCourses/CoursesMain";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUniversityDetails, UniversityDetails, UniversityDetailsResponse } from "../../Api";

const UniversityDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [universityData, setUniversityData] = useState<UniversityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!slug) {
        setError("University slug not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response: UniversityDetailsResponse = await getUniversityDetails(slug);
        setUniversityData(response.data.university);
        setError(null);
      } catch (err) {
        console.error("Error fetching university data:", err);
        setError("Failed to load university data");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading university details...</p>
        </div>
      </div>
    );
  }

  if (error || !universityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading University</h2>
          <p className="text-gray-600">{error || "University not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UniversityHero universityData={universityData} />
      <About universityData={universityData} />
      <Facilities universityId={universityData.id} />
      <CoursesMain universityId={universityData.id} universitySlug={universityData.slug} />
      <CampusPhotos universityId={universityData.id} />
      <Rankings universityId={universityData.id} />
      <InternationalStudents universityId={universityData.id} />
      <UniversitySch universityId={universityData.id} />
      <ParentTestimonials universityId={universityData.id} />
      <RatingsReviews universityId={universityData.id} />
      <ApplicationForm universityData={universityData} />
      <ApplicationProcedure universityData={universityData} />
      <FAQ universityDetails={universityData.id} />
      <TrustSeals universityData={universityData} />
    </>
  );
};

export default UniversityDetail;
