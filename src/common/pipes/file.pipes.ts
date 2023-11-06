import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import xlsx from 'node-xlsx';
import { Readable } from 'stream';
@Injectable()
export class FilePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        // const outputFileName = "output.json";
        // const stream = createWriteStream(outputFileName, { flags: 'w' });
        // stream.write(JSON.stringify(xlsx.parse(value.buffer)[0].data));'
        const stream = Readable.from(value.buffer);
        return stream
        // return xlsx.parse(value.buffer, {
        //     cellDates: true,
        //     cellNF: false,
        //     cellText: false
        // })[0].data
    }

}