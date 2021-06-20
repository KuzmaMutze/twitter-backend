import express from "express";
import cloudinary from "../core/cloudinary";

class UploadFileController {
    async upload(req: express.Request, res: express.Response): Promise<void>{
        try {
            const file = req.file
            // const filePath = '../uploads/' + file.path

            cloudinary.v2.uploader.upload_stream({resource_type: "auto"}, function(error, result) {
                if (error || !result) {
                    return res.status(500).json({
                        status: "error",
                        message: error || "upload error"
                    })
                }
                res.status(201).json({
                    url: result.url,
                    size: Math.round(result.bytes / 1024),
                    height: result.height,
                    width: result.width
                })
            }).end(file.buffer)
            
        } catch (error) {
            res.status(500).json({
                status: "error",
                data: error
            })
        }
    }
    
    
}

export const UploadCtrl = new UploadFileController()