import { HttpError } from 'hoa'
import { pipe, makeCtx, createValidator, formatValue } from 'nana'
import isEmail from 'validator/lib/isEmail.js'
import isURL from 'validator/lib/isURL.js'

const n = {
  pipe,

  required: createValidator('required', (value, ctx, args) => {
    const [msg] = args

    if (value == null) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ required`)
    }

    return value
  }),

  optional: createValidator('optional', (value, ctx, args) => {
    if (value == null) {
      ctx.__abortPipe = true
      return value
    }

    return value
  }),

  default: createValidator('default', (value, ctx, args) => {
    const [defaultValue] = args

    if (value == null) {
      value = defaultValue
    }

    return value
  }),

  string: createValidator('string', (value, ctx, args) => {
    const [msg] = args

    if (typeof value !== 'string') {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ string`)
    }

    return value
  }),

  number: createValidator('number', (value, ctx, args) => {
    const [msg] = args

    if (typeof value !== 'number') {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ number`)
    }

    return value
  }),

  integer: createValidator('integer', (value, ctx, args) => {
    const [msg] = args

    if (!Number.isInteger(value)) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ integer`)
    }

    return value
  }),

  boolean: createValidator('boolean', (value, ctx, args) => {
    const [msg] = args

    if (typeof value !== 'boolean') {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ boolean`)
    }

    return value
  }),

  object: createValidator('object', (value, ctx, args) => {
    const [obj, msg] = args

    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ object`)
    }

    const result = {}
    for (const key in obj) {
      const childCtx = makeCtx(ctx, key, value[key])
      result[key] = obj[key](value[key], childCtx)
    }
    return result
  }),

  array: createValidator('array', (value, ctx, args) => {
    const [validator, msg] = args

    if (!Array.isArray(value)) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ array`)
    }

    return value.map((item, i) => {
      const childCtx = makeCtx(ctx, i, item)
      return validator(item, childCtx)
    })
  }),

  // ------------- transform -------------
  trim: createValidator('trim', (value, ctx, args) => {
    return value.trim()
  }),

  toInteger: createValidator('toInteger', (value, ctx, args) => {
    const [msg] = args

    value = Number.parseInt(value)
    if (!Number.isInteger(value)) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ integer`)
    }

    return value
  }),

  toDate: createValidator('toDate', (value, ctx, args) => {
    const [msg] = args
    const date = new Date(value)
    if (String(date) === 'Invalid Date') {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ Date`)
    }
    return date
  }),

  // ------------- validator -------------
  enum: createValidator('enum', (value, ctx, args) => {
    const [expected, msg] = args

    if (!expected.includes(value)) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ enum`)
    }

    return value
  }),

  length: createValidator('length', (value, ctx, args) => {
    const [expected, msg] = args

    if (typeof expected === 'number') {
      if (value.length !== expected) {
        throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ length`)
      }
    } else if (Array.isArray(expected)) {
      if ((value.length < expected[0]) || (value.length > expected[1])) {
        throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ length`)
      }
    }

    return value
  }),

  range: createValidator('range', (value, ctx, args) => {
    const [expected, msg] = args

    if ((value < expected[0]) || (value > expected[1])) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ range`)
    }

    return value
  }),

  gt: createValidator('gt', (value, ctx, args) => {
    const [expected, msg] = args

    if (value <= expected) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ gt`)
    }

    return value
  }),

  gte: createValidator('gte', (value, ctx, args) => {
    const [expected, msg] = args

    if (value < expected) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ gte`)
    }

    return value
  }),

  isEmail: createValidator('isEmail', (value, ctx, args) => {
    const [msg] = args

    if (!isEmail(value)) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ isEmail`)
    }

    return value
  }),

  isURL: createValidator('isURL', (value, ctx, args) => {
    const [msg] = args

    if (!isURL(value)) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ isURL`)
    }

    return value
  }),

  pattern: createValidator('pattern', (value, ctx, args) => {
    const [expected, msg] = args

    if (!expected.test(value)) {
      throw new HttpError(400, msg || `(${ctx.path}: ${formatValue(value)}) ✖ pattern`)
    }

    return value
  })
}

export default n
