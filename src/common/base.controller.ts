import { BaseHttpController, HttpResponseMessage, JsonContent } from 'inversify-express-utils';
import { IPaginationMeta } from './pagination';
import { StatusCodes } from 'http-status-codes';

export class BaseController extends BaseHttpController {
  public successResponse(message: string, statusCode?: number, data?: { data: any; pagination?: IPaginationMeta }) {
    const status = statusCode || StatusCodes.OK;
    const response = new HttpResponseMessage(status);
    response.content = new JsonContent({ success: true, statusCode: status, message, ...data });
    return response;
  }

  public failResponse(message: string, statusCode?: number, error?: object) {
    const status = statusCode || StatusCodes.BAD_REQUEST;
    const response = new HttpResponseMessage(status);
    response.content = new JsonContent({ success: false, statusCode: status, message, error });
    return response;
  }
}
