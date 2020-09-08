import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(
        @GetUser() user: User,
        @Query(ValidationPipe) filterTaskDto: FilterTaskDto
    ): Promise<Task[]> {
        return this.tasksService.getTasks(user, filterTaskDto);
    }

    @Get(':id')
    getTaskById(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(user, id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    postTask(
        @GetUser() user: User,
        @Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(user, createTaskDto);
    }

    @Delete(':id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return this.tasksService.deleteTaskById(id).then(() => `Task with id ${id} deleted`);
    }

    @Patch(':id/status')
    updateTask(
        @GetUser() user:User,
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(user, id, status);
    }
}
