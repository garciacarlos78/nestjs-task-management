import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
    transform(value: any) {
        const upperValue = value.toUpperCase();
        if (Object.values(TaskStatus).includes(upperValue))
            return value;
        throw new BadRequestException(`Status ${value} is not a valid state.`);
    }
}