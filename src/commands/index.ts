import { BulkCreateCoursesCommand } from "./course-bulk-create/course-bulk-create.command";
import { BulkDeleteCoursesCommand } from "./course-bulk-delete/course-bulk-delete.command";
import { ICommand } from "./command.interface";
import { CreateCourseCommand } from "./create/create.command";
import { CreateSelfRoleCommand } from "./role-create/role-create.command";
import { CreateTagCommand } from "./tag-create/tag-create.command";
import { DeleteCourseCommand } from "./course-delete/course-delete.command";
import { DeleteSelfRoleCommand } from "./role-delete/role-delete.command";
import { DeleteTagCommand } from "./delete-tag/delete-tag.command";
import { JoinCourseCommand } from "./course-join/join.command";
import { JoinSelfRoleCommand } from "./role-join/role-join.command";
import { LeaveCourseCommand } from "./leave/leave.command";
import { LeaveSelfRoleCommand } from "./role-leave/leave-role.command";
import { ListCoursesCommand } from "./course-list/course-list.command";
import { ListRolesCommand } from "./list-roles/list-roles.command";
import { ListTagsCommand } from "./tag-list/tag-list.command";
import { LogCommand } from "./log/log.command";
import { PingCommand } from "./ping/ping.command";
import { RequestCourseCommand } from "./course-request/course-request.command";
import { SayCommand } from "./say/say.command";
import { SetCoursePasswordCommand } from "./course-set-password/course-set-password.command";
import { SourceCommand } from "./source/source.command";
import { SetupCommand } from "../setup/setup.command";
import { SudoCommand } from "./sudo/sudo.command";
import { TagCommand } from "./tag/tag.command";
import { ListQuartersCommand } from "./quarter-list/quarter-list.command";
import { AliasCommand } from "./course-alias/course-alias.command";
import { InviteCommand } from "./invite/invite.command";
import { CreateQotdCommand } from "./qotd/create/create.command";
import { DeleteQotdCommand } from "./qotd/delete/delete.command";
import { DispatchQotdCommand } from "./qotd/dispatch/dispatch.command";
import { ListQotdCommand } from "./qotd/list/list.command";
import { RealNameSetCommand } from "./realname-set/realname-set.command";
import { RealNameGetCommand } from "./realname-get/realname-get.command";
import { ListCourseMembersCommand } from "./course-member-list/course-member-list.command";
import { QotdCommand } from "./qotd/qotd.command";

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
  new RealNameSetCommand(),
  new RealNameGetCommand(),
  new ListCourseMembersCommand(),
  new QotdCommand(),
];

export function createSetupCommand() {
  if (!commands.find((c) => c.name === "setup"))
    commands.push(new SetupCommand());
}

export function getCommands() {
  return commands;
}

export {
  commands,
  PingCommand,
  SayCommand,
  SudoCommand,
  SourceCommand,
  JoinCourseCommand,
  LeaveCourseCommand,
  ListCoursesCommand,
  CreateCourseCommand,
  BulkCreateCoursesCommand,
  DeleteCourseCommand,
  BulkDeleteCoursesCommand,
  SetCoursePasswordCommand,
  RequestCourseCommand,
  LogCommand,
  CreateSelfRoleCommand,
  DeleteSelfRoleCommand,
  JoinSelfRoleCommand,
  LeaveSelfRoleCommand,
  CreateTagCommand,
  TagCommand,
  DeleteTagCommand,
  ListTagsCommand,
  ListRolesCommand,
  ListQuartersCommand,
  AliasCommand,
  InviteCommand,
  CreateQotdCommand,
  DeleteQotdCommand,
  DispatchQotdCommand,
  ListQotdCommand,
  RealNameSetCommand,
  RealNameGetCommand,
  ListCourseMembersCommand,
};
