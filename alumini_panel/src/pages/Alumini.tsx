import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlumniCard } from "@/components/alumni/AlumniCard";
import { AlumniSearch } from "@/components/alumni/AlumniSearch";
import { Users, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase"; 
import { collection, getDocs, query, doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

const getStudentIdFromCookie = () => {
  const name = "user_session=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
};

interface AlumniType {
  id: string;
  name: string;
  emailId: string;
  branch: string;
  currentCity: string;
  designation: string;
  employerDetails: string;
  yearOfPassing: string;
  phoneNumber: string;
  isMentor?: boolean;
  isAvailable?: boolean;
  skills?: string[];
}

export default function Alumni() {
  const [alumniList, setAlumniList] = useState<AlumniType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const navigate = useNavigate();
  const currentStudentId = getStudentIdFromCookie();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const alumniRef = collection(db, "alumini"); 
        const querySnapshot = await getDocs(query(alumniRef));
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AlumniType[];
        setAlumniList(fetchedData);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  const handleQuickConnect = async (alumni: AlumniType) => {
    if (!currentStudentId) {
      alert("Please log in to connect.");
      return;
    }

    // Using alumni.id as the unique chat document ID
    const requestRef = doc(db, "mentorship_requests", alumni.id);

    try {
      const docSnap = await getDoc(requestRef);

      // Create or update the connection record
      await setDoc(requestRef, {
        name: alumni.name,   
        alumniId: alumni.id,
        studentId: currentStudentId,
        status: "approved",  
        updatedAt: Timestamp.now(),
        ...(!docSnap.exists() && { 
          messages: [], 
          createdAt: Timestamp.now(),
          batch: alumni.yearOfPassing || "" 
        })
      }, { merge: true });

      // Pass the name in the state so Chat.tsx can read it immediately
      navigate(`/chat/${alumni.id}`, { state: { alumniName: alumni.name } });
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  const filteredAlumni = alumniList.filter((alumni) => {
    const searchLower = searchQuery.toLowerCase();
    return searchQuery === "" ||
      alumni.name?.toLowerCase().includes(searchLower) ||
      alumni.employerDetails?.toLowerCase().includes(searchLower) ||
      alumni.designation?.toLowerCase().includes(searchLower) ||
      alumni.branch?.toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground animate-pulse font-medium">Scanning Nexus Network...</p>
        </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Alumni Discovery</h1>
          </div>
          <p className="text-gray-400">Networking with {alumniList.length} graduates</p>
        </div>

        <div className="mb-8">
          <AlumniSearch onSearch={setSearchQuery} onFilterChange={setActiveFilters} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumni) => (
            <AlumniCard 
              key={alumni.id} 
              alumni={{
                ...alumni,
                role: alumni.designation,
                company: alumni.employerDetails,
                companyLogo: alumni.name.charAt(0),
                location: alumni.currentCity,
                graduationYear: parseInt(alumni.yearOfPassing),
                avatar: alumni.name.charAt(0),
                skills: alumni.skills || [alumni.branch],
                isMentor: true,
                isAvailable: true
              }} 
              onConnect={() => handleQuickConnect(alumni)} 
            />
          ))}
        </div>
      </div>
  );
}