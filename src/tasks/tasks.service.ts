import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { DeleteResult } from 'typeorm';
import { User } from '../auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTasks(
        user: User,
        filterTaskDto: FilterTaskDto): Promise<Task[]> {
        return this.taskRepository.getTasks(user, filterTaskDto);
    }

    async getTaskById(user: User, id: number): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!task) throw new NotFoundException(`Task with id ${id} not found.`);
        return task;
    }

    async deleteTaskById(userId: number, id: number) {
        const { affected } = await this.taskRepository.delete( { id, userId});
        if (affected === 0) throw new NotFoundException(`Task with id ${id} not found.`);
    }

    createTask(user: User, createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(user, createTaskDto);
    }

    async updateTaskStatus(user: User, id: number, newStatus: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(user, id);
        task.status = newStatus;
        await task.save();
        return task;
    }
}
