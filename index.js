const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');
const { execSync } = require("child_process");

const main = () => {
  const sha = context.sha;
  const token = core.getInput('github-token');
  const dir = core.getInput('working-directory');
  
  const commands = [];
  if (dir) commands.push(`cd ${dir}`);
  commands.push(core.getInput("test-command") || "npx jest");

  const testCommand = commands.join('; ');

  const codeCoverage = execSync(testCommand).toString();

  const output = {
    title: 'Code coverage',
    summary: '',
    annotations: [{
      path: 'src/',
      start_line: 1,
      end_line: 1,
      annotation_level: 'notice',
      message: codeCoverage
    }]
  }
  const github = new GitHub(token)
  return github.checks.create({
      ...context.repo,
      name: 'Code coverage',
      head_sha: sha,
      conclusion: 'success',
      output
    });
    
};

main().catch((e) => core.setFailed(e.message));
