import { createRequire } from 'node:module'
import { describe, expect, it, vi } from 'vitest'

const require = createRequire(import.meta.url)
const biomeLintStrict = require('../biome-lint-strict.js')

const createFakeProcess = () => ({
  stderr: { write: vi.fn() },
  stdout: { write: vi.fn() },
  exit: vi.fn(code => {
    throw new Error(`exit:${code}`)
  }),
})

describe('biome-lint-strict.js', () => {
  it('parses valid Biome JSON output', () => {
    const result = biomeLintStrict.parseBiomeJson(
      'prefix\n{"summary":{"errors":1,"warnings":2,"infos":3}}',
    )

    expect(result.summary).toEqual({ errors: 1, infos: 3, warnings: 2 })
  })

  it('falls back to parse summary when full JSON is invalid', () => {
    const invalidControlChar = String.fromCharCode(1)
    const result = biomeLintStrict.parseBiomeJson(
      `prefix\n{"diagnostics":[{"message":"bad ${invalidControlChar} char"}],"summary":{"errors":0,"warnings":4,"infos":0}}`,
    )

    expect(result).toEqual({ summary: { errors: 0, warnings: 4, infos: 0 } })
  })

  it('exits 0 when strict summary has no diagnostics', () => {
    const processObj = createFakeProcess()
    const runReadableLint = vi.fn()

    expect(() =>
      biomeLintStrict.main(['.'], {
        runBiomeJsonLint: () => ({
          stdout: '{"summary":{"errors":0,"warnings":0,"infos":0}}',
        }),
        parseBiomeJson: biomeLintStrict.parseBiomeJson,
        runReadableLint,
        processObj,
        consoleObj: { error: vi.fn() },
      }),
    ).toThrow('exit:0')

    expect(runReadableLint).not.toHaveBeenCalled()
    expect(processObj.stdout.write).toHaveBeenCalledWith(
      'Checked with strict mode: 0 errors, 0 warnings, 0 infos.\n',
    )
  })

  it('exits with readable lint status when readable lint fails', () => {
    const processObj = createFakeProcess()

    expect(() =>
      biomeLintStrict.main(['.'], {
        runBiomeJsonLint: () => ({
          stdout: '{"summary":{"errors":0,"warnings":1,"infos":0}}',
        }),
        parseBiomeJson: biomeLintStrict.parseBiomeJson,
        runReadableLint: () => ({ status: 2 }),
        processObj,
        consoleObj: { error: vi.fn() },
      }),
    ).toThrow('exit:2')
  })

  it('exits with json run status when JSON parsing fails', () => {
    const processObj = createFakeProcess()
    const consoleObj = { error: vi.fn() }

    expect(() =>
      biomeLintStrict.main(['.'], {
        runBiomeJsonLint: () => ({
          stderr: 'biome stderr',
          status: 7,
          stdout: 'not-json',
        }),
        parseBiomeJson: () => {
          throw new Error('parse failed')
        },
        runReadableLint: vi.fn(),
        processObj,
        consoleObj,
      }),
    ).toThrow('exit:7')

    expect(processObj.stdout.write).toHaveBeenCalledWith('not-json')
    expect(processObj.stderr.write).toHaveBeenCalledWith('biome stderr')
    expect(consoleObj.error).toHaveBeenCalledWith(
      'Failed to parse Biome JSON output: parse failed',
    )
  })

  it('exits 1 when JSON lint spawn fails', () => {
    const processObj = createFakeProcess()
    const consoleObj = { error: vi.fn() }

    expect(() =>
      biomeLintStrict.main(['.'], {
        runBiomeJsonLint: () => ({ error: new Error('spawn failed') }),
        parseBiomeJson: biomeLintStrict.parseBiomeJson,
        runReadableLint: vi.fn(),
        processObj,
        consoleObj,
      }),
    ).toThrow('exit:1')

    expect(consoleObj.error).toHaveBeenCalledWith('spawn failed')
  })

  it('exits 1 when readable lint spawn fails', () => {
    const processObj = createFakeProcess()
    const consoleObj = { error: vi.fn() }

    expect(() =>
      biomeLintStrict.main(['.'], {
        runBiomeJsonLint: () => ({
          stdout: '{"summary":{"errors":0,"warnings":1,"infos":0}}',
        }),
        parseBiomeJson: biomeLintStrict.parseBiomeJson,
        runReadableLint: () => ({
          error: new Error('readable spawn failed'),
        }),
        processObj,
        consoleObj,
      }),
    ).toThrow('exit:1')

    expect(consoleObj.error).toHaveBeenCalledWith('readable spawn failed')
  })

  it('exits 1 when diagnostics exist and readable lint returns status 0', () => {
    const processObj = createFakeProcess()
    const consoleObj = { error: vi.fn() }

    expect(() =>
      biomeLintStrict.main(['.'], {
        runBiomeJsonLint: () => ({
          stdout: '{"summary":{"errors":1,"warnings":2,"infos":3}}',
        }),
        parseBiomeJson: biomeLintStrict.parseBiomeJson,
        runReadableLint: () => ({ status: 0 }),
        processObj,
        consoleObj,
      }),
    ).toThrow('exit:1')

    expect(consoleObj.error).toHaveBeenCalledWith(
      'Strict summary: errors 1, warnings 2, infos 3.',
    )
  })
})
