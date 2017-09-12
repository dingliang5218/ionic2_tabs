/**
 */
import {Injectable} from '@angular/core';
import {HttpService} from "./HttpService";
import {FILE_SERVE_URL} from './Constants';
import {FileObj} from "../model/FileObj";
import {Response} from "@angular/http";

@Injectable()
export class FileService {
  constructor(private httpService: HttpService) {
  }

  /**
   * 根据文件id获取文件信息
   * @param id 文件id
   * @return {Promise<TResult|T>}
   */
  getFileInfoById(id: string) {
    return this.httpService.get(FILE_SERVE_URL + '/getById', {id: id}).map((res: Response) => res.json());
  }

  /**
   * app上传图片,只支持上传base64字符串
   * @param fileList,数组中的对象必须包含bse64属性
   * @return {Promise<TResult|T>}
   */
  uploadPictures(fileList: FileObj[]) {
    return this.httpService.post(FILE_SERVE_URL + '/appUpload', fileList).map((res: Response) => res.json());
  }

  /**
   * app上传图片,只支持上传base64字符串
   * @param FileObj,必须包含bse64属性
   * @return {Promise<TResult|T>}
   */
  uploadPicture(FileObj: FileObj) {
    return this.httpService.post(FILE_SERVE_URL + '/appUpload', [FileObj]).map((res: Response) => res.json());
  }

}
