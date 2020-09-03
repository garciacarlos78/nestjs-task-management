import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find(task => task.id === id);
        
        if (!task) throw new NotFoundException(`Task with id ${id} not found.`);
        
        return task;
    }

    getFilteredTasks(filterTaskDto:FilterTaskDto) : Task[] {

        const {status, search} = filterTaskDto;

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

    deleteTaskById(id: string): boolean {
        const index = this.tasks.findIndex(task => task.id === id);

        if (index === -1) return false;
        else {
            this.tasks.splice(index, 1);
            return true;
        }
    }

    updateTaskStatus(id: string, newStatus: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = newStatus;
        return task;
    }
}
