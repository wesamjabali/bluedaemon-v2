export function normalizeCourseCode(courseCode: string) {
  const courseCodePrefix = (
    courseCode.match(/([a-zA-Z]+)/g)?.shift() ?? ""
  ).toUpperCase();
  const codeRegexNumbersIterator = courseCode.matchAll(/(\d+)/g);
  const courseCodeNumber = (
    codeRegexNumbersIterator.next()?.value?.shift() ?? ""
  ).toUpperCase();
  const courseCodeSection = (
    codeRegexNumbersIterator.next()?.value?.shift() ?? ""
  ).toUpperCase();
  const courseName = `${courseCodePrefix ?? ""}${courseCodeNumber ?? ""}${
    courseCodeSection ? "-" + courseCodeSection : ""
  }`.toUpperCase();

  return { courseCodePrefix, courseCodeNumber, courseCodeSection, courseName };
}
