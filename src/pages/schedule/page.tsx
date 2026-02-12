import { useEffect, useMemo, useState } from "react";
import apiClient from "../../lib/client";
import useStudentsStore from "../../store/students-store";
import useSubjectsStore from "../../store/subjects-store";

type TimetableEntry = {
  timetable_id: number;
  faculty_id: number;
  group_id: number;
  start_time: string;
  end_time: string;
  weekday: string;
  location?: string | null;
  subject_id: number;
};

type AttendanceEntry = {
  attendance_id: number;
  visited: boolean;
  visit_day: string;
  student_id: number;
  subject_id: number;
  timetable_id: number;
};

const WEEKDAY_ORDER: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

function SchedulePage() {
  const groups = useStudentsStore((state) => state.groups);
  const faculties = useStudentsStore((state) => state.faculties);
  const students = useStudentsStore((state) => state.students);
  const subjects = useSubjectsStore((state) => state.subjects);
  const setStudents = useStudentsStore((state) => state.setStudents);
  const setGroups = useStudentsStore((state) => state.setGroups);
  const setFaculties = useStudentsStore((state) => state.setFaculties);
  const setSubjects = useSubjectsStore((state) => state.setSubjects);

  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const [attendanceBySubject, setAttendanceBySubject] = useState<AttendanceEntry[]>([]);
  const [attendanceByStudent, setAttendanceByStudent] = useState<AttendanceEntry[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [attendanceGroupId, setAttendanceGroupId] = useState<string>("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attendanceVisited, setAttendanceVisited] = useState(true);
  const [selectedTimetableId, setSelectedTimetableId] = useState<string>("");
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [attendanceSuccess, setAttendanceSuccess] = useState<string | null>(null);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get("/groups"),
      apiClient.get("/faculties"),
      apiClient.get("/subjects"),
      apiClient.get("/students"),
    ])
      .then(([groupsResponse, facultiesResponse, subjectsResponse, studentsResponse]) => {
        setGroups(groupsResponse || []);
        setFaculties(facultiesResponse || []);
        setSubjects(subjectsResponse || []);
        setStudents(studentsResponse || []);
      })
      .catch((error) => {
        console.error("Error loading schedule metadata:", error);
      });
  }, [setFaculties, setGroups, setStudents, setSubjects]);

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoadingSchedule(true);
      setScheduleError(null);
      try {
        const endpoint = selectedGroupId === "all"
          ? "/all_class_schedule"
          : `/schedule/group/${selectedGroupId}`;
        const data = await apiClient.get(endpoint);
        setSchedule(data || []);
      } catch (error) {
        console.error("Error loading schedule:", error);
        setScheduleError("Failed to load schedule. Please try again.");
      } finally {
        setIsLoadingSchedule(false);
      }
    };

    fetchSchedule();
  }, [selectedGroupId]);

  const handleLoadAttendanceBySubject = async () => {
    if (!selectedSubjectId) return;
    setAttendanceError(null);
    try {
      const data = await apiClient.get(`/attendanceBySubjectId/${selectedSubjectId}`);
      setAttendanceBySubject(data || []);
    } catch (error) {
      console.error("Error loading attendance by subject:", error);
      setAttendanceError("Failed to load attendance by subject.");
    }
  };

  const handleLoadAttendanceByStudent = async () => {
    if (!selectedStudentId) return;
    setAttendanceError(null);
    try {
      const data = await apiClient.get(`/attendanceByStudentId/${selectedStudentId}`);
      setAttendanceByStudent(data || []);
    } catch (error) {
      console.error("Error loading attendance by student:", error);
      setAttendanceError("Failed to load attendance by student.");
    }
  };

  const handleRecordAttendance = async () => {
    if (!selectedStudentId || !selectedTimetableId || !attendanceDate) return;
    const timetableEntry = schedule.find((entry) => entry.timetable_id === Number(selectedTimetableId));
    if (!timetableEntry) return;

    setAttendanceError(null);
    setAttendanceSuccess(null);
    setIsSavingAttendance(true);
    try {
      await apiClient.post("/attendance/subject", {
        visited: attendanceVisited,
        visit_day: attendanceDate,
        student_id: Number(selectedStudentId),
        subject_id: timetableEntry.subject_id,
        timetable_id: timetableEntry.timetable_id,
      });
      setAttendanceSuccess("Attendance recorded.");
    } catch (error) {
      console.error("Error recording attendance:", error);
      setAttendanceError("Failed to record attendance.");
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const sortedSchedule = useMemo(() => {
    return [...schedule].sort((a, b) => {
      const orderA = WEEKDAY_ORDER[a.weekday?.toLowerCase?.() || ""] || 99;
      const orderB = WEEKDAY_ORDER[b.weekday?.toLowerCase?.() || ""] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.start_time.localeCompare(b.start_time);
    });
  }, [schedule]);

  const getGroupName = (groupId: number) => {
    return groups.find((group) => group.group_id === groupId)?.group_name || "Unknown";
  };

  const getFacultyName = (facultyId: number) => {
    return faculties.find((faculty) => faculty.faculty_id === facultyId)?.faculty_name || "Unknown";
  };

  const getSubjectName = (subjectId: number) => {
    return subjects.find((subject) => subject.subject_id === subjectId)?.subject_name || "Unknown";
  };

  const getStudentName = (studentId: number) => {
    const student = students.find((item) => item.student_id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : "Unknown";
  };

  const filteredStudents = useMemo(() => {
    if (attendanceGroupId === "all") return students;
    return students.filter((student) => String(student.group_id) === attendanceGroupId);
  }, [attendanceGroupId, students]);

  const formatDate = (value: string) => {
    if (!value) return "";
    return value.includes("T") ? value.split("T")[0] : value;
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-600 mt-2">
          View weekly class schedules by group and check attendance records.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Group
          </label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={selectedGroupId}
            onChange={(event) => setSelectedGroupId(event.target.value)}
          >
            <option value="all">All groups</option>
            {groups.map((group) => (
              <option key={group.group_id} value={group.group_id}>
                {group.group_name}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500">
            {isLoadingSchedule ? "Loading..." : `${schedule.length} entries`}
          </span>
          {scheduleError ? (
            <span className="text-xs text-red-600">{scheduleError}</span>
          ) : null}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Class Schedule</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Weekday</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Time</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Subject</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Group</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Faculty</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {sortedSchedule.length ? (
              sortedSchedule.map((entry) => (
                <tr key={entry.timetable_id}>
                  <td className="py-2 px-4 border-b border-gray-200 capitalize">{entry.weekday}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {entry.start_time} - {entry.end_time}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {getSubjectName(entry.subject_id)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {getGroupName(entry.group_id)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {getFacultyName(entry.faculty_id)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {entry.location || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-4 text-center text-gray-500" colSpan={6}>
                  {isLoadingSchedule ? "Loading schedule..." : "No schedule entries found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Attendance Lookup</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Subject</label>
            <div className="flex gap-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[220px]"
                value={selectedSubjectId}
                onChange={(event) => setSelectedSubjectId(event.target.value)}
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
                onClick={handleLoadAttendanceBySubject}
              >
                Load
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Student</label>
            <div className="flex flex-wrap gap-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={attendanceGroupId}
                onChange={(event) => setAttendanceGroupId(event.target.value)}
              >
                <option value="all">All groups</option>
                {groups.map((group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.group_name}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[220px]"
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
              >
                <option value="">Select student</option>
                {filteredStudents.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
                onClick={handleLoadAttendanceByStudent}
              >
                Load
              </button>
            </div>
          </div>
        </div>
        {attendanceError ? (
          <p className="text-sm text-red-600 mt-3">{attendanceError}</p>
        ) : null}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">By Subject</h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Date</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Student ID</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Student</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Visited</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Timetable ID</th>
              </tr>
            </thead>
            <tbody>
              {attendanceBySubject.length ? (
                attendanceBySubject.map((entry) => (
                  <tr key={entry.attendance_id}>
                    <td className="py-2 px-4 border-b border-gray-200">{formatDate(entry.visit_day)}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{entry.student_id}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{getStudentName(entry.student_id)}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {entry.visited ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">{entry.timetable_id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 text-center text-gray-500" colSpan={5}>
                    No attendance loaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">By Student</h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Date</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Subject</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Visited</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Timetable ID</th>
              </tr>
            </thead>
            <tbody>
              {attendanceByStudent.length ? (
                attendanceByStudent.map((entry) => (
                  <tr key={entry.attendance_id}>
                    <td className="py-2 px-4 border-b border-gray-200">{formatDate(entry.visit_day)}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {getSubjectName(entry.subject_id)}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {entry.visited ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">{entry.timetable_id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 text-center text-gray-500" colSpan={4}>
                    No attendance loaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Record Attendance</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Student</label>
            <div className="flex flex-wrap gap-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={attendanceGroupId}
                onChange={(event) => setAttendanceGroupId(event.target.value)}
              >
                <option value="all">All groups</option>
                {groups.map((group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.group_name}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[220px]"
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
              >
                <option value="">Select student</option>
                {filteredStudents.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Class</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[260px]"
              value={selectedTimetableId}
              onChange={(event) => setSelectedTimetableId(event.target.value)}
            >
              <option value="">Select timetable entry</option>
              {sortedSchedule.map((entry) => (
                <option key={entry.timetable_id} value={entry.timetable_id}>
                  {entry.weekday} {entry.start_time}-{entry.end_time} · {getSubjectName(entry.subject_id)} · {getGroupName(entry.group_id)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              type="date"
              value={attendanceDate}
              onChange={(event) => setAttendanceDate(event.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={attendanceVisited}
              onChange={(event) => setAttendanceVisited(event.target.checked)}
            />
            Visited
          </label>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer disabled:opacity-60"
            onClick={handleRecordAttendance}
            disabled={isSavingAttendance || !selectedStudentId || !selectedTimetableId || !attendanceDate}
          >
            {isSavingAttendance ? "Saving..." : "Record"}
          </button>
        </div>
        {attendanceError ? (
          <p className="text-sm text-red-600 mt-3">{attendanceError}</p>
        ) : null}
        {attendanceSuccess ? (
          <p className="text-sm text-green-700 mt-3">{attendanceSuccess}</p>
        ) : null}
      </div>
    </div>
  );
}

export default SchedulePage;