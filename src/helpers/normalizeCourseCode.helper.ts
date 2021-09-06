export function normalizeCourseCode(courseCode: string) {
  const courseCodePrefix = (
    courseCode.match(/([a-zA-Z]+)/)?.at(0) as string
  ).toUpperCase();
  const codeRegexNumbersIterator = courseCode.matchAll(/(\d+)/g);
  const courseCodeNumber = (
    codeRegexNumbersIterator.next()?.value?.at(0) as string
  ).toUpperCase();
  const courseCodeSection = (
    codeRegexNumbersIterator.next()?.value?.at(0) as string
  ).toUpperCase();
  const courseName = `${courseCodePrefix ?? ""}${courseCodeNumber ?? ""}${
    courseCodeSection ? "-" + courseCodeSection : ""
  }`.toUpperCase();

  return { courseCodePrefix, courseCodeNumber, courseCodeSection, courseName };
}
