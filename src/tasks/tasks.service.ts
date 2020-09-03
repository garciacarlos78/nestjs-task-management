import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
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

    updateTaskStatus(id: string, newStatus: string): Task {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            newStatus = newStatus.toLocaleUpperCase();
            switch (newStatus) {
                case 'OPEN':
                    task.status = TaskStatus.OPEN;
                    break;
                case 'IN_PROGRESS':
                    task.status = TaskStatus.IN_PROGRESS;
                    break;
                case 'DONE':
                    task.status = TaskStatus.DONE;
                    break;
                default:
                    console.log("Status not valid");                    
            }
        } else {
            console.log("Task id not found");
        }
        return task;
    }
}
