import { PartialType } from '@nestjs/swagger';
import { CreatePagoEmpleadoDto } from './create-pago.dto';

export class UpdatePagoEmpleadoDto extends PartialType(CreatePagoEmpleadoDto) {}
