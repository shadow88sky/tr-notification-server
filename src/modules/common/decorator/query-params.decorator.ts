/**
 * QueryParams decorator.
 * @file 请求参数解析装饰器
 * @module decorator/query-params
 *
 */

import lodash from 'lodash';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomError } from '../../../errors/custom.error';

// 预置转换器可选字段
export enum EQueryParamsField {
  Page = 'page',
  Limit = 'limit',
  Sort = 'sort',
  Date = 'date',
  Keyword = 'keyword',
  ParamsId = 'paramsId',
}

// 内部参数类型
export interface IQueryParamsConfig {
  [key: string]: string | number | boolean | Date | RegExp | IQueryParamsConfig;
}

// 导出结构
export interface IQueryParamsResult {
  querys: IQueryParamsConfig; // 用于 paginate 的查询参数
  options: IQueryParamsConfig; // 用于 paginate 的查询配置参数
  params: IQueryParamsConfig; // 路由参数
  origin: IQueryParamsConfig; // 原味的 querys 参数
  request: any; // 用于 request 的对象
  visitors: {
    // 访客信息
    ip: string; // 真实 IP
    ua: string; // 用户 UA
    referer: string; // 跳转来源
  };
  isAuthenticated: boolean; // 是否鉴权
}

// 入参转换配置
interface ITransformConfigObject {
  [key: string]: string | number | boolean;
}
export type TTransformConfig =
  | EQueryParamsField
  | string
  | ITransformConfigObject;

// 验证器结构
interface IValidateError {
  name: string;
  field: EQueryParamsField;
  isAllowed: boolean;
  isIllegal: boolean;
  setValue(): void;
}

/**
 * 参数解析器构造器
 * @function QueryParams
 * @description 根据入参配置是否启用某些参数的验证和解析
 * @example @QueryParams()
 * @example @QueryParams([EQPFields.State, EQPFields.Date, { [EQPFields.Page]: 1 }])
 * @example @QueryParams(['custom_query_params', { test_params: true, [EQueryParamsField.Sort]: false }])
 */
export const QueryParams = createParamDecorator(
  (
    customConfig: TTransformConfig[],
    context: ExecutionContext,
  ): IQueryParamsResult => {
    // context to request
    const request = context.switchToHttp().getRequest();

    // 是否已验证权限
    // const isAuthenticated = request.isAuthenticated();
    const isAuthenticated = true;

    // 字段转换配置（字符串则代表启用，对象则代表默认值）
    const transformConfig: IQueryParamsConfig = {
      [EQueryParamsField.Page]: 1,
      [EQueryParamsField.Limit]: 10,
      [EQueryParamsField.ParamsId]: 'id',
      [EQueryParamsField.Sort]: true,
    };

    // 合并配置
    if (customConfig) {
      customConfig.forEach((field) => {
        if (lodash.isString(field)) {
          transformConfig[<string>field] = true;
        }
        if (lodash.isObject(field)) {
          Object.assign(transformConfig, field);
        }
      });
    }

    // 查询参数
    const querys: IQueryParamsConfig = {};

    // 过滤条件
    const options: IQueryParamsConfig = {};

    // 路径参数
    const params: IQueryParamsConfig = lodash.merge(
      { url: request.url },
      request.params,
    );

    // 初始参数
    const date = request.query.date;
    const paramsId = request.params[transformConfig.paramsId as string];
    const [page, limit, sort] = [
      request.query.page || transformConfig.page,
      request.query.limit || transformConfig.limit,
      request.query.sort,
    ].map((item) => (item != null ? Number(item) : item));

    // 参数提取验证规则
    // 1. field 用于校验这个字段是否被允许用做参数
    // 2. isAllowed 请求参数是否在允许规则之内 -> 400
    // 3. isIllegal 请求参数是否不合法地调用了管理员权限参数 -> 403
    // 任一条件返回错误；否则，设置或重置参数
    const validates: IValidateError[] = [
      {
        name: '路由/ID',
        field: EQueryParamsField.ParamsId,
        isAllowed: true,
        isIllegal: paramsId != null && !isAuthenticated && isNaN(paramsId),
        setValue() {
          // 如果用户传了 ID，则转为数字或 ObjectId
          if (paramsId != null) {
          }
        },
      },
      {
        name: '排序/sort',
        field: EQueryParamsField.Sort,
        isAllowed: lodash.isUndefined(sort) || [].includes(sort),
        isIllegal: false,
        setValue() {
        },
      },
      {
        name: '目标页/page',
        field: EQueryParamsField.Page,
        isAllowed:
          lodash.isUndefined(page) ||
          (lodash.isInteger(page) && Number(page) > 0),
        isIllegal: false,
        setValue() {
          if (page != null) {
            options.page = page;
          }
        },
      },
      {
        name: '每页数量/limit',
        field: EQueryParamsField.Limit,
        isAllowed:
          lodash.isUndefined(limit) ||
          (lodash.isInteger(limit) && Number(limit) > 0),
        isIllegal: false,
        setValue() {
          if (limit != null) {
            options.limit = limit;
          }
        },
      },
      {
        name: '日期查询/date',
        field: EQueryParamsField.Date,
        isAllowed:
          lodash.isUndefined(date) ||
          new Date(date).toString() !== 'Invalid Date',
        isIllegal: false,
        setValue() {
          //
          if (date != null) {
            // mongo date = current date -  8 hours
            const queryDate = new Date(date);
            querys.createdAt = {
              $gte: new Date(((queryDate as any) / 1000 - 60 * 60 * 8) * 1000),
              $lt: new Date(((queryDate as any) / 1000 + 60 * 60 * 16) * 1000),
            };
          }
        },
      },
    ];

    // 验证字段是否被允许
    const isEnableField = (field) => field != null && field !== false;

    // 验证参数及生成参数
    validates.forEach((validate) => {
      if (!isEnableField(transformConfig[validate.field])) {
        return false;
      }
      if (!validate.isAllowed) {
        throw new CustomError('参数不合法：' + validate.name);
      }
      if (validate.isIllegal) {
        throw new CustomError('权限与参数匹配不合法：' + validate.name);
      }
      validate.setValue();
    });

    /**
     * 处理剩余的规则外参数
     * 1. 用户传入配置与默认配置混合得到需要处理的参数字段
     * 2. 内置一堆关键参数的校验器
     * 3. 剩下的非内部校验的非关键参数，在此合并至 querys
     */

    // 已处理字段
    const isProcessedFields = validates.map((validate) => validate.field);
    // 配置允许的字段
    const allAllowFields = Object.keys(transformConfig);
    // 剩余的待处理字段 = 配置允许的字段 - 已处理字段
    const todoFields = lodash.difference(allAllowFields, isProcessedFields);
    // 将所有待处理字段循环，将值循环至 querys
    todoFields.forEach((field) => {
      const targetValue = request.query[field];
      if (targetValue != null) querys[field] = targetValue;
    });

    // 挂载到 request 上下文
    request.queryParams = { querys, options, params, isAuthenticated };

    // 来源 IP
    const ip = (
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket.remoteAddress ||
      request.ip ||
      request.ips[0]
    ).replace('::ffff:', '');

    // 用户标识
    const ua = request.headers['user-agent'];

    const result = {
      querys,
      options,
      params,
      request,
      origin: request.query,
      visitors: { ip, ua, referer: request.referer },
      isAuthenticated,
    };

    //
    //
    //
    //
    return result;
  },
);
