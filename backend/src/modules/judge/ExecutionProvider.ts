import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { LanguageId } from '@codeforge/shared';
import { ExecutionRequest, ExecutionResult, CompilationRequest, CompilationResult } from './types';
import { logger } from '../../core/utils/logger';

export interface IExecutionProvider {
  compile(request: CompilationRequest): Promise<CompilationResult>;
  execute(request: ExecutionRequest): Promise<ExecutionResult>;
}

export class LocalProcessExecutionProvider implements IExecutionProvider {
  private defaultOutputLimitBytes = 64 * 1024; // 64 KB

  public async compile(request: CompilationRequest): Promise<CompilationResult> {
    const startTime = Date.now();
    const { languageId, sourceCode, workDir } = request;

    let fileName = 'solution';
    let compileCmd = request.compileCommand;

    switch (languageId) {
      case LanguageId.CPP:
        fileName = 'solution.cpp';
        break;
      case LanguageId.C:
        fileName = 'solution.c';
        break;
      case LanguageId.JAVA:
        fileName = 'Main.java';
        break;
      case LanguageId.RUST:
        fileName = 'solution.rs';
        break;
      case LanguageId.GO:
        fileName = 'solution.go';
        break;
      case LanguageId.TYPESCRIPT:
        fileName = 'solution.ts';
        break;
      case LanguageId.JAVASCRIPT:
      case LanguageId.PYTHON:
      default:
        // Interpreted languages do not require compilation
        return {
          success: true,
          compileOutput: 'Compilation not required',
          compilationTimeMs: 0,
        };
    }

    const filePath = path.join(workDir, fileName);
    fs.writeFileSync(filePath, sourceCode, 'utf-8');

    // If no compiler command is provided or if interpreted, return success
    if (!compileCmd) {
      return {
        success: true,
        compileOutput: 'Compiled successfully',
        compilationTimeMs: Date.now() - startTime,
      };
    }

    // Replace placeholders
    const resolvedCmd = compileCmd
      .replace(/\{file\}/g, fileName)
      .replace(/\{outDir\}/g, '.')
      .replace(/\{basename\}/g, path.parse(fileName).name);

    return new Promise<CompilationResult>(resolve => {
      const isWindows = process.platform === 'win32';
      const shell = isWindows ? 'cmd.exe' : '/bin/sh';
      const shellArg = isWindows ? '/c' : '-c';

      const child = spawn(shell, [shellArg, resolvedCmd], {
        cwd: workDir,
        env: { ...process.env, PATH: process.env.PATH },
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', data => {
        stdout += data.toString();
      });

      child.stderr.on('data', data => {
        stderr += data.toString();
      });

      const timeout = setTimeout(() => {
        child.kill();
        resolve({
          success: false,
          compileOutput: 'Compilation timed out',
          compilationTimeMs: Date.now() - startTime,
          error: 'Compilation timed out',
        });
      }, 10000);

      child.on('close', code => {
        clearTimeout(timeout);
        const compilationTimeMs = Date.now() - startTime;
        const output = (stderr + '\n' + stdout).trim();

        if (code === 0) {
          resolve({
            success: true,
            compileOutput: output || 'Compilation successful',
            compilationTimeMs,
          });
        } else {
          resolve({
            success: false,
            compileOutput: output || `Compilation failed with exit code ${code}`,
            compilationTimeMs,
            error: output,
          });
        }
      });

      child.on('error', err => {
        clearTimeout(timeout);
        resolve({
          success: false,
          compileOutput: `Compiler invocation error: ${err.message}`,
          compilationTimeMs: Date.now() - startTime,
          error: err.message,
        });
      });
    });
  }

  public async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codeforge-judge-'));
    const startTime = Date.now();
    const outputLimit = request.outputLimitBytes || this.defaultOutputLimitBytes;

