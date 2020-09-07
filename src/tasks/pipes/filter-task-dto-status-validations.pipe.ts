import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from '../task-status.enum';

export class FilterTaskDtoStatusValidationPipe implements PipeTransform {

    transform(value: any) {

        if (value === undefined) return value;

        const { status } = value;

        if (status) {
            const upperStatus = status.toUpperCase();
            if (Object.values(TaskStatus).includes(upperStatus))
                return status;
            throw new BadRequestException(`Status ${value} is not a valid state.`);
        }
    }
}