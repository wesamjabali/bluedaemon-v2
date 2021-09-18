import { BulkCreateCoursesCommand } from "./bulk-create-courses/bulk-create-courses.command";
import { BulkDeleteCoursesCommand } from "./bulk-delete-courses/bulk-delete-courses.command";
import { ICommand } from "./command.interface";
import { CreateCourseCommand } from "./create-course/create-course.command";
import { DeleteCourseCommand } from "./delete-course/delete-course.command";
import { JoinCourseCommand } from "./join-course/join-course.command";
import { LeaveCourseCommand } from "./leave-course/leave-course.command";
import { ListCoursesCommand } from "./list-courses/list-courses.command";
import { LogCommand } from "./log/log.command";
import { PingCommand } from "./ping/ping.command";
import { RequestCourseCommand } from "./request-course/request-course.command";
import { SayCommand } from "./say/say.command";
import { SetCoursePasswordCommand } from "./set-course-password/set-course-password.command";
import { SourceCommand } from "./source/source.command";
import { SudoCommand } from "./sudo/sudo.command";

const commands: ICommand[] = [
  new SudoCommand(),
  new PingCommand(),
  new SourceCommand(),
  new JoinCourseCommand(),
  new LeaveCourseCommand(),
  new ListCoursesCommand(),
  new CreateCourseCommand(),
  new BulkCreateCoursesCommand(),
  new DeleteCourseCommand(),
  new BulkDeleteCoursesCommand(),
  new SetCoursePasswordCommand(),
  new RequestCourseCommand(),
  new LogCommand(),
];

export { commands, PingCommand, SayCommand, SourceCommand, SudoCommand };
