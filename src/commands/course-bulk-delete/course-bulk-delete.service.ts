import { normalizeCourseCode } from "@/helpers/normalize-course-code.helper";
import { deleteCourse } from "../course-delete/course-delete.service";

export async function bulkDeleteCourses(
  coursesArray: string[],
  guildId: string,
  quarter: string
): Promise<string> {
  let normalizedCourses: string[] = [];
  coursesArray.forEach((c) => {
    const normalizedName = normalizeCourseCode(c);
    if (!normalizedName.courseCodeNumber || normalizedName.courseCodePrefix) {
      normalizedCourses.push(normalizedName.courseName);
    }
  });

  let response = `Done!\n`;
  for (const courseCode of normalizedCourses) {
    const newResponse = await deleteCourse(courseCode, guildId, quarter);

    response = `${response}\n${newResponse}`;
  }

  return response;
}