    try {
      let runCommand = request.runCommand;
      let fileName = 'solution';

      switch (request.languageId) {
        case LanguageId.PYTHON:
          fileName = 'solution.py';
          if (!runCommand) runCommand = 'python -u {file}';
          break;
        case LanguageId.JAVASCRIPT:
          fileName = 'solution.js';
          if (!runCommand) runCommand = 'node {file}';
          break;
        case LanguageId.TYPESCRIPT:
          fileName = 'solution.ts';
          if (!runCommand) runCommand = 'npx tsx {file}';
          break;
        case LanguageId.JAVA:
          fileName = 'Main.java';
          if (!runCommand) runCommand = 'java -cp {outDir} Main';
          break;
        case LanguageId.CPP:
          fileName = 'solution.cpp';
          if (!runCommand) runCommand = process.platform === 'win32' ? '{outDir}\\main.exe' : '{outDir}/main';
          break;
        case LanguageId.C:
          fileName = 'solution.c';
          if (!runCommand) runCommand = process.platform === 'win32' ? '{outDir}\\main.exe' : '{outDir}/main';
          break;
        case LanguageId.GO:
          fileName = 'solution.go';
          if (!runCommand) runCommand = 'go run {file}';
          break;
        case LanguageId.RUST:
          fileName = 'solution.rs';
          if (!runCommand) runCommand = process.platform === 'win32' ? '{outDir}\\main.exe' : '{outDir}/main';
          break;
      }

      const filePath = path.join(tempDir, fileName);
      fs.writeFileSync(filePath, request.sourceCode, 'utf-8');

      // If compiled, compile first
      if (request.isCompiled && request.compilerCommand) {
        const compResult = await this.compile({
          languageId: request.languageId,
          sourceCode: request.sourceCode,
          workDir: tempDir,
          compileCommand: request.compilerCommand,
        });

        if (!compResult.success) {
          return {
            stdout: '',
            stderr: compResult.compileOutput,
            exitCode: 1,
            executionTimeMs: compResult.compilationTimeMs,
            memoryKb: 0,
            isTimeout: false,
            isMemoryExceeded: false,
            isOutputExceeded: false,
            error: compResult.error || 'Compilation error',
          };
        }
      }

      // Prepare command line
      const resolvedRunCmd = runCommand
        .replace(/\{file\}/g, fileName)
        .replace(/\{outDir\}/g, '.')
        .replace(/\{basename\}/g, path.parse(fileName).name);

      return await this.runProcess(resolvedRunCmd, tempDir, request.inputData, request.timeLimitMs, outputLimit);
    } catch (err: any) {
      return {
        stdout: '',
        stderr: err.message,
        exitCode: 1,
        executionTimeMs: Date.now() - startTime,
        memoryKb: 0,
        isTimeout: false,
        isMemoryExceeded: false,
        isOutputExceeded: false,
        error: err.message,
      };
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupErr) {
        logger.warn({ cleanupErr, tempDir }, 'Failed to remove judge temp workspace');
      }
    }
  }

  private runProcess(
    commandStr: string,
    workDir: string,
    inputData: string,
    timeLimitMs: number,
    outputLimitBytes: number,
  ): Promise<ExecutionResult> {
    return new Promise<ExecutionResult>(resolve => {
      const startTime = Date.now();
      const isWindows = process.platform === 'win32';
      const shell = isWindows ? 'cmd.exe' : '/bin/sh';
      const shellArg = isWindows ? '/c' : '-c';

      let child: ChildProcess;
      try {
        child = spawn(shell, [shellArg, commandStr], {
          cwd: workDir,
          env: {
            ...process.env,
            NODE_ENV: 'production',
          },
        });
      } catch (spawnErr: any) {
        return resolve({
          stdout: '',
          stderr: spawnErr.message,
          exitCode: 1,
          executionTimeMs: 0,
          memoryKb: 0,
          isTimeout: false,
          isMemoryExceeded: false,
          isOutputExceeded: false,
          error: spawnErr.message,
        });
      }

      let stdout = '';
      let stderr = '';
      let isTimeout = false;
      let isOutputExceeded = false;
      let peakMemoryKb = 1024; // Baseline 1MB

      // Memory sampling interval
      const memInterval = setInterval(() => {
        if (child.pid) {
          try {
            const usage = process.memoryUsage();
            const currentKb = Math.round(usage.rss / 1024);
            if (currentKb > peakMemoryKb) {
              peakMemoryKb = currentKb;
            }
          } catch {
            // Ignore
          }
        }
      }, 50);

      // Timeout handler
      const timeoutHandle = setTimeout(() => {
        isTimeout = true;
        try {
          if (isWindows && child.pid) {
            spawn('taskkill', ['/pid', child.pid.toString(), '/f', '/t']);
          } else {
            child.kill('SIGKILL');
          }
        } catch {
          // ignore
        }
      }, timeLimitMs);

      // Pass input via stdin
      if (inputData && child.stdin) {
        try {
          child.stdin.write(inputData);
          if (!inputData.endsWith('\n')) {
            child.stdin.write('\n');
          }
          child.stdin.end();
        } catch {
          // stdin closed
        }
      } else if (child.stdin) {
        try {
          child.stdin.end();
        } catch {
          // ignore
        }
      }

      child.stdout?.on('data', data => {
        if (stdout.length < outputLimitBytes) {
          stdout += data.toString();
        } else if (!isOutputExceeded) {
          isOutputExceeded = true;
          try {
            child.kill();
          } catch {
            // ignore
          }
        }
      });

      child.stderr?.on('data', data => {
        if (stderr.length < outputLimitBytes) {
          stderr += data.toString();
        }
      });

      child.on('close', code => {
        clearInterval(memInterval);
        clearTimeout(timeoutHandle);
        const executionTimeMs = Date.now() - startTime;

        resolve({
          stdout: stdout.trimEnd(),
          stderr: stderr.trimEnd(),
          exitCode: isTimeout ? null : code,
          executionTimeMs: Math.min(executionTimeMs, timeLimitMs),
          memoryKb: peakMemoryKb,
          isTimeout,
          isMemoryExceeded: false,
          isOutputExceeded,
          error: isTimeout ? 'Time Limit Exceeded' : (code !== 0 && code !== null ? stderr || `Process exited with code ${code}` : undefined),
        });
      });

      child.on('error', err => {
        clearInterval(memInterval);
        clearTimeout(timeoutHandle);
        resolve({
          stdout,
          stderr: err.message,
          exitCode: 1,
          executionTimeMs: Date.now() - startTime,
          memoryKb: peakMemoryKb,
          isTimeout: false,
          isMemoryExceeded: false,
          isOutputExceeded: false,
          error: err.message,
        });
      });
    });
  }
}
