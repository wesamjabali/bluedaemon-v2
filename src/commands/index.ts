import { BulkCreateCoursesCommand } from "./bulk-create-courses/bulk-create-courses.command";
import { BulkDeleteCoursesCommand } from "./bulk-delete-courses/bulk-delete-courses.command";
import { ICommand } from "./command.interface";
import { CreateCourseCommand } from "./create-course/create-course.command";
import { CreateSelfRoleCommand } from "./create-role/create-role.command";
import { CreateTagCommand } from "./create-tag/create-tag.command";
import { DeleteCourseCommand } from "./delete-course/delete-course.command";
import { DeleteSelfRoleCommand } from "./delete-role/delete-role.command";
import { DeleteTagCommand } from "./delete-tag/delete-tag.command";
import { JoinCourseCommand } from "./join-course/join-course.command";
import { JoinSelfRoleCommand } from "./join-role/join-role.command";
import { LeaveCourseCommand } from "./leave-course/leave-course.command";
import { LeaveSelfRoleCommand } from "./leave-role/leave-role.command";
import { ListCoursesCommand } from "./list-courses/list-courses.command";
import { ListRolesCommand } from "./list-roles/list-roles.command";
import { ListTagsCommand } from "./list-tags/list-tags.command";
import { LogCommand } from "./log/log.command";
import { PingCommand } from "./ping/ping.command";
import { RequestCourseCommand } from "./request-course/request-course.command";
import { SayCommand } from "./say/say.command";
import { SetCoursePasswordCommand } from "./set-course-password/set-course-password.command";
import { SourceCommand } from "./source/source.command";
import { SetupCommand } from "../setup/setup.command";
import { SudoCommand } from "./sudo/sudo.command";
import { TagCommand } from "./tag/tag.command";
import { ListQuartersCommand } from "./list-quarters/list-quarters.command";
import { AliasCommand } from "./alias/alias.command";
import { InviteCommand } from "./invite/invite.command";
import { CreateQotdCommand } from "./create-qotd/create-qotd.command";
import { DeleteQotdCommand } from "./delete-qotd/delete-qotd.command";
import { DispatchQotdCommand } from "./dispatch-qotd/dispatch-qotd.command";
import { RealNameSetCommand } from "./set-realname/set-realname.command";
import { RealNameGetCommand } from "./get-realname/get-realname.command";
import { ListCourseMembersCommand } from "./list-course-members/list-course-members.command";

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
  new CreateSelfRoleCommand(),
  new DeleteSelfRoleCommand(),
  new JoinSelfRoleCommand(),
  new LeaveSelfRoleCommand(),
  new CreateTagCommand(),
  new TagCommand(),
  new DeleteTagCommand(),
  new ListTagsCommand(),
  new ListRolesCommand(),
  new ListQuartersCommand(),
  new AliasCommand(),
  new InviteCommand(),
  new CreateQotdCommand(),
  new DeleteQotdCommand(),
  new DispatchQotdCommand(),
  new RealNameSetCommand(),
  new RealNameGetCommand(),
  new ListCourseMembersCommand(),
];

export function createSetupCommand() {
  if (!commands.find((c) => c.name === "setup"))
    commands.push(new SetupCommand());
}

export function getCommands() {
  return commands;
}

export { commands, PingCommand, SayCommand, SourceCommand, SudoCommand };
