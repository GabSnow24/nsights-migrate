import { Controller, Param, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express'
import { FilePipe } from 'src/common/pipes/file.pipes'
import { ClientService } from "./client.service";

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }
    @Post("file")
    @UseInterceptors(FileInterceptor('file'))
    createByFile(
        @UploadedFile(new FilePipe()) file: Express.Multer.File
    ) {
        return this.clientService.createByFile(file)
    }
    @Post("image")
    @UseInterceptors(FileInterceptor('imagesFile'))
    updateImages(
        @UploadedFile(new FilePipe()) imagesFile: Express.Multer.File
    ) {
        return this.clientService.updateImages(imagesFile)
    }

    @Post("views")
    createViews(@Query('filter') filter: string) {
        return this.clientService.createViews(filter)
    }
}