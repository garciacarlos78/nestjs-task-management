import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) { }

    /*
    @Get()
    getTasks(
        @Query(ValidationPipe) filterTaskDto:FilterTaskDto
    ): Task[] {
        if (Object.keys(filterTaskDto).length) {
            return this.tasksService.getFilteredTasks(filterTaskDto);
        } else {
            return this.tasksService.getAllTasks();
        }
    }

    @Get(':id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    postTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete(':id')
    deleteTaskById(@Param('id') id: string): string {
        this.tasksService.deleteTaskById(id);
        return `Task with id ${id} deleted`;
    }

    @Patch(':id/status')
    updateTask(
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Task {
        return this.tasksService.updateTaskStatus(id, status);
    }
    */
}
