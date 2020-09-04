import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    /*
    getAllTasks(): Task[] {
        return this.tasks;
    }
    */

    async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne(id);
        if (!task) throw new NotFoundException(`Task with id ${id} not found.`);
        return task;
    }

    async deleteTaskById(id: number) {
        const {affected} = await this.taskRepository.delete(id);
        if (affected === 0) throw new NotFoundException(`Task with id ${id} not found.`);
    }


    /*

    getFilteredTasks(filterTaskDto: FilterTaskDto): Task[] {

        const { status, search } = filterTaskDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task => (
                task.title.includes(search) ||
                task.description.includes(search)
            ));
        }

        return tasks;
    }
    */

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }


    /*
    updateTaskStatus(id: string, newStatus: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = newStatus;
        return task;
    }
    */
}
