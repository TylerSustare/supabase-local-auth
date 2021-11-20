import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NewClassroomInput } from './dto/new-classroom.input';
import { ClassroomsArgs } from './dto/classrooms.args';
import { Classroom } from './entities/classroom.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/supabase.guard';
import { SupabaseAuthUser } from 'nestjs-supabase-auth';
import { CurrentUser } from '../auth/current-user.decorator';
import { ClassroomService } from './classroom.service';

const pubSub = new PubSub();

@UseGuards(GqlAuthGuard)
@Resolver(() => Classroom)
export class ClassroomsResolver {
  constructor(private readonly classroomService: ClassroomService) {}

  @Query(() => [Classroom])
  async classrooms(
    @Args() classroomsArgs: ClassroomsArgs,
    @CurrentUser() user: SupabaseAuthUser,
  ): Promise<Classroom[]> {
    const { skip, take } = classroomsArgs;
    return this.classroomService.getAll({ skip, take, teacherId: user.id });
  }

  @Mutation(() => Classroom)
  async addClassroom(
    @CurrentUser() user: SupabaseAuthUser,
    @Args('newClassroomData') newClassroomData: NewClassroomInput,
  ): Promise<Classroom> {
    const newClassroom = await this.classroomService.create(
      user.id,
      newClassroomData.lessons,
    );
    pubSub.publish('classroomAdded', { classroomAdded: newClassroom });
    return newClassroom;
  }
}
