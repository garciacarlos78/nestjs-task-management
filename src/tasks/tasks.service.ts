import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository) 
        private taskRepository:TaskRepository
    ) {}

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
   
    createTask(createTaskDto: CreateTaskDto) :Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    /*
    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;

        const task: Task = {
            id: "id-" + Math.random(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);
        return task;
    }

    deleteTaskById(id: string): void {
        const index = this.tasks.findIndex(task => task.id === id);

        if (index === -1)
            throw new NotFoundException(`Task with id ${id} not found.`);

        this.tasks.splice(index, 1);
    }

    updateTaskStatus(id: string, newStatus: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = newStatus;
        return task;
    }
    */
}
