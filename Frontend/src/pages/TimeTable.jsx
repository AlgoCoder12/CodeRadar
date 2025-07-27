import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, Calendar, Bell, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import FileUploader from "../components/FileUploader";


export default function TimeTablePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [table, setTable] = useState();
  const [subjectMap, setSubjectMap] = useState({});
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const { timeTable, getTimeTable, uploadTimeTable } = useUser();

  const handleFileUpload = (file) => {
    setSelectedFile(file);
  };

  const handleCancel = () => {
    setSelectedFile(null);
  };

  const upload = async (file) => {
    setLoading(true);
    try {
      const res = await uploadTimeTable(file);
      if (res) {
        // console.log("File uploaded successfully:", res);
        await getTT(); // Refresh timetable after upload
      } else {
        console.error("Failed to upload file");
      }
    } finally {
      setLoading(false);
    }
  };

  const processTableData = (data) => {
    // Separate mapping entries (lecturer is null)
    const mappingEntries = data.filter(item => item.lecturer === null);
    const actualClasses = data.filter(item => item.lecturer !== null);

    // Build subject code-to-name map
    const map = {};
    mappingEntries.forEach(item => {
      // Example: "CS32102 = Object Oriented Programming (3L)"
      const [code, name] = item.classTitle.split(" = ");
      if (code && name) {
        map[code.trim()] = name.trim();
      }
    });


    // Replace subject code with name in actual classes
    const processedClasses = actualClasses.map(item => {
      // Extract code from classTitle (e.g., "CS32102(L)" -> "CS32102")
      const codeMatch = item.classTitle.match(/^([A-Z0-9]+)\b/);
      const code = codeMatch ? codeMatch[1] : item.classTitle;
      const mappedName = map[code];
      if (mappedName) {
        // Preserve type suffix (e.g., "(L)", "(T)", "(P)")
        const typeSuffixMatch = item.classTitle.match(/(\([LTP]\))/);
        const typeSuffix = typeSuffixMatch ? typeSuffixMatch[1] : "";
        return {
          ...item,
          classTitle: `${mappedName} ${typeSuffix}`.trim()
        };
      }
      return item;
    });

    setSubjectMap(map);
    setTable(processedClasses);
  };


  

  // Update getTT to use processTableData
  const getTT = async () => {
    setLoading(true);
    try {
      const data = await getTimeTable();
      processTableData(data);
      // console.log(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTT();
    // console.log(timeTable);
  }, [token]);

  const getClassType = (classTitle) => {
    if (classTitle.includes('(L)')) return { type: 'Lecture', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (classTitle.includes('(T)')) return { type: 'Tutorial', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (classTitle.includes('(P)')) return { type: 'Practical', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
    return { type: 'Class', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
  };

  const groupByDay = (schedule) => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const grouped = {};
    
    days.forEach(day => {
      grouped[day] = schedule.filter(item => item.day === day)
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    });
    
    return grouped;
  };

  const groupedSchedule = table ? groupByDay(table) : {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            📚 My Timetable
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Upload your timetable to get smart notifications for your lectures
          </p>
        </div>

        {/* File Upload Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <FileUploader
            onFileUpload={handleFileUpload}
            onUpload={upload}
            onCancel={handleCancel}
            selectedFile={selectedFile}
            loading={loading}
          />
          
          {selectedFile && (
            <div className="mt-6 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Uploaded File Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                  <p className="text-gray-900 dark:text-white">{selectedFile.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Size:</span>
                  <p className="text-gray-900 dark:text-white">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                  <p className="text-gray-900 dark:text-white">{selectedFile.type}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timetable Display */}
        {table && table.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              📅 Weekly Schedule
            </h2>
            
            <div className="grid gap-6">
              {Object.entries(groupedSchedule).map(([day, classes]) => (
                classes.length > 0 && (
                  <div key={day} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                      <h3 className="text-xl font-bold text-white">{day}</h3>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid gap-4">
                        {classes.map((classItem) => {
                          const classType = getClassType(classItem.classTitle);
                          return (
                            <div key={classItem._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {classItem.classTitle}
                                    </h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${classType.color}`}>
                                      {classType.type}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                      <Clock className="mr-2 h-4 w-4" />
                                      <span>{classItem.start} - {classItem.end}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                      <MapPin className="mr-2 h-4 w-4" />
                                      <span>{classItem.venue}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                      <User className="mr-2 h-4 w-4" />
                                      <span>{classItem.lecturer}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-8 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Get Smart Notifications 🔔
          </Button>
        </div>

        {/* Stats Summary */}
        {table && table.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{table.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Classes</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {table.filter(c => c.classTitle.includes('(L)')).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Lectures</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {table.filter(c => c.classTitle.includes('(T)')).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Tutorials</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {table.filter(c => c.classTitle.includes('(P)')).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Practicals</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}